import { useState, useEffect } from "preact/hooks";
import { EthosInvitationsResponse, EthosInvitedUser } from "../types/ethos.ts";

interface InvitedUsersListProps {
  profileId: number;
}

export default function InvitedUsersList({ profileId }: InvitedUsersListProps) {
  const [invitations, setInvitations] = useState<EthosInvitationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        setLoading(true);
        console.log('Fetching invitations for profile:', profileId);
        
        const response = await fetch(`/api/invitations/${profileId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch invitations');
          setLoading(false);
          return;
        }

        const invitationsData: EthosInvitationsResponse = await response.json();
        setInvitations(invitationsData);
      } catch (err) {
        console.error('Invitations fetch error:', err);
        setError('Failed to load invitation data');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, [profileId]);

  if (loading) {
    return (
      <div class="bg-white/90 backdrop-blur-sm border-4 border-retro-cyan rounded-3xl p-8 shadow-retro-lg">
        <h3 class="text-2xl font-retro text-retro-purple mb-6 font-black">PEOPLE INVITED</h3>
        <div class="flex items-center justify-center py-8">
          <div class="w-12 h-12 border-4 border-retro-teal border-t-retro-purple rounded-full animate-spin"></div>
          <div class="ml-4 text-retro-purple font-retro font-black">LOADING INVITATIONS...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div class="bg-white/90 backdrop-blur-sm border-4 border-retro-magenta rounded-3xl p-8 shadow-retro-lg">
        <h3 class="text-2xl font-retro text-retro-purple mb-6 font-black">PEOPLE INVITED</h3>
        <div class="text-center py-8">
          <div class="text-4xl mb-4">😅</div>
          <div class="text-retro-purple font-retro font-black text-lg mb-2">OOPS!</div>
          <div class="text-gray-700 font-bold">{error}</div>
        </div>
      </div>
    );
  }

  if (!invitations || invitations.invitedUsers.length === 0) {
    return (
      <div class="bg-white/90 backdrop-blur-sm border-4 border-retro-cyan rounded-3xl p-8 shadow-retro-lg">
        <h3 class="text-2xl font-retro text-retro-purple mb-6 font-black">PEOPLE INVITED</h3>
        <div class="text-center py-8">
          <div class="text-4xl mb-4">🤷‍♂️</div>
          <div class="text-retro-purple font-retro font-black text-lg mb-2">NO INVITATIONS FOUND</div>
          <div class="text-gray-700 font-bold">This user hasn't invited anyone yet</div>
        </div>
      </div>
    );
  }

  return (
    <div class="bg-white/90 backdrop-blur-sm border-4 border-retro-cyan rounded-3xl p-8 shadow-retro-lg">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-retro text-retro-purple font-black">PEOPLE INVITED</h3>
        <div class="px-4 py-2 bg-retro-teal rounded-full border-2 border-retro-purple shadow-retro">
          <span class="text-white font-black">{invitations.total}</span>
        </div>
      </div>

      <div class="space-y-4 max-h-96 overflow-y-auto">
        {invitations.invitedUsers.map((user: EthosInvitedUser, index: number) => (
          <div 
            key={user.activityId}
            class="flex items-center space-x-4 p-4 bg-white border-2 border-retro-teal rounded-2xl shadow-retro hover:shadow-retro-lg transition-all duration-200 transform hover:scale-102"
          >
            {/* Avatar */}
            <div class="flex-shrink-0">
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.username || user.displayName || 'User'}
                  class="w-12 h-12 rounded-xl object-cover border-2 border-retro-purple"
                />
              ) : (
                <div class="w-12 h-12 bg-gradient-to-br from-retro-cyan to-retro-purple rounded-xl flex items-center justify-center text-white font-black border-2 border-retro-purple">
                  {(user.username || user.displayName || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* User Info */}
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2 mb-1">
                {user.username ? (
                  <a 
                    href={`https://app.ethos.network/profile/x/${user.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-black text-gray-800 hover:text-retro-teal transition-colors duration-200 hover:underline truncate"
                  >
                    @{user.username}
                  </a>
                ) : (
                  <span class="font-black text-gray-800 truncate">
                    {user.displayName || `Profile ${user.profileId}`}
                  </span>
                )}
                
                {user.score !== undefined && (
                  <div class="flex-shrink-0 px-2 py-1 bg-retro-purple/20 border border-retro-purple rounded-full">
                    <span class="text-retro-purple font-bold text-xs">{user.score}</span>
                  </div>
                )}
              </div>
              
              {user.displayName && user.username && (
                <div class="text-sm text-retro-purple font-bold truncate">
                  {user.displayName}
                </div>
              )}
              
              <div class="text-xs text-gray-600 font-medium">
                Invited {new Date(user.invitedAt).toLocaleDateString()}
              </div>
            </div>

            {/* Navigate to their analysis */}
            {user.profileId && (
              <div class="flex-shrink-0">
                <a 
                  href={`/analysis/${user.profileId}`}
                  class="flex items-center justify-center w-10 h-10 bg-retro-magenta rounded-xl border-2 border-retro-cyan hover:bg-retro-cyan hover:border-retro-magenta transition-all duration-200 shadow-retro hover:shadow-retro-lg hover:scale-105"
                  title={`Analyze ${user.username || user.displayName}'s network`}
                >
                  <div class="text-white font-black text-lg leading-none">→</div>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 