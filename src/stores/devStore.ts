import { create } from 'zustand';

interface DevState {
  /** When true every mock request fails — lets reviewers see the friendly error UI. */
  simulateOffline: boolean;
  setSimulateOffline: (value: boolean) => void;
}

/** Not persisted on purpose: a restart always brings the network back. */
export const useDevStore = create<DevState>((set) => ({
  simulateOffline: false,
  setSimulateOffline: (simulateOffline) => set({ simulateOffline }),
}));
