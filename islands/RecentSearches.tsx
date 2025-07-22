import { useEffect, useState } from "preact/hooks";
import { EthosUser } from "../types/ethos.ts";

export default function RecentSearches() {
  const [recentSearches, setRecentSearches] = useState<EthosUser[]>([]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const response = await fetch("/api/recent-searches");
      if (response.ok) {
        const searches = await response.json();
        setRecentSearches(searches);
        console.log(`🌍 Loaded ${searches.length} global recent searches`);
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
    // Show placeholder cards when no recent searches
    return (
      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16 relative z-10">
        <div class="group text-center p-8 bg-white/80 backdrop-blur-sm border-4 border-retro-cyan rounded-2xl shadow-retro">
          <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-retro-cyan to-retro-teal flex items-center justify-center border-4 border-retro-purple shadow-neon">
            <div class="text-4xl">🔍</div>
          </div>
          <h3 class="text-xl font-retro text-retro-purple mb-3 font-black">
            SEARCH FIRST!
          </h3>
          <p class="text-gray-700 font-bold">
            Use the search above to explore profiles - they'll appear here!
          </p>
        </div>

        <div class="group text-center p-8 bg-white/80 backdrop-blur-sm border-4 border-retro-purple rounded-2xl shadow-retro">
          <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-retro-purple to-retro-magenta flex items-center justify-center border-4 border-retro-cyan shadow-neon-purple">
            <div class="text-4xl">🌍</div>
          </div>
          <h3 class="text-xl font-retro text-retro-cyan mb-3 font-black">
            GLOBAL RECENT
          </h3>
          <p class="text-gray-700 font-bold">
            See what profiles other users have been exploring recently!
          </p>
        </div>

        <div class="group text-center p-8 bg-white/80 backdrop-blur-sm border-4 border-retro-magenta rounded-2xl shadow-retro">
          <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-retro-magenta to-retro-pink flex items-center justify-center border-4 border-retro-teal shadow-neon">
            <div class="text-4xl">🚀</div>
          </div>
          <h3 class="text-xl font-retro text-retro-teal mb-3 font-black">
            QUICK ACCESS
          </h3>
          <p class="text-gray-700 font-bold">
            Easily jump back to previously viewed invitation networks!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16 relative z-10">
      {recentSearches.map((user, index) => {
        const borderColors = [
          "border-retro-cyan",
          "border-retro-purple",
          "border-retro-magenta",
        ];
        const bgGradients = [
          "from-retro-cyan to-retro-teal",
          "from-retro-purple to-retro-magenta",
          "from-retro-magenta to-retro-pink",
        ];
        const shadowColors = [
          "shadow-neon",
          "shadow-neon-purple",
          "shadow-neon",
        ];

        return (
          <div
            key={`${user.profileId}-${index}`}
            onClick={() => navigateToProfile(user)}
            class={`group text-center p-8 bg-white/80 backdrop-blur-sm border-4 ${
              borderColors[index]
            } rounded-2xl shadow-retro hover:shadow-retro-lg transition-all duration-300 transform hover:scale-105 hover:-rotate-1 cursor-pointer`}
          >
            <div
              class={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${
                bgGradients[index]
              } flex items-center justify-center border-4 border-retro-purple ${
                shadowColors[index]
              }`}
            >
              {user.avatarUrl
                ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username || user.displayName}
                    class="w-16 h-16 rounded-xl object-cover"
                  />
                )
                : (
                  <div class="text-4xl text-white font-black">
                    {(user.username || user.displayName || "U").charAt(0)
                      .toUpperCase()}
                  </div>
                )}
            </div>

            <h3 class="text-xl font-retro text-retro-purple mb-2 font-black truncate">
              @{user.username || user.displayName}
            </h3>

            {user.score !== undefined && (
              <div class="mb-3">
                <div
                  class={`inline-block text-sm text-white font-black ${
                    getScoreColor(user.score)
                  } px-3 py-1 rounded-full border-2 border-retro-purple shadow-retro`}
                >
                  SCORE: {user.score}
                </div>
              </div>
            )}

            <p class="text-gray-700 font-bold text-sm">
              Recently explored profile • Click to revisit!
            </p>
          </div>
        );
      })}
    </div>
  );
}
