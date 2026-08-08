import { create } from "zustand";

interface JourneyState {
  activePlanetId: string | null;
  isXRayMode: boolean;
  isDatabaseOpen: boolean;
  setActivePlanet: (id: string | null) => void;
  setXRayMode: (active: boolean) => void;
  toggleXRayMode: () => void;
  setDatabaseOpen: (active: boolean) => void;
  toggleDatabase: () => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  activePlanetId: null,
  isXRayMode: false,
  isDatabaseOpen: false,
  setActivePlanet: (id) => set({ activePlanetId: id }),
  setXRayMode: (active) => set({ isXRayMode: active }),
  toggleXRayMode: () => set((state) => ({ isXRayMode: !state.isXRayMode })),
  setDatabaseOpen: (active) => set({ isDatabaseOpen: active }),
  toggleDatabase: () =>
    set((state) => ({ isDatabaseOpen: !state.isDatabaseOpen })),
}));
