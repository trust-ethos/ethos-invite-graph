import { FreshContext } from "$fresh/server.ts";
import { EthosProfilesResponse, EthosUser } from "../../../types/ethos.ts";

const ETHOS_API_BASE_V1 = "https://api.ethos.network/api/v1";
const ETHOS_API_BASE_V2 = "https://api.ethos.network/api/v2";

export const handler = async (
  req: Request,
  ctx: FreshContext,
): Promise<Response> => {
  const profileId = ctx.params.profileId;
  
  if (!profileId || isNaN(Number(profileId))) {
    return new Response(
      JSON.stringify({ error: "Valid profile ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    console.log(`🔍 Fetching enhanced profile ${profileId} from both v1 and v2 APIs`);

    // Get basic profile info from v1 (for invitedBy relationship)
    const profileResponse = await fetch(`${ETHOS_API_BASE_V1}/profiles`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "EthosInviteGraph/1.0",
        "X-Ethos-Client": "ethos-invite-graph@1.0.0",
      },
      body: JSON.stringify({
        ids: [Number(profileId)],
        limit: 1,
        offset: 0
      }),
    });

    if (!profileResponse.ok) {
      throw new Error(`Profiles API error: ${profileResponse.status}`);
    }

    const profileData: EthosProfilesResponse = await profileResponse.json();
    
    if (!profileData.ok || !profileData.data.values.length) {
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const basicProfile = profileData.data.values[0];
    console.log(`✅ Found basic profile ${profileId}:`, JSON.stringify(basicProfile, null, 2));

    // Get user data from v2 API using the profile-id endpoint
    let userData = null;
    const userResponse = await fetch(`${ETHOS_API_BASE_V2}/users/by/profile-id`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "EthosInviteGraph/1.0",
        "X-Ethos-Client": "ethos-invite-graph@1.0.0",
      },
      body: JSON.stringify({
        profileIds: [Number(profileId)]
      }),
    });

    if (userResponse.ok) {
      const usersData = await userResponse.json();
      // The API returns an array, get the first user
      userData = usersData.length > 0 ? usersData[0] : null;
      if (userData) {
        console.log(`✅ Found user data for profile ${profileId}:`, JSON.stringify(userData, null, 2));
      } else {
        console.log(`⚠️ No user found in response for profile ${profileId}`);
      }
    } else {
      const errorText = await userResponse.text();
      console.log(`⚠️ User data not found for profile ${profileId} in v2 API. Status: ${userResponse.status}, Response: ${errorText}`);
    }

    // Get inviter information if available
    let inviterData = null;
    if (basicProfile.invitedBy) {
      try {
        const inviterResponse = await fetch(`${ETHOS_API_BASE_V2}/users/by/profile-id`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "EthosInviteGraph/1.0",
            "X-Ethos-Client": "ethos-invite-graph@1.0.0",
          },
          body: JSON.stringify({
            profileIds: [basicProfile.invitedBy]
          }),
        });

        if (inviterResponse.ok) {
          const invitersData = await inviterResponse.json();
          inviterData = invitersData.length > 0 ? invitersData[0] : null;
          if (inviterData) {
            console.log(`✅ Found inviter data: ${inviterData.username || inviterData.displayName}`);
          }
        }
      } catch (err) {
        console.log(`⚠️ Could not fetch inviter data: ${err}`);
      }
    }

    // Combine the data
    const enhancedProfile = {
      // Basic profile info from v1
      id: basicProfile.id,
      archived: basicProfile.archived,
      createdAt: basicProfile.createdAt,
      updatedAt: basicProfile.updatedAt,
      invitesAvailable: basicProfile.invitesAvailable,
      invitedBy: basicProfile.invitedBy,
      
      // Enhanced user info from v2 (with v1 fallback)
      actor: userData ? {
        userkey: `profileId:${userData.profileId}`,
        avatar: userData.avatarUrl,
        name: userData.displayName,
        username: userData.username,
        description: userData.description,
        score: userData.score || 0,
        scoreXpMultiplier: 1,
        profileId: userData.profileId || basicProfile.id,
        primaryAddress: "unknown",
        // Additional v2 data
        status: userData.status,
        xpTotal: userData.xpTotal,
        xpStreakDays: userData.xpStreakDays,
        userkeys: userData.userkeys,
        links: userData.links,
        stats: userData.stats
      } : {
        // Fallback using v1 data 
        userkey: `profileId:${basicProfile.id}`,
        avatar: null,
        name: `Profile ${basicProfile.id}`,
        username: null,
        description: `Created ${new Date(basicProfile.createdAt * 1000).toLocaleDateString()}`,
        score: 0,
        scoreXpMultiplier: 1,
        profileId: basicProfile.id,
        primaryAddress: "unknown",
        // Show v1 profile info
        status: basicProfile.archived ? "ARCHIVED" : "ACTIVE",
        xpTotal: null,
        xpStreakDays: null,
        userkeys: [`profileId:${basicProfile.id}`],
        profileInfo: {
          invitesAvailable: basicProfile.invitesAvailable,
          createdAt: basicProfile.createdAt,
          updatedAt: basicProfile.updatedAt
        }
      },

      // Inviter info from v2
      inviterActor: inviterData ? {
        userkey: `profileId:${inviterData.profileId}`,
        avatar: inviterData.avatarUrl,
        name: inviterData.displayName,
        username: inviterData.username,
        description: inviterData.description,
        score: inviterData.score || 0,
        scoreXpMultiplier: 1,
        profileId: inviterData.profileId || basicProfile.invitedBy,
        primaryAddress: "unknown"
      } : null
    };

    return new Response(JSON.stringify(enhancedProfile), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (error) {
    console.error("💥 Enhanced profile fetch error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch enhanced profile",
        details: errorMessage 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}; 