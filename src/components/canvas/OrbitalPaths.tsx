import * as THREE from "three";
import { useJourneyStore } from "@/store/journeyStore";
import { planetData } from "./JourneyController";
import { useMemo } from "react";

export function OrbitalPaths() {
  const isOrbitMode = useJourneyStore((state) => state.isOrbitMode);

  const orbits = useMemo(() => {
    const sunPos = new THREE.Vector3(...(planetData[0].position as [number, number, number]));
    
    return planetData
      .filter((p) => p.id !== "sun" && !["milkyway", "kuiperbelt", "trappist", "nebula", "andromeda", "localgroup", "cosmicweb"].includes(p.id))
      .map((planet) => {
        const pPos = new THREE.Vector3(...(planet.position as [number, number, number]));
        const distance = sunPos.distanceTo(pPos);
        
        // We want to tilt the orbit slightly based on the planet's Y position relative to the sun
        const dy = pPos.y - sunPos.y;
        const dx = pPos.x - sunPos.x;
        const dz = pPos.z - sunPos.z;
        const groundDist = Math.sqrt(dx * dx + dz * dz);
        const inclination = Math.atan2(dy, groundDist);

        return { id: planet.id, distance, inclination, color: planet.color };
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
