// components/LoadingOverlay.tsx
'use client';

import { useLoading } from "@/store/useLoadingStore";
import { ClipLoader } from "react-spinners";

export default function LoadingOverlay() {
  const isLoading = useLoading(state => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <ClipLoader size={60} color="#ffffff" />
    </div>
  );
}
