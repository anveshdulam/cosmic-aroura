import * as THREE from "three";
import { useJourneyStore } from "@/store/journeyStore";
import { planetData } from "./JourneyController";
import { useMemo } from "react";

export function OrbitalPaths() {
  const isOrbitMode = useJourneyStore((state) => state.isOrbitMode);

  const orbits = useMemo(() => {
    const sunPos = new THREE.Vector3(...(planetData[0].position as [number, number, number]));
    
    return planetData
      .filter((p) => p.orbitRadius && p.orbitRadius > 0)
      .map((planet: any) => {
        // Our new dynamic orbits are perfectly flat (inclination 0) around the Sun
        return { id: planet.id, distance: planet.orbitRadius, inclination: 0, color: planet.color };
      });
  }, []);

  if (!isOrbitMode) return null;

  return (
    <group position={planetData[0].position as [number, number, number]}>
      {orbits.map((orbit) => (
        <mesh key={`orbit-${orbit.id}`} rotation-x={Math.PI / 2 + orbit.inclination}>
          <ringGeometry args={[orbit.distance - 0.1, orbit.distance + 0.1, 128]} />
          <meshBasicMaterial color={orbit.color} transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
