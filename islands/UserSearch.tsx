import { useEffect, useRef, useState } from "preact/hooks";
import { EthosUser, EthosUserSearchResponse } from "../types/ethos.ts";

// No props interface needed - we'll handle navigation internally

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<EthosUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/search-users?query=${encodeURIComponent(query)}`,
          );
          if (response.ok) {
            const data: EthosUserSearchResponse = await response.json();
            setUsers(data.values || []);
            setShowDropdown(true);
          }
        } catch (error) {
          console.error("Search error:", error);
          setUsers([]);
        }
        setIsLoading(false);
      } else {
        setUsers([]);
        setShowDropdown(false);
      }
      setSelectedIndex(-1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setQuery(target.value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!showDropdown || users.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < users.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < users.length) {
          selectUser(users[selectedIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectUser = (user: EthosUser) => {
    setQuery(user.username || user.displayName || `user-${user.id}`);
    setShowDropdown(false);
    setSelectedIndex(-1);

    // Navigate to analysis page using profileId
    const profileId = user.profileId || user.id;
    console.log(
      "Navigating to profile:",
      profileId,
      "for user:",
      user.username || user.displayName,
    );
    globalThis.location.href = `/analysis/${profileId}`;
  };

  const handleBlur = (e: FocusEvent) => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
        setShowDropdown(false);
      }
    }, 150);
  };

  return (
    <div class="relative w-full">
      <div class="relative z-30">
        <input
          ref={searchRef}
          type="text"
          value={query}
          onInput={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() =>
            query.length >= 2 && users.length > 0 && setShowDropdown(true)}
          placeholder="Type a username like @serpin..."
          class="w-full px-6 py-4 text-lg bg-white border-4 border-retro-purple rounded-2xl focus:outline-none focus:border-retro-teal focus:shadow-neon transition-all duration-300 text-gray-800 placeholder-gray-500 font-bold shadow-retro hover:shadow-retro-lg"
        />

        {/* Retro accent line */}
        <div
          class={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-retro-teal to-retro-magenta rounded-full transition-all duration-300 ${
            query.length > 0 ? "w-full opacity-100" : "w-0 opacity-0"
          }`}
        >
        </div>

        {isLoading && (
          <div class="absolute right-4 top-1/2 transform -translate-y-1/2 z-40">
            <div class="w-8 h-8 border-4 border-retro-cyan border-t-retro-purple rounded-full animate-spin">
            </div>
          </div>
        )}
      </div>

      {showDropdown && users.length > 0 && (
        <div
          ref={dropdownRef}
          class="absolute z-50 w-full mt-4 bg-white border-4 border-retro-cyan rounded-2xl shadow-retro-lg max-h-80 overflow-y-auto"
          style={{
            boxShadow: "8px 8px 0px #8A2BE2, 0 0 20px rgba(0, 206, 209, 0.3)",
          }}
        >
          {users.map((user, index) => (
            <div
              key={user.id}
              onClick={() => selectUser(user)}
              class={`px-6 py-4 cursor-pointer transition-all duration-200 border-l-4 ${
                index === selectedIndex
                  ? "bg-retro-teal/20 border-retro-purple text-gray-800 transform scale-105"
                  : "border-transparent hover:bg-retro-cyan/10 hover:border-retro-teal text-gray-700"
              } ${index === 0 ? "rounded-t-xl" : ""} ${
                index === users.length - 1
                  ? "rounded-b-xl"
                  : "border-b-2 border-retro-cyan/30"
              }`}
            >
              <div class="flex items-center space-x-4">
                {user.avatarUrl
                  ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username || user.displayName}
                      class="w-14 h-14 rounded-xl object-cover border-4 border-retro-purple shadow-retro flex-shrink-0"
                    />
                  )
                  : (
                    <div class="w-14 h-14 bg-gradient-to-br from-retro-teal to-retro-purple rounded-xl flex items-center justify-center text-white font-black text-xl border-4 border-retro-cyan shadow-retro flex-shrink-0">
                      {(user.username || user.displayName || "U").charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                <div class="flex-1 min-w-0">
                  <div class="font-black text-lg truncate text-gray-800">
                    {user.username || user.displayName}
                  </div>
                  {user.displayName && user.username !== user.displayName && (
                    <div class="text-sm text-retro-purple font-bold truncate mt-1">
                      {user.displayName}
                    </div>
                  )}
                  {user.description && (
                    <div class="text-sm text-gray-600 truncate mt-1 font-medium">
                      {user.description}
                    </div>
                  )}
                  {user.score !== undefined && (
                    <div class="flex items-center space-x-2 mt-2">
                      <div class="text-xs text-white font-black bg-retro-teal px-3 py-1 rounded-full border-2 border-retro-purple shadow-retro">
                        SCORE: {user.score}
                      </div>
                    </div>
                  )}
                </div>
                <div class="text-retro-purple flex-shrink-0">
                  <div class="w-8 h-8 bg-retro-magenta rounded-full flex items-center justify-center border-2 border-retro-cyan">
                    <div class="text-white font-black">→</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDropdown && users.length === 0 && !isLoading && query.length >= 2 &&
        (
          <div class="absolute z-50 w-full mt-4 bg-white border-4 border-retro-magenta rounded-2xl shadow-retro-lg p-6 text-center">
            <div class="text-gray-700 font-bold">
              <div class="text-retro-purple mb-2 font-black text-lg">
                😅 NO USERS FOUND!
              </div>
              <div class="text-sm text-gray-600 font-medium">
                Try searching for a different name
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
