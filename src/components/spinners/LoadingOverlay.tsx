'use client';

import { useLoading } from '@/store/useLoadingStore';

export default function LoadingOverlay() {
  const isLoading = useLoading((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 
        flex items-center justify-center
        bg-black bg-opacity-40
        backdrop-blur-sm
      "
      aria-label="Chargement en cours"
      role="status"
    >
      <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
    </div>
  );
}
