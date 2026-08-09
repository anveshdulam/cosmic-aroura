import { create } from "zustand";

interface JourneyState {
  activePlanetId: string | null;
  isXRayMode: boolean;
  isDatabaseOpen: boolean;
  isSnapping: boolean;
  isOrbitMode: boolean;
  setActivePlanet: (id: string | null) => void;
  setXRayMode: (active: boolean) => void;
  toggleXRayMode: () => void;
  setOrbitMode: (active: boolean) => void;
  toggleOrbitMode: () => void;
  setDatabaseOpen: (active: boolean) => void;
  toggleDatabase: () => void;
  setSnapping: (active: boolean) => void;
  scrollTo: ((offset: number) => void) | null;
  setScrollTo: (fn: (offset: number) => void) => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  activePlanetId: null,
  isXRayMode: false,
  isOrbitMode: false,
  isDatabaseOpen: false,
  isSnapping: false,
  setActivePlanet: (id) => set({ activePlanetId: id }),
  setXRayMode: (active) => set({ isXRayMode: active }),
  toggleXRayMode: () => set((state) => ({ isXRayMode: !state.isXRayMode })),
  setOrbitMode: (active) => set({ isOrbitMode: active }),
  toggleOrbitMode: () => set((state) => ({ isOrbitMode: !state.isOrbitMode })),
  setDatabaseOpen: (active) => set({ isDatabaseOpen: active }),
  toggleDatabase: () =>
    set((state) => ({ isDatabaseOpen: !state.isDatabaseOpen })),
  setSnapping: (active) => set({ isSnapping: active }),
  scrollTo: null,
  setScrollTo: (fn) => set({ scrollTo: fn }),
}));
