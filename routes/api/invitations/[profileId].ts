import { FreshContext } from "$fresh/server.ts";

const ETHOS_API_BASE_V2 = "https://api.ethos.network/api/v2";

export const handler = async (
  _req: Request,
  ctx: FreshContext,
): Promise<Response> => {
  const profileId = ctx.params.profileId;

  if (!profileId || isNaN(Number(profileId))) {
    return new Response(
      JSON.stringify({ error: "Valid profile ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    console.log(`🔍 Fetching invitations for profile ${profileId}`);

    // Get invitation activities where this profile was the author (inviter)
    const userkey = `profileId:${profileId}`;
    const activitiesUrl = new URL(`${ETHOS_API_BASE_V2}/activities/userkey`);
    activitiesUrl.searchParams.set("userkey", userkey);
    activitiesUrl.searchParams.set("direction", "author");
    activitiesUrl.searchParams.set("activityType", "INVITATION");
    activitiesUrl.searchParams.set("limit", "100");
    activitiesUrl.searchParams.set("offset", "0");

    console.log(`📡 Fetching activities: ${activitiesUrl.toString()}`);

    const response = await fetch(activitiesUrl.toString(), {
      headers: {
        "Accept": "application/json",
        "User-Agent": "EthosInviteGraph/1.0",
        "X-Ethos-Client": "ethos-invite-graph@1.0.0",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ Activities API Error: ${response.status} - ${errorText}`,
      );

      return new Response(
        JSON.stringify({
          error: `Activities API error: ${response.status}`,
          details: errorText,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const activitiesData = await response.json();
    console.log(`✅ Found ${activitiesData.length} invitation activities`);

    // Extract invited user information from activities
    const invitedUsers = [];
    for (const activity of activitiesData) {
      if (activity.subject && activity.subject.userkey) {
        invitedUsers.push({
          userkey: activity.subject.userkey,
          profileId: activity.subject.profileId,
          username: activity.subject.username,
          displayName: activity.subject.displayName,
          avatarUrl: activity.subject.avatarUrl,
          score: activity.subject.score,
          invitedAt: activity.createdAt,
          activityId: activity.id,
        });
      }
    }

    console.log(`✅ Processed ${invitedUsers.length} invited users`);

    return new Response(
      JSON.stringify({
        inviter: { profileId: Number(profileId), userkey },
        invitedUsers,
        total: invitedUsers.length,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (error) {
    console.error("💥 Invitations fetch error:", error);
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error";
    return new Response(
      JSON.stringify({
        error: "Failed to fetch invitations",
        details: errorMessage,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
