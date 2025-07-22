import { FreshContext } from "$fresh/server.ts";
import { cache } from "../../utils/cache.ts";

export const handler = (
  _req: Request,
  _ctx: FreshContext,
): Response => {
  cache.clear();

  return new Response(
    JSON.stringify({
      message: "Cache cleared successfully",
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
