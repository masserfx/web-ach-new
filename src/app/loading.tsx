export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative inline-block">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-brand-primary rounded-full animate-spin"></div>
        </div>

        {/* Text */}
        <p className="mt-4 text-gray-600 font-medium">Načítám...</p>
      </div>
    </div>
  );
}
