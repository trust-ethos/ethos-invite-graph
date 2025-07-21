import { FreshContext } from "$fresh/server.ts";
import { EthosUserSearchResponse } from "../../types/ethos.ts";

const ETHOS_API_BASE = "https://api.ethos.network/api/v2";

export const handler = async (
  req: Request,
  _ctx: FreshContext,
): Promise<Response> => {
  const url = new URL(req.url);
  const query = url.searchParams.get("query");
  
  if (!query || query.length < 2) {
    return new Response(
      JSON.stringify({ error: "Query must be at least 2 characters" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const ethosUrl = new URL(`${ETHOS_API_BASE}/users/search`);
    ethosUrl.searchParams.set("query", query);
    ethosUrl.searchParams.set("limit", "10");

    console.log(`🔍 Searching Ethos API: ${ethosUrl.toString()}`);

    const response = await fetch(ethosUrl.toString(), {
      headers: {
        "Accept": "application/json",
        "User-Agent": "EthosInviteGraph/1.0",
        "X-Ethos-Client": "ethos-invite-graph@1.0.0",
      },
    });

    console.log(`📡 Ethos API Response Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Ethos API Error: ${response.status} - ${errorText}`);
      
      return new Response(
        JSON.stringify({ 
          error: `Ethos API error: ${response.status}`,
          details: errorText,
          query: query 
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const data: EthosUserSearchResponse = await response.json();
    console.log(`✅ Ethos API Response: Found ${data.values?.length || 0} users out of ${data.total} total`);
    
    return new Response(JSON.stringify(data), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("💥 Search error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: "Failed to search users",
        details: errorMessage,
        query: query 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}; 