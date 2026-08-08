import { create } from "zustand";

interface JourneyState {
  activePlanetId: string | null;
  isXRayMode: boolean;
  setActivePlanet: (id: string | null) => void;
  setXRayMode: (active: boolean) => void;
  toggleXRayMode: () => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  activePlanetId: null,
  isXRayMode: false,
  setActivePlanet: (id) => set({ activePlanetId: id }),
  setXRayMode: (active) => set({ isXRayMode: active }),
  toggleXRayMode: () => set((state) => ({ isXRayMode: !state.isXRayMode })),
}));
