import { PageProps } from "$fresh/server.ts";
import UserSearch from "../islands/UserSearch.tsx";
import RecentSearches from "../islands/RecentSearches.tsx";

export default function Home({}: PageProps) {
  return (
    <div class="min-h-screen bg-gradient-to-br from-offwhite via-cream to-retro-teal/10 relative overflow-hidden">
      {/* 90s Background Pattern */}
      <div class="absolute inset-0 bg-retro-pattern opacity-30"></div>

      {/* Floating Geometric Shapes - adjusted z-index to stay behind */}
      <div class="absolute top-20 left-10 w-32 h-32 bg-retro-teal rounded-full opacity-20 animate-bounce-slow z-0">
      </div>
      <div class="absolute top-40 right-20 w-24 h-24 bg-retro-purple transform rotate-45 opacity-25 animate-wiggle z-0">
      </div>
      <div class="absolute bottom-32 left-1/4 w-28 h-28 bg-retro-magenta rounded-full opacity-15 animate-pulse-fast z-0">
      </div>
      <div
        class="absolute top-60 right-1/3 w-20 h-40 bg-retro-cyan transform -rotate-12 opacity-20 animate-bounce-slow z-0"
        style="animation-delay: 1s;"
      >
      </div>

      {/* Main content */}
      <div class="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <div class="text-center mb-16">
          <div class="inline-block mb-8">
            <div class="text-6xl md:text-8xl font-retro font-black bg-cup-swoosh bg-clip-text text-transparent animate-retro-glow mb-4">
              ETHOS
            </div>
            <div class="text-2xl md:text-4xl font-retro tracking-[0.2em] text-retro-purple font-bold transform -rotate-1">
              INVITE GRAPH
            </div>
            <div class="w-full h-2 bg-retro-teal mt-4 transform rotate-1 shadow-retro">
            </div>
          </div>

          <div class="max-w-2xl mx-auto space-y-4">
            <p class="text-2xl text-retro-purple font-bold">
              🔥 TOTALLY RADICAL NETWORK EXPLORER! 🔥
            </p>
            <p class="text-lg text-gray-700 font-bold">
              Search users and discover their invitation connections
            </p>
          </div>
        </div>

        {/* Search Section - increased bottom margin to prevent overlap */}
        <div class="max-w-2xl mx-auto mb-40 relative z-20">
          <div class="bg-white/90 backdrop-blur-sm border-4 border-retro-teal rounded-3xl p-8 shadow-retro-lg transform rotate-1 hover:rotate-0 transition-transform duration-300">
            {/* Retro accent line */}
            <div class="h-4 bg-gradient-to-r from-retro-teal via-retro-purple to-retro-magenta rounded-full mb-6 animate-pulse-fast">
            </div>

            <h2 class="text-2xl font-retro text-retro-purple mb-8 text-center font-black tracking-wide">
              🎮 START YOUR SEARCH QUEST! 🎮
            </h2>

            <UserSearch />

            <div class="mt-8 text-center">
              <p class="text-sm text-gray-600 font-bold font-mono">
                {">"} Type a username, address, or ENS name!
              </p>
            </div>
          </div>
        </div>

        {/* Recent Global Searches - Replaces Feature Cards */}
        <RecentSearches />

        {/* Bottom banner */}
        <div class="text-center relative z-10">
          <div class="inline-block px-8 py-4 bg-gradient-to-r from-retro-teal to-retro-purple rounded-full shadow-retro transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <span class="text-white font-retro font-black text-lg tracking-wider">
              🌟 POWERED BY ETHOS NETWORK API 🌟
            </span>
          </div>
        </div>

        {/* Decorative bottom elements */}
        <div class="mt-16 flex justify-center space-x-8 relative z-10">
          <div class="w-8 h-8 bg-retro-cyan transform rotate-45 animate-pulse-fast">
          </div>
          <div class="w-8 h-8 bg-retro-purple rounded-full animate-bounce-slow">
          </div>
          <div class="w-8 h-8 bg-retro-magenta transform rotate-45 animate-wiggle">
          </div>
          <div class="w-8 h-8 bg-retro-teal rounded-full animate-pulse-fast">
          </div>
        </div>
      </div>
    </div>
  );
}
