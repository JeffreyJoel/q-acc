export default function ProfileLoader() {
  return (
    <div className="min-h-screen bg-neutral-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <HeaderSectionLoader />
        <NavigationTabsLoader />
        <StatsCardsLoader />
        <TokensSectionLoader />
      </div>
    </div>
  );
}

export function HeaderSectionLoader() {
  return (
    <div className="bg-neutral-800 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="w-20 h-20 bg-neutral-700 rounded-lg animate-pulse" />
          <div className="space-y-2">
            {/* Username */}
            <div className="w-8 h-6 bg-neutral-700 rounded animate-pulse" />
            {/* Wallet Address */}
            <div className="w-48 h-4 bg-neutral-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Verification Badges */}
        <div className="flex space-x-3">
          <div className="w-40 h-10 bg-neutral-700 rounded-full animate-pulse" />
          <div className="w-44 h-10 bg-neutral-700 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Points Section */}
      <div className="mt-6">
        <div className="w-36 h-10 bg-neutral-700 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

export function NavigationTabsLoader() {
  return (
    <div className="flex space-x-6">
      <div className="w-20 h-6 bg-neutral-700 rounded animate-pulse" />
      <div className="w-24 h-6 bg-neutral-700 rounded animate-pulse" />
      <div className="w-32 h-6 bg-neutral-700 rounded animate-pulse" />
    </div>
  );
}

export function StatsCardsLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-neutral-800 rounded-lg p-6 space-y-3">
        <div className="w-32 h-4 bg-neutral-700 rounded animate-pulse" />
        <div className="w-8 h-8 bg-neutral-700 rounded animate-pulse" />
      </div>
      <div className="bg-neutral-800 rounded-lg p-6 space-y-3">
        <div className="w-40 h-4 bg-neutral-700 rounded animate-pulse" />
        <div className="w-8 h-8 bg-neutral-700 rounded animate-pulse" />
      </div>
      <div className="bg-neutral-800 rounded-lg p-6 space-y-3">
        <div className="w-36 h-4 bg-neutral-700 rounded animate-pulse" />
        <div className="w-20 h-8 bg-neutral-700 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function TokensSectionLoader() {
  return (
    <div className="bg-neutral-800 rounded-lg p-6">
      <div className="w-36 h-6 bg-neutral-700 rounded animate-pulse mb-6" />

      <div className="space-y-4">
        {/* Token Row 1 */}
        <div className="flex items-center justify-between py-3 border-b border-neutral-700">
          <div className="space-y-2">
            <div className="w-16 h-5 bg-neutral-700 rounded animate-pulse" />
            <div className="w-24 h-4 bg-neutral-700 rounded animate-pulse" />
          </div>
          <div className="w-16 h-5 bg-neutral-700 rounded animate-pulse" />
        </div>

        {/* Token Row 2 */}
        <div className="flex items-center justify-between py-3 border-b border-neutral-700">
          <div className="space-y-2">
            <div className="w-20 h-5 bg-neutral-700 rounded animate-pulse" />
            <div className="w-20 h-4 bg-neutral-700 rounded animate-pulse" />
          </div>
          <div className="w-20 h-5 bg-neutral-700 rounded animate-pulse" />
        </div>

        {/* Token Row 3 */}
        <div className="flex items-center justify-between py-3 border-b border-neutral-700">
          <div className="space-y-2">
            <div className="w-18 h-5 bg-neutral-700 rounded animate-pulse" />
            <div className="w-16 h-4 bg-neutral-700 rounded animate-pulse" />
          </div>
          <div className="w-20 h-5 bg-neutral-700 rounded animate-pulse" />
        </div>

        {/* Token Row 4 */}
        <div className="flex items-center justify-between py-3">
          <div className="space-y-2">
            <div className="w-16 h-5 bg-neutral-700 rounded animate-pulse" />
            <div className="w-28 h-4 bg-neutral-700 rounded animate-pulse" />
          </div>
          <div className="w-20 h-5 bg-neutral-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
