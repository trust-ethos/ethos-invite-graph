/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />
import { FreshContext } from "$fresh/server.ts";
import { EthosUser } from "../../types/ethos.ts";

const RECENT_SEARCHES_KEY = ["global", "recent-searches"];
const MAX_RECENT_SEARCHES = 10; // Keep more in storage, show 3

export const handler = async (
  req: Request,
  _ctx: FreshContext,
): Promise<Response> => {
  const kv = await Deno.openKv();

  if (req.method === "POST") {
    // Add a new recent search
    try {
      const user: EthosUser = await req.json();

      // Get current recent searches from KV
      const result = await kv.get<EthosUser[]>(RECENT_SEARCHES_KEY);
      const currentSearches = result.value || [];

      // Remove if already exists (to move to front)
      const filtered = currentSearches.filter((item: EthosUser) =>
        item.profileId !== user.profileId
      );

      // Add to front and limit
      const updated = [user, ...filtered].slice(0, MAX_RECENT_SEARCHES);

      // Store in Deno KV (persistent storage)
      await kv.set(RECENT_SEARCHES_KEY, updated);

      console.log(
        `📝 Added global recent search to KV: ${
          user.username || user.displayName
        } (${user.profileId})`,
      );

      kv.close();
      return new Response(
        JSON.stringify({ success: true, count: updated.length }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      console.error("Error adding recent search to KV:", error);
      kv.close();
      return new Response(
        JSON.stringify({ error: "Failed to add recent search" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  } else if (req.method === "GET") {
    // Get recent searches from KV
    try {
      const result = await kv.get<EthosUser[]>(RECENT_SEARCHES_KEY);
      const recentSearches = result.value || [];

      // Return only the top 3 for display
      const topThree = recentSearches.slice(0, 3);

      console.log(`🌍 Retrieved ${topThree.length} recent searches from KV`);

      kv.close();
      return new Response(JSON.stringify(topThree), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    } catch (error) {
      console.error("Error getting recent searches from KV:", error);
      kv.close();
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  kv.close();
  return new Response("Method not allowed", { status: 405 });
};
