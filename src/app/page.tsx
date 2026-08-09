"use client";

import dynamic from "next/dynamic";
import { useJourneyStore } from "@/store/journeyStore";
import { planetData } from "@/components/canvas/JourneyController";
import { Telescope, Layers, Compass, ExternalLink, X, Target } from "lucide-react";
import ThanosParticles from "@/components/ui/ThanosParticles";
import { motion, AnimatePresence } from "framer-motion";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#020205] flex items-center justify-center">
      <div className="text-white/80 font-inter font-bold tracking-widest text-sm animate-pulse">
        INITIATING LAUNCH SEQUENCE...
      </div>
    </div>
  ),
});

export default function Home() {
  const activePlanetId = useJourneyStore((state) => state.activePlanetId);
  const isFocusMode = useJourneyStore((state) => state.isFocusMode);
  const toggleFocusMode = useJourneyStore((state) => state.toggleFocusMode);
  const isOrbitMode = useJourneyStore((state) => state.isOrbitMode);
  const toggleOrbitMode = useJourneyStore((state) => state.toggleOrbitMode);
  const isDatabaseOpen = useJourneyStore((state) => state.isDatabaseOpen);
  const toggleDatabase = useJourneyStore((state) => state.toggleDatabase);
  const setSnapping = useJourneyStore((state) => state.setSnapping);
  const scrollTo = useJourneyStore((state) => state.scrollTo);

  const handleCloseDatabase = () => {
    setSnapping(true);
    toggleDatabase();
    setTimeout(() => {
      setSnapping(false);
    }, 2500);
  };

  // Default to Sun if none is active (e.g. at the very start)
  const activePlanet =
    planetData.find((p) => p.id === activePlanetId) || planetData[0];

  return (
    <>
      <Scene />

      <main className="fixed inset-0 w-full h-screen text-white pointer-events-none flex flex-col overflow-hidden z-10 select-none">
        {/* Minimalist Top Nav */}
        <header className="w-full p-8 md:px-12 md:py-8 flex justify-between items-center z-50 pointer-events-auto">
          <div className="text-xl font-bold tracking-tighter font-outfit uppercase flex items-center gap-2 drop-shadow-lg">
            <Compass className="w-5 h-5 text-indigo-400" />
            Cosmic Atlas
          </div>
          <nav className="flex items-center gap-6 font-inter text-sm font-bold tracking-widest uppercase text-white/80">

            {activePlanetId && (
              <button
                onClick={toggleOrbitMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  isOrbitMode
                    ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md"
                }`}
              >
                <Compass className="w-4 h-4" />
                <span className="hidden sm:inline">{isOrbitMode ? "Hide Orbits" : "Show Orbits"}</span>
              </button>
            )}

            {activePlanetId && (
              <button
                onClick={toggleFocusMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${isFocusMode ? "bg-white text-black border-white" : "bg-black/30 border-white/20 hover:bg-white/10"}`}
              >
                <Target size={18} className={isFocusMode ? "animate-pulse" : ""} />
                <span className="text-xs tracking-wider uppercase font-bold">Focus Mode</span>
              </button>
            )}

            {activePlanetId && (
              <button
                onClick={toggleDatabase}
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all bg-indigo-600/80 hover:bg-indigo-500 text-white border border-indigo-400/50 shadow-[0_0_15px_rgba(79,70,229,0.3)] backdrop-blur-md"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Database</span>
              </button>
            )}
          </nav>
        </header>

        {/* Dynamic HUD Container */}
        <div className="flex-1 flex items-end p-8 md:px-12 md:pb-12 z-50 pointer-events-none transition-all duration-500">
          <div className="w-full flex justify-between items-end">
            {/* Left Info Panel */}
            <div
              className={`max-w-md pointer-events-auto transition-opacity duration-500 ${activePlanet ? "opacity-100" : "opacity-0"}`}
            >
              <div className="inline-block px-3 py-1 mb-4 rounded-full border border-white/30 bg-white/10 text-white/90 text-xs font-bold tracking-widest uppercase backdrop-blur-md shadow-lg">
                Celestial Body
              </div>
              <h1 className="text-6xl md:text-8xl font-black font-outfit tracking-tighter mb-4 drop-shadow-2xl text-white">
                {activePlanet?.title}
              </h1>
              <p className="text-xl text-white/90 font-inter font-medium leading-relaxed drop-shadow-lg">
                {activePlanetId === "sun"
                  ? "Scroll to begin your journey to the edge of the observable universe."
                  : `Approaching ${activePlanet?.title}.`}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
              </div>
            </div>

            {/* Right Data Panel (Glassmorphic) */}
            <div
              className={`hidden md:block w-72 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 pointer-events-auto transition-opacity duration-500 ${activePlanet ? "opacity-100" : "opacity-0"}`}
            >
              <div className="text-xs text-white/50 mb-1">Status</div>
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-2 h-2 rounded-full ${isFocusMode ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
                <div className="text-sm font-bold tracking-widest">{isFocusMode ? "FOCUS ACTIVE" : "NOMINAL"}</div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/20 pb-2">
                  <span className="text-xs text-white/70 uppercase font-inter font-bold tracking-wider">
                    Distance from Sun
                  </span>
                  <span className="font-outfit font-bold text-lg text-white">
                    {activePlanet?.distance}
                  </span>
                </div>
                <div className="flex justify-between items-end border-b border-white/20 pb-2">
                  <span className="text-xs text-white/70 uppercase font-inter font-bold tracking-wider">
                    Mass
                  </span>
                  <span className="font-outfit font-bold text-lg text-indigo-300">
                    {activePlanet?.mass}
                  </span>
                </div>
                <div className="flex justify-between items-end border-b border-white/20 pb-2">
                  <span className="text-xs text-white/70 uppercase font-inter font-bold tracking-wider">
                    Gravity
                  </span>
                  <span className="font-outfit font-bold text-lg text-white">
                    {activePlanet?.gravity}
                  </span>
                </div>
                <div className="flex justify-between items-end border-b border-white/20 pb-2">
                  <span className="text-xs text-white/70 uppercase font-inter font-bold tracking-wider">
                    Mean Temp
                  </span>
                  <span className="font-outfit font-bold text-lg text-white">
                    {activePlanet?.temp}
                  </span>
                </div>
                <div className="flex justify-between items-end pt-1">
                  <span className="text-xs text-white/70 uppercase font-inter font-bold tracking-wider">
                    Atmosphere
                  </span>
                  <span className="font-outfit font-bold text-sm text-right max-w-[120px] leading-tight text-indigo-200">
                    {activePlanet?.atm}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Timeline Navigation */}
        <div className="hidden lg:flex flex-col gap-4 absolute left-8 top-1/2 -translate-y-1/2 z-[60] pointer-events-none">
          {planetData.map((planet, i) => {
            const isActive = activePlanetId === planet.id;
            return (
              <div
                key={planet.id}
                onClick={() => {
                  if (scrollTo) {
                    const offset = i / (planetData.length - 1);
                    scrollTo(offset);
                  }
                }}
                className="flex items-center gap-4 justify-start group cursor-pointer pointer-events-auto"
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

        {/* Focus Mode Overlay Warning */}
        {isFocusMode && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none animate-pulse">
            <div className="px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
              Focus Mode Engaged — Drag to Orbit
            </div>
          </div>
        )}

        {/* Database Modal Overlay */}
        <AnimatePresence>
          {isDatabaseOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 1.2 } }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/60 backdrop-blur-xl pointer-events-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 1.5, filter: "blur(20px)", rotate: 5, boxShadow: "0px 0px 100px 20px rgba(16, 185, 129, 0.8)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)", rotate: 0, boxShadow: "0px 0px 0px 0px rgba(16, 185, 129, 0)" }}
                exit={{ opacity: 0, scale: 1.1, y: -100, x: 50, filter: "blur(25px)", rotate: 5, transition: { duration: 1.2, ease: "easeOut" } }}
                transition={{ type: "spring", damping: 20, stiffness: 100, mass: 1 }}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black/40 border border-white/20 shadow-2xl rounded-3xl p-8 md:p-12 custom-scrollbar"
              >
                <button
                  onClick={handleCloseDatabase}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white border border-white/10"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="mb-6 inline-block px-3 py-1 rounded-full border border-indigo-500/50 bg-indigo-500/20 text-indigo-300 text-xs font-bold tracking-widest uppercase shadow-lg">
                  Database Entry // {activePlanet?.id.toUpperCase()}
                </div>
                
                <h2 className="text-5xl md:text-7xl font-black font-outfit mb-8 drop-shadow-xl text-white">
                  {activePlanet?.title}
                </h2>

                <p className="text-xl md:text-2xl font-inter text-white/90 leading-relaxed mb-12 drop-shadow-md">
                  {(activePlanet as any)?.description || "Data corrupted. Lore not found."}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/20 pt-8">
                  <div>
                    <h4 className="text-xs uppercase font-inter text-white/50 font-bold tracking-wider mb-1">Mass</h4>
                    <p className="text-lg font-bold font-outfit text-indigo-300">{activePlanet?.mass}</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-inter text-white/50 font-bold tracking-wider mb-1">Gravity</h4>
                    <p className="text-lg font-bold font-outfit text-white/90">{activePlanet?.gravity}</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-inter text-white/50 font-bold tracking-wider mb-1">Temperature</h4>
                    <p className="text-lg font-bold font-outfit text-white/90">{activePlanet?.temp}</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-inter text-white/50 font-bold tracking-wider mb-1">Atmosphere</h4>
                    <p className="text-lg font-bold font-outfit text-indigo-200 leading-tight">{activePlanet?.atm}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <ThanosParticles />
      </main>
    </>
  );
}
