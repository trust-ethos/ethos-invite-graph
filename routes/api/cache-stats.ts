import { FreshContext } from "$fresh/server.ts";
import { cache } from "../../utils/cache.ts";

export const handler = (
  _req: Request,
  _ctx: FreshContext,
): Response => {
  const stats = cache.getStats();

  return new Response(
    JSON.stringify({
      cache: stats,
      hitRate: stats.active > 0
        ? `${
          ((stats.active / (stats.active + stats.expired)) * 100).toFixed(1)
        }%`
        : "0%",
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
  );
};
