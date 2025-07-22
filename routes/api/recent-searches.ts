import { FreshContext } from "$fresh/server.ts";
import { EthosUser } from "../../types/ethos.ts";
import { cache } from "../../utils/cache.ts";

const RECENT_SEARCHES_KEY = "global-recent-searches";
const MAX_RECENT_SEARCHES = 10; // Keep more in storage, show 3

export const handler = async (
  req: Request,
  _ctx: FreshContext,
): Promise<Response> => {
  if (req.method === "POST") {
    // Add a new recent search
    try {
      const user: EthosUser = await req.json();

      // Get current recent searches
      const currentSearches = cache.get<EthosUser[]>(RECENT_SEARCHES_KEY) || [];

      // Remove if already exists (to move to front)
      const filtered = currentSearches.filter((item) =>
        item.profileId !== user.profileId
      );

      // Add to front and limit
      const updated = [user, ...filtered].slice(0, MAX_RECENT_SEARCHES);

      // Store with a longer TTL since it's global
      cache.set(RECENT_SEARCHES_KEY, updated, "network"); // 10 minutes

      console.log(
        `📝 Added global recent search: ${
          user.username || user.displayName
        } (${user.profileId})`,
      );

      return new Response(
        JSON.stringify({ success: true, count: updated.length }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      console.error("Error adding recent search:", error);
      return new Response(
        JSON.stringify({ error: "Failed to add recent search" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  } else if (req.method === "GET") {
    // Get recent searches
    try {
      const recentSearches = cache.get<EthosUser[]>(RECENT_SEARCHES_KEY) || [];

      // Return only the top 3 for display
      const topThree = recentSearches.slice(0, 3);

      return new Response(JSON.stringify(topThree), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    } catch (error) {
      console.error("Error getting recent searches:", error);
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};
