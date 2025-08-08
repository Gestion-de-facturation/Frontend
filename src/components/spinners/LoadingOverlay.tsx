'use client';

import { useLoading } from '@/store/useLoadingStore';

export default function LoadingOverlay() {
  const isLoading = useLoading((state) => state.isLoading);

  if (!isLoading) return null;

  return (
        <div className="absolute fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="h-12 w-12 border-4 border-[#1444f6] border-t-transparent rounded-full animate-spin" />
        </div>
  );
}
