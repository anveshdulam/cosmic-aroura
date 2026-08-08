"use client";

import dynamic from "next/dynamic";
import { useJourneyStore } from "@/store/journeyStore";
import { planetData } from "@/components/canvas/JourneyController";
import { Telescope, Layers, Compass } from "lucide-react";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#020205] flex items-center justify-center">
      <div className="text-white/50 font-inter tracking-widest text-sm animate-pulse">
        INITIATING LAUNCH SEQUENCE...
      </div>
    </div>
  ),
});

export default function Home() {
  const activePlanetId = useJourneyStore((state) => state.activePlanetId);
  const isXRayMode = useJourneyStore((state) => state.isXRayMode);
  const toggleXRayMode = useJourneyStore((state) => state.toggleXRayMode);

  // Default to Sun if none is active (e.g. at the very start)
  const activePlanet =
    planetData.find((p) => p.id === activePlanetId) || planetData[0];

  return (
    <>
      <Scene />

      <main className="fixed inset-0 w-full h-screen text-white pointer-events-none flex flex-col overflow-hidden z-10 select-none">
        {/* Minimalist Top Nav */}
        <header className="w-full p-8 md:px-12 md:py-8 flex justify-between items-center z-50 pointer-events-auto">
          <div className="text-xl font-bold tracking-tighter font-outfit uppercase flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            Cosmic Atlas
          </div>
          <nav className="flex gap-6 font-inter text-sm tracking-widest uppercase text-white/50">
            <button className="hover:text-white transition-colors">
              Mission
            </button>
            <button className="hover:text-white transition-colors">
              Database
            </button>
          </nav>
        </header>

        {/* Dynamic HUD Container */}
        <div className="flex-1 flex items-end p-8 md:px-12 md:pb-12 z-50 pointer-events-none transition-all duration-500">
          <div className="w-full flex justify-between items-end">
            {/* Left Info Panel */}
            <div
              className={`max-w-md pointer-events-auto transition-opacity duration-500 ${activePlanet ? "opacity-100" : "opacity-0"}`}
            >
              <div className="inline-block px-3 py-1 mb-4 rounded-full border border-white/20 bg-white/5 text-white/70 text-xs font-medium tracking-widest uppercase backdrop-blur-md">
                Celestial Body
              </div>
              <h1 className="text-6xl md:text-8xl font-bold font-outfit tracking-tighter mb-4 drop-shadow-2xl">
                {activePlanet?.title}
              </h1>
              <p className="text-lg text-white/60 font-inter leading-relaxed drop-shadow-md">
                {activePlanetId === "sun"
                  ? "Scroll to begin your journey to the edge of the observable universe."
                  : `Approaching ${activePlanet?.title}.`}
              </p>

              {/* X-Ray Toggle Button */}
              {activePlanetId !== "sun" &&
                activePlanetId !== "milkyway" &&
                activePlanetId && (
                  <button
                    onClick={toggleXRayMode}
                    className={`mt-6 flex items-center gap-2 px-6 py-3 rounded-full font-inter text-sm font-semibold tracking-wide transition-all ${
                      isXRayMode
                        ? "bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                        : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10"
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    {isXRayMode ? "Disable X-Ray" : "Inspect Internal Layers"}
                  </button>
                )}
            </div>

            {/* Right Data Panel (Glassmorphic) */}
            <div
              className={`hidden md:block w-72 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 pointer-events-auto transition-opacity duration-500 ${activePlanet ? "opacity-100" : "opacity-0"}`}
            >
              <div className="flex items-center gap-2 mb-6">
                <Telescope className="w-4 h-4 text-white/50" />
                <h3 className="text-sm uppercase tracking-widest text-white/50 font-inter font-medium">
                  Telemetry
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                  <span className="text-xs text-white/40 uppercase font-inter tracking-wider">
                    Distance from Sun
                  </span>
                  <span className="font-outfit font-medium text-lg">
                    {activePlanet?.distance}
                  </span>
                </div>
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                  <span className="text-xs text-white/40 uppercase font-inter tracking-wider">
                    Mass
                  </span>
                  <span className="font-outfit font-medium text-lg text-indigo-300">
                    {activePlanet?.mass}
                  </span>
                </div>
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                  <span className="text-xs text-white/40 uppercase font-inter tracking-wider">
                    Gravity
                  </span>
                  <span className="font-outfit font-medium text-lg">
                    {activePlanet?.gravity}
                  </span>
                </div>
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                  <span className="text-xs text-white/40 uppercase font-inter tracking-wider">
                    Mean Temp
                  </span>
                  <span className="font-outfit font-medium text-lg">
                    {activePlanet?.temp}
                  </span>
                </div>
                <div className="flex justify-between items-end pt-1">
                  <span className="text-xs text-white/40 uppercase font-inter tracking-wider">
                    Atmosphere
                  </span>
                  <span className="font-outfit font-medium text-sm text-right max-w-[120px] leading-tight">
                    {activePlanet?.atm}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Timeline Navigation */}
        <div className="hidden lg:flex flex-col gap-4 absolute left-8 top-1/2 -translate-y-1/2 z-50 pointer-events-auto">
          {planetData.map((planet) => {
            const isActive = activePlanetId === planet.id;
            return (
              <div
                key={planet.id}
                className="flex items-center gap-4 justify-start group cursor-pointer"
              >
                <div
                  className={`rounded-full transition-all duration-300 flex-shrink-0 ${isActive ? "w-3 h-3 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "w-2 h-2 bg-white/20 group-hover:bg-white/50 group-hover:scale-125"}`}
                />
                <span
                  className={`text-xs font-inter tracking-widest uppercase transition-opacity duration-300 whitespace-nowrap ${isActive ? "text-white opacity-100" : "text-white/30 opacity-0 group-hover:opacity-100"}`}
                >
                  {planet.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* X-Ray Mode Overlay Warning */}
        {isXRayMode && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none animate-pulse">
            <div className="px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
              Focus Mode Engaged — Drag to Orbit
            </div>
          </div>
        )}
      </main>
    </>
  );
}
