import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Create a realistic ultra-cool red dwarf glow texture
function createRedDwarfGlow() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    // TRAPPIST-1 is an ultra-cool M-dwarf (about 2550 K)
    gradient.addColorStop(0, "rgba(255, 230, 200, 1)"); // Hot core (slightly yellowish white)
    gradient.addColorStop(0.1, "rgba(255, 100, 50, 0.9)"); // Bright orange
    gradient.addColorStop(0.4, "rgba(200, 20, 0, 0.6)"); // Deep red atmosphere
    gradient.addColorStop(0.7, "rgba(100, 0, 0, 0.2)"); // Outer corona
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // Fade to black
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(canvas);
}

export function ExoplanetSystem({
  position,
}: {
  position: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);

  // TRAPPIST-1 has 7 tightly packed terrestrial planets (b, c, d, e, f, g, h)
  const planets = [
    { radius: 10, size: 0.3, color: "#443322", speed: 0.8 }, // b
    { radius: 14, size: 0.3, color: "#554433", speed: 0.6 }, // c
    { radius: 19, size: 0.25, color: "#334455", speed: 0.5 }, // d
    { radius: 25, size: 0.3, color: "#335566", speed: 0.4 }, // e (habitable zone)
    { radius: 32, size: 0.3, color: "#445577", speed: 0.35 }, // f (habitable zone)
    { radius: 40, size: 0.35, color: "#556688", speed: 0.3 }, // g (habitable zone)
    { radius: 50, size: 0.25, color: "#667799", speed: 0.2 }, // h
  ];

  const planetRefs = useRef<(THREE.Mesh | null)[]>([]);

  const glowTexture = useMemo(() => createRedDwarfGlow(), []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Very slow rotation for the entire system
      groupRef.current.rotation.y += delta * 0.02;
      groupRef.current.rotation.x = Math.PI / 12; // Slight tilt so we see transits

      // Fast orbit for exoplanets around the dwarf star
      planets.forEach((planet, i) => {
        if (planetRefs.current[i]) {
          const time = state.clock.elapsedTime * planet.speed;
          planetRefs.current[i]!.position.x = Math.cos(time) * planet.radius;
          planetRefs.current[i]!.position.z = Math.sin(time) * planet.radius;
          // Rotate planet on its axis
          planetRefs.current[i]!.rotation.y += delta * 2;
        }
      });
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Volumetric Red Dwarf Star (Using a massive camera-facing sprite for realistic atmospheric glow) */}
      <sprite scale={[45, 45, 1]}>
        <spriteMaterial
          map={glowTexture}
          blending={THREE.AdditiveBlending}
          transparent
          opacity={1}
          depthWrite={false}
        />
      </sprite>

      {/* Solid core to occlude planets passing behind it */}
      <mesh>
        <sphereGeometry args={[3.8, 64, 64]} />
        <meshBasicMaterial color="#ff2200" />
      </mesh>

      {/* Intense local point light for the exoplanets */}
      <pointLight intensity={2.5} color="#ff4411" distance={300} decay={1.5} />

      {/* Exoplanets */}
      {planets.map((planet, i) => (
        <mesh
          key={i}
          ref={(el) => {
            planetRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[planet.size, 32, 32]} />
          {/* Use standard material so they are properly silhouetted against the star when transiting */}
          <meshStandardMaterial
            color={planet.color}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}
