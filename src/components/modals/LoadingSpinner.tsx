'use client';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#14446c] border-opacity-50" />
    </div>
  );
}
