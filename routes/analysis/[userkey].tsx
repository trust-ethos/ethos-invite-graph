import { PageProps } from "$fresh/server.ts";
import ProfileAnalysis from "../../islands/ProfileAnalysis.tsx";

interface AnalysisPageProps {
  userkey: string;
}

export default function Analysis(
  { params }: PageProps<unknown, AnalysisPageProps>,
) {
  const userkey = decodeURIComponent(params.userkey);

  return (
    <div class="min-h-screen bg-gradient-to-br from-offwhite via-cream to-retro-teal/10 relative overflow-hidden">
      {/* 90s Background Pattern */}
      <div class="absolute inset-0 bg-retro-pattern opacity-30 z-0"></div>

      {/* Floating Geometric Shapes */}
      <div class="absolute top-20 right-10 w-24 h-24 bg-retro-cyan transform rotate-45 opacity-20 animate-wiggle z-0">
      </div>
      <div class="absolute bottom-40 left-10 w-32 h-32 bg-retro-magenta rounded-full opacity-15 animate-pulse-fast z-0">
      </div>

      {/* Navigation */}
      <nav class="relative z-10 bg-white/90 backdrop-blur-sm border-b-4 border-retro-teal shadow-retro">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <a
              href="/"
              class="flex items-center space-x-3 text-retro-purple hover:text-retro-teal transition-colors duration-300 group"
            >
              <div class="p-3 rounded-xl bg-retro-cyan/20 border-2 border-retro-purple group-hover:border-retro-teal transition-all duration-300 shadow-retro">
                <div class="text-retro-purple group-hover:text-retro-teal font-black text-lg">
                  ←
                </div>
              </div>
              <span class="font-retro font-black text-lg tracking-wide">
                BACK TO SEARCH
              </span>
            </a>
            <div class="text-2xl font-retro font-black text-retro-purple tracking-wider">
              ETHOS INVITE GRAPH
            </div>
          </div>
        </div>
      </nav>

      <div class="relative z-10 container mx-auto px-6 py-12">
        <ProfileAnalysis userkey={userkey} />
      </div>
    </div>
  );
}

// Component logic moved to islands/ProfileAnalysis.tsx
