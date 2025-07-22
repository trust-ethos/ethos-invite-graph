import { FreshContext } from "$fresh/server.ts";
import { getCacheKey, getOrFetch } from "../../../utils/cache.ts";

const ETHOS_API_BASE_V2 = "https://api.ethos.network/api/v2";

interface NetworkNode {
  id: string;
  profileId: number;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  score?: number;
  level: number; // Distance from root node
}

interface NetworkEdge {
  source: string;
  target: string;
  type: "invitation";
}

interface NetworkGraphData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  rootProfileId: number;
  totalNodes: number;
  maxDepth: number;
}

export const handler = async (
  req: Request,
  ctx: FreshContext,
): Promise<Response> => {
  const profileId = ctx.params.profileId;
  const url = new URL(req.url);
  const maxDepth = parseInt(url.searchParams.get("depth") || "3");

  if (!profileId || isNaN(Number(profileId))) {
    return new Response(
      JSON.stringify({ error: "Valid profile ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    console.log(
      `🌐 Building network graph for profile ${profileId} with max depth ${maxDepth}`,
    );

    const nodes: Map<number, NetworkNode> = new Map();
    const edges: NetworkEdge[] = [];
    const processedProfiles = new Set<number>();

    // Recursive function to build the network
    async function buildNetwork(
      currentProfileId: number,
      currentLevel: number,
    ): Promise<void> {
      if (currentLevel > maxDepth || processedProfiles.has(currentProfileId)) {
        return;
      }

      processedProfiles.add(currentProfileId);
      console.log(
        `📊 Processing profile ${currentProfileId} at level ${currentLevel}`,
      );

      // Get user data for current profile with caching
      let userData = null;
      try {
        userData = await getOrFetch(
          getCacheKey("user-v2", currentProfileId),
          async () => {
            const userResponse = await fetch(
              `${ETHOS_API_BASE_V2}/users/by/profile-id`,
              {
                method: "POST",
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json",
                  "User-Agent": "EthosInviteGraph/1.0",
                  "X-Ethos-Client": "ethos-invite-graph@1.0.0",
                },
                body: JSON.stringify({ profileIds: [currentProfileId] }),
              },
            );

            if (userResponse.ok) {
              const usersData = await userResponse.json();
              return usersData.length > 0 ? usersData[0] : null;
            }
            return null;
          },
          "profile",
        );

        // Add current profile as a node
        nodes.set(currentProfileId, {
          id: `profile_${currentProfileId}`,
          profileId: currentProfileId,
          username: userData?.username,
          displayName: userData?.displayName,
          avatarUrl: userData?.avatarUrl,
          score: userData?.score,
          level: currentLevel,
        });

        // Get people this profile invited with caching and pagination
        const activitiesData = await getOrFetch(
          getCacheKey("invitations", currentProfileId),
          async () => {
            const allActivities: any[] = [];
            let offset = 0;
            const limit = 100;
            let hasMore = true;

            while (hasMore) {
              const activitiesUrl = new URL(
                `${ETHOS_API_BASE_V2}/activities/userkey`,
              );
              activitiesUrl.searchParams.set(
                "userkey",
                `profileId:${currentProfileId}`,
              );
              activitiesUrl.searchParams.set("direction", "author");
              activitiesUrl.searchParams.set("activityType", "INVITATION");
              activitiesUrl.searchParams.set("limit", limit.toString());
              activitiesUrl.searchParams.set("offset", offset.toString());

              const activitiesResponse = await fetch(activitiesUrl.toString(), {
                headers: {
                  "Accept": "application/json",
                  "User-Agent": "EthosInviteGraph/1.0",
                  "X-Ethos-Client": "ethos-invite-graph@1.0.0",
                },
              });

              if (activitiesResponse.ok) {
                const pageData = await activitiesResponse.json();
                allActivities.push(...pageData);

                // Check if we got fewer results than requested (end of data)
                hasMore = pageData.length === limit;
                offset += limit;
              } else {
                hasMore = false;
              }
            }

            return allActivities;
          },
          "invitations",
        );

        console.log(
          `✅ Profile ${currentProfileId} invited ${activitiesData.length} people`,
        );

        if (activitiesData.length > 0) {
          // Process each invited user
          for (const activity of activitiesData) {
            if (activity.subject?.profileId) {
              const invitedProfileId = activity.subject.profileId;

              // Add edge from current profile to invited profile
              edges.push({
                source: `profile_${currentProfileId}`,
                target: `profile_${invitedProfileId}`,
                type: "invitation",
              });

              // Recursively process the invited profile
              await buildNetwork(invitedProfileId, currentLevel + 1);
            }
          }
        }
      } catch (error) {
        console.error(
          `❌ Error processing profile ${currentProfileId}:`,
          error,
        );
      }
    }

    // Start building from the root profile
    await buildNetwork(Number(profileId), 0);

    const networkData: NetworkGraphData = {
      nodes: Array.from(nodes.values()),
      edges,
      rootProfileId: Number(profileId),
      totalNodes: nodes.size,
      maxDepth: Math.max(...Array.from(nodes.values()).map((n) => n.level)),
    };

    console.log(
      `🎯 Network graph built: ${networkData.totalNodes} nodes, ${networkData.edges.length} edges, depth ${networkData.maxDepth}`,
    );

    return new Response(JSON.stringify(networkData), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("💥 Network build error:", error);
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error";
    return new Response(
      JSON.stringify({
        error: "Failed to build network graph",
        details: errorMessage,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
