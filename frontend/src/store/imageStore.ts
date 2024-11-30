import { create } from 'zustand';

interface Store {
  userImage: string | null;
  setUserImage: (url: string) => void;
}

const useStore = create<Store>((set) => ({
  userImage: null,
  setUserImage: (url: string) => set({ userImage: url }),
}));

export default useStore;
