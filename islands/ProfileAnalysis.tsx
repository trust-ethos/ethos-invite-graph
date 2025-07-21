import { useState, useEffect } from "preact/hooks";
import { EthosProfileWithActor } from "../types/ethos.ts";
import NetworkVisualization from "./NetworkVisualization.tsx";

interface ProfileAnalysisProps {
  userkey: string;
}

export default function ProfileAnalysis({ userkey }: ProfileAnalysisProps) {
  const [profile, setProfile] = useState<EthosProfileWithActor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        console.log('Fetching profile for userkey:', userkey);
        
        // Try to extract profile ID from userkey
        // Handle different formats: "123", "profileId:123", etc.
        let profileId: string | null = null;
        
        if (userkey.startsWith('profileId:')) {
          profileId = userkey.split(':')[1];
        } else if (!isNaN(Number(userkey))) {
          profileId = userkey;
        } else {
          // For username-based userkeys, show a helpful error
          setError(`Invalid profile identifier "${userkey}". Please search for a user from the homepage.`);
          setLoading(false);
          return;
        }

        if (!profileId) {
          setError('Unable to determine profile ID from userkey');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/profile-enhanced/${profileId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch profile');
          setLoading(false);
          return;
        }

        const profileData: EthosProfileWithActor = await response.json();
        setProfile(profileData);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userkey]);

  if (loading) {
    return (
      <div class="text-center py-20">
        <div class="inline-block p-8 bg-white/90 backdrop-blur-sm border-4 border-retro-cyan rounded-3xl shadow-retro-lg">
          <div class="w-16 h-16 mx-auto mb-4 border-4 border-retro-teal border-t-retro-purple rounded-full animate-spin"></div>
          <div class="text-retro-purple font-retro font-black text-xl">LOADING PROFILE...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div class="text-center py-20">
        <div class="inline-block p-8 bg-white/90 backdrop-blur-sm border-4 border-retro-magenta rounded-3xl shadow-retro-lg">
          <div class="text-4xl mb-4">😅</div>
          <div class="text-retro-purple font-retro font-black text-xl mb-4">OOPS!</div>
          <div class="text-gray-700 font-bold">{error}</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div class="text-center py-20">
        <div class="inline-block p-8 bg-white/90 backdrop-blur-sm border-4 border-retro-magenta rounded-3xl shadow-retro-lg">
          <div class="text-4xl mb-4">🤔</div>
          <div class="text-retro-purple font-retro font-black text-xl">PROFILE NOT FOUND</div>
        </div>
      </div>
    );
  }

  return (
    <div class="relative min-h-screen overflow-hidden">
      {/* Full-Screen Network Visualization Background */}
      <div class="fixed inset-0 z-0">
        <NetworkVisualization profileId={profile.id} isFullScreen={true} />
      </div>

      {/* Top Profile Header */}
      <div class="fixed top-0 left-0 right-0 z-50 p-4">
        <div class="bg-white border-4 border-retro-purple rounded-3xl p-6 shadow-retro-xl transform rotate-1 max-w-5xl mx-auto" style="box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)">
          <div class="flex items-start space-x-6">
            <div class="flex-shrink-0">
              <img 
                src={profile.actor.avatar || '/default-avatar.png'} 
                alt={profile.actor.name || 'Profile'} 
                class="w-24 h-24 rounded-2xl border-4 border-retro-cyan shadow-retro"
              />
            </div>
            
            <div class="flex-1 space-y-4">
              <div class="flex items-center space-x-4">
                <h1 class="text-3xl font-retro font-black text-retro-purple">
                  {profile.actor.name || profile.actor.username || 'Unknown User'}
                </h1>
                <div class="flex items-center space-x-2">
                  <div class="text-lg font-retro font-black text-retro-purple">@{profile.actor.username}</div>
                  <div class="px-4 py-2 bg-retro-cyan border-2 border-retro-purple rounded-xl font-retro font-black text-white shadow-retro">
                    {profile.actor.score}
                  </div>
                </div>
              </div>
              
              <div class="flex flex-wrap gap-2">
                <div class="px-3 py-1 bg-retro-teal border-2 border-retro-cyan rounded-lg text-white font-bold text-sm">
                  ACTIVE
                </div>
                {profile.actor.xpTotal && (
                  <div class="px-3 py-1 bg-retro-purple border-2 border-retro-magenta rounded-lg text-white font-bold text-sm">
                    {profile.actor.xpTotal.toLocaleString()} XP
                  </div>
                )}
                {profile.actor.xpStreakDays && profile.actor.xpStreakDays > 0 && (
                  <div class="px-3 py-1 bg-retro-magenta border-2 border-retro-purple rounded-lg text-white font-bold text-sm">
                    {profile.actor.xpStreakDays} day streak
                  </div>
                )}
              </div>



              <div class="flex items-center space-x-2 text-sm">
                <div class="font-bold text-gray-700">Invited by:</div>
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-retro-purple rounded-lg flex items-center justify-center">
                    <div class="text-white font-black text-xs">≡</div>
                  </div>
                  {profile.inviterActor ? (
                    <a 
                      href={`https://app.ethos.network/profile/x/${profile.inviterActor.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-retro-purple font-bold hover:underline"
                    >
                      @{profile.inviterActor.username}
                    </a>
                  ) : (
                    <span class="text-gray-500 font-bold">Unknown</span>
                  )}
                </div>
              </div>
            </div>
            
            <div class="flex-shrink-0">
              <a
                href={`https://app.ethos.network/profile/x/${profile.actor.username}`}
                target="_blank"
                rel="noopener noreferrer"
                class="px-4 py-2 bg-retro-magenta border-2 border-retro-purple rounded-xl text-white font-retro font-black hover:bg-retro-purple hover:border-retro-magenta transition-all duration-200 shadow-retro hover:shadow-retro-lg hover:scale-105"
              >
                VIEW PROFILE
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Instructions */}
      <div class="fixed bottom-6 right-6 z-50">
        <div class="bg-retro-purple border-2 border-retro-cyan rounded-2xl p-4 text-white font-bold text-sm shadow-retro-lg">
          <div class="text-xs font-retro font-black text-retro-cyan mb-1">NETWORK CONTROLS</div>
          <div class="space-y-1 text-xs">
            <div>🖱️ Drag nodes to move</div>
            <div>👆 Click nodes to explore</div>
            <div>🔍 Scroll to zoom</div>
          </div>
        </div>
      </div>
    </div>
  );
} 