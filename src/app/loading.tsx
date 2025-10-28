export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-carbon via-graphite to-carbon">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative inline-block">
          <div className="w-16 h-16 border-4 border-graphite border-t-accent rounded-full animate-spin"></div>
        </div>

        {/* Text */}
        <p className="mt-4 text-steel-dim font-medium">Načítám...</p>
      </div>
    </div>
  );
}
