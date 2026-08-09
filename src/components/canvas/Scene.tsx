"use client";

import { Canvas } from "@react-three/fiber";
import { Preload, ScrollControls } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  GodRays,
} from "@react-three/postprocessing";
import { Suspense, useState, useEffect } from "react";
import * as THREE from "three";
import { Sun } from "./Sun";
import { Planet } from "./Planet";
import { Starfield } from "./Starfield";
import { AsteroidBelt } from "./AsteroidBelt";
import { MilkyWay } from "./MilkyWay";
import { KuiperBelt } from "./KuiperBelt";
import { ExoplanetSystem } from "./ExoplanetSystem";
import { Andromeda } from "./Andromeda";
import { CosmicWeb } from "./CosmicWeb";
import { Nebula } from "./Nebula";
import { LocalGroup } from "./LocalGroup";
import { JourneyController, planetData } from "./JourneyController";
import { OrbitalPaths } from "./OrbitalPaths";

export default function Scene() {
  const [sunMesh, setSunMesh] = useState<THREE.Mesh | null>(null);

  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-black">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 2, 15], fov: 45 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          localClippingEnabled: true,
        }}
      >
        <color attach="background" args={["#000000"]} />
        <Suspense fallback={null}>
          <ScrollControls pages={12} damping={0.1}>
            <JourneyController />
            <Starfield count={3000} />

            <Sun
              sunRef={setSunMesh}
              position={planetData[0].position as [number, number, number]}
            />

            <OrbitalPaths />

            {planetData.map((planet) => {
              const nonPlanetIds = [
                "sun",
                "milkyway",
                "kuiperbelt",
                "trappist",
                "nebula",
                "andromeda",
                "localgroup",
                "cosmicweb",
              ];
              if (nonPlanetIds.includes(planet.id)) return null;
              return (
                <Planet
                  key={planet.id}
                  id={planet.id}
                  name={planet.title}
                  position={planet.position as [number, number, number]}
                  size={planet.size}
                  color={planet.color}
                  moonCount={planet.moonCount}
                  orbitRadius={planet.orbitRadius}
                  orbitSpeed={planet.orbitSpeed}
                  orbitAngle={planet.orbitAngle}
                />
              );
            })}

            <AsteroidBelt />
            <KuiperBelt />
            <ExoplanetSystem position={[50, 20, -2500]} />

            <MilkyWay position={[0, -50, -5000]} />
            <Nebula position={[100, 50, -6000]} />
            <Andromeda position={[-150, 100, -7500]} />
            <LocalGroup position={[200, -100, -9000]} />
            <CosmicWeb position={[0, 0, -11000]} />

            <ambientLight intensity={0.1} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
          </ScrollControls>
          <Preload all />
        </Suspense>

        {sunMesh && (
          <EffectComposer>
            <GodRays sun={sunMesh} exposure={0.2} decay={0.92} blur />
            <Bloom
              luminanceThreshold={0.9}
              luminanceSmoothing={0.1}
              intensity={0.2}
              mipmapBlur
            />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
