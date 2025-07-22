import { useEffect, useState } from "preact/hooks";
import { EthosUser } from "../types/ethos.ts";

export default function RecentSearches() {
  const [recentSearches, setRecentSearches] = useState<EthosUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  // Auto-progression effect
  useEffect(() => {
    if (recentSearches.length <= 3 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, recentSearches.length - 3);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000); // Progress every 4 seconds

    return () => clearInterval(interval);
  }, [recentSearches.length, isPaused]);

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

  // Get visible searches for carousel (3 at a time)
  const getVisibleSearches = () => {
    if (recentSearches.length === 0) return [];
    if (recentSearches.length <= 3) return recentSearches;

    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % recentSearches.length;
      visible.push(recentSearches[index]);
    }
    return visible;
  };

  const visibleSearches = getVisibleSearches();

  // Manual navigation
  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, recentSearches.length - 3);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, recentSearches.length - 3);
      return prev >= maxIndex ? 0 : prev + 1;
    });
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
    <div
      class="max-w-6xl mx-auto mb-16 relative z-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div class="text-center mb-8">
        <h2 class="text-3xl font-retro font-black text-retro-purple mb-2">
          🎠 RECENTLY EXPLORED PROFILES
        </h2>
      </div>

      {/* Carousel Container */}
      <div class="relative">
        {/* Navigation Arrows (only show if more than 3 items) */}
        {recentSearches.length > 3 && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-retro-purple border-4 border-retro-cyan rounded-full text-white font-black text-xl hover:bg-retro-cyan hover:border-retro-purple transition-all duration-200 shadow-retro-lg hover:scale-110"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goToNext}
              class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-retro-purple border-4 border-retro-cyan rounded-full text-white font-black text-xl hover:bg-retro-cyan hover:border-retro-purple transition-all duration-200 shadow-retro-lg hover:scale-110"
            >
              →
            </button>
          </>
        )}

        {/* Carousel Cards */}
        <div class="grid md:grid-cols-3 gap-8">
          {visibleSearches.map((user, index) => {
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
                key={`${user.profileId}-${currentIndex}-${index}`}
                onClick={() => navigateToProfile(user)}
                class={`group text-center p-8 bg-white/80 backdrop-blur-sm border-4 ${
                  borderColors[index % 3]
                } rounded-2xl shadow-retro hover:shadow-retro-lg transition-all duration-300 transform hover:scale-105 hover:-rotate-1 cursor-pointer animate-fadeIn`}
              >
                <div
                  class={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${
                    bgGradients[index % 3]
                  } flex items-center justify-center border-4 border-retro-purple ${
                    shadowColors[index % 3]
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
              </div>
            );
          })}
        </div>

        {/* Progress Dots (only show if more than 3 items) */}
        {recentSearches.length > 3 && (
          <div class="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.max(0, recentSearches.length - 2) }).map(
              (_, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  class={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? "bg-retro-purple scale-125 shadow-retro"
                      : "bg-gray-400 hover:bg-retro-cyan"
                  }`}
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
