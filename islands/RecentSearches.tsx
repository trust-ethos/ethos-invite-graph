import { useEffect, useState } from "preact/hooks";
import { EthosUser } from "../types/ethos.ts";

export default function RecentSearches() {
  const [recentSearches, setRecentSearches] = useState<EthosUser[]>([]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = () => {
    try {
      const stored = localStorage.getItem("ethos-recent-searches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.log("Could not load recent searches:", error);
    }
  };

  const navigateToProfile = (user: EthosUser) => {
    const profileId = user.profileId || user.id;
    globalThis.location.href = `/analysis/${profileId}`;
  };

  // Color function based on credibility score (matching search typeahead)
  const getScoreColor = (score: number): string => {
    if (score < 800) return "bg-retro-pink"; // untrusted
    if (score < 1200) return "bg-retro-yellow"; // questionable
    if (score < 1600) return "bg-gray-700"; // neutral
    if (score < 2000) return "bg-retro-cyan"; // reputable
    if (score < 2400) return "bg-retro-lime"; // exemplary
    return "bg-retro-purple"; // revered
  };

  if (recentSearches.length === 0) {
    return null; // Don't show anything if no recent searches
  }

  return (
    <div class="w-full max-w-4xl mx-auto mt-12 p-6 bg-white border-4 border-retro-cyan rounded-3xl shadow-retro-lg transform -rotate-1">
      <div class="flex items-center space-x-3 mb-6">
        <div class="w-10 h-10 bg-retro-purple rounded-full flex items-center justify-center">
          <div class="text-white font-black text-lg">⏱</div>
        </div>
        <h2 class="text-2xl font-retro font-black text-retro-purple">
          RECENTLY EXPLORED
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentSearches.map((user, index) => (
          <div
            key={`${user.profileId}-${index}`}
            onClick={() => navigateToProfile(user)}
            class="p-4 bg-gradient-to-br from-retro-cyan/10 to-retro-purple/10 border-2 border-retro-cyan rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-retro hover:scale-105 hover:border-retro-purple"
          >
            <div class="flex items-center space-x-3">
              {user.avatarUrl
                ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username || user.displayName}
                    class="w-12 h-12 rounded-xl object-cover border-2 border-retro-purple shadow-retro flex-shrink-0"
                  />
                )
                : (
                  <div class="w-12 h-12 bg-gradient-to-br from-retro-teal to-retro-purple rounded-xl flex items-center justify-center text-white font-black text-lg border-2 border-retro-cyan shadow-retro flex-shrink-0">
                    {(user.username || user.displayName || "U").charAt(0)
                      .toUpperCase()}
                  </div>
                )}

              <div class="flex-1 min-w-0">
                <div class="font-black text-lg truncate text-gray-800">
                  {user.username || user.displayName}
                </div>
                {user.displayName && user.username !== user.displayName && (
                  <div class="text-sm text-retro-purple font-bold truncate">
                    {user.displayName}
                  </div>
                )}
                {user.score !== undefined && (
                  <div class="mt-2">
                    <div
                      class={`inline-block text-xs text-white font-black ${
                        getScoreColor(user.score)
                      } px-2 py-1 rounded-full border border-retro-purple`}
                    >
                      {user.score}
                    </div>
                  </div>
                )}
              </div>

              <div class="text-retro-purple flex-shrink-0">
                <div class="w-6 h-6 bg-retro-magenta rounded-full flex items-center justify-center border border-retro-cyan">
                  <div class="text-white font-black text-xs">→</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div class="mt-4 text-center">
        <div class="text-xs text-gray-500 font-medium">
          Your last {recentSearches.length} searches • Click to explore again!
        </div>
      </div>
    </div>
  );
}
