import { create } from 'zustand';

type LoadingStore = {
  isLoading: boolean;
  show: () => void;
  hide: () => void;
};

export const useLoading = create<LoadingStore>((set) => ({
  isLoading: false,
  show: () => set({ isLoading: true }),
  hide: () => set({ isLoading: false }),
}));
