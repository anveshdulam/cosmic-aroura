import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useJourneyStore } from "@/store/journeyStore";
import { Html, useTexture } from "@react-three/drei";

interface PlanetProps {
  id: string;
  name: string;
  position: [number, number, number];
  size: number;
  color: string;
  moonCount?: number;
  orbitRadius?: number;
  orbitSpeed?: number;
  orbitAngle?: number;
}

export function Planet({
  id,
  name,
  position,
  size,
  color,
  moonCount,
  orbitRadius,
  orbitSpeed,
  orbitAngle,
}: PlanetProps) {
  const isFocusMode = useJourneyStore((state) => state.isFocusMode);
  const isOrbitMode = useJourneyStore((state) => state.isOrbitMode);
  const activePlanetId = useJourneyStore((state) => state.activePlanetId);
  const isActive = activePlanetId === id;

  const groupRef = useRef<THREE.Group>(null);
  const crustRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Load Photorealistic Textures safely
  const texturedPlanets = ["sun", "mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"];
  const hasTexture = texturedPlanets.includes(id);
  const textureUrl = hasTexture ? `/textures/${id}.jpg` : "/textures/mercury.jpg"; // Safe fallback to satisfy the hook
  const [colorMap] = useTexture([textureUrl]);

  let cloudMap = null;
  if (id === "earth") {
    cloudMap = useTexture("/textures/clouds.jpg");
  }

  const moonCountSafe = moonCount || 0;

  const moonsData = useMemo(() => {
    const data = [];
    for (let i = 0; i < moonCountSafe; i++) {
      // Scale moon distance and size relative to the planet's size
      const dist =
        size * 1.5 + Math.random() * (size * 2) + Math.pow(i, 0.7) * 0.5;
      data.push({
        distance: dist,
        speed:
          (Math.random() * 0.3 + 0.1) *
          (Math.random() > 0.5 ? 1 : -1) *
          (10 / dist), // Kepler-like speed dropoff
        angle: Math.random() * Math.PI * 2,
        inclination: (Math.random() - 0.5) * 0.4, // Orbital tilt
        size: Math.random() * (size * 0.04) + size * 0.02,
      });
    }
    return data;
  }, [moonCountSafe, size]);

  const moonsRef = useRef<THREE.InstancedMesh>(null);
  const tempMatrix = new THREE.Matrix4();
  
  useFrame((state, delta) => {
    // Continuous Parallax Rotation
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      
      // Orbital Physics
      if (orbitRadius && orbitSpeed && orbitAngle !== undefined) {
        const angle = orbitAngle + state.clock.elapsedTime * orbitSpeed;
        const x = Math.cos(angle) * orbitRadius;
        const z = Math.sin(angle) * orbitRadius - 50; // Sun offset
        groupRef.current.position.set(x, position[1], z);
      }
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.07;
    }

    // Instanced Moons Orbit Logic
    if (moonsRef.current && moonCountSafe > 0) {
      moonsData.forEach((moon, i) => {
        moon.angle += moon.speed * delta;
        const x = Math.cos(moon.angle) * moon.distance;
        const z = Math.sin(moon.angle) * moon.distance;
        const y = Math.sin(moon.angle) * moon.distance * moon.inclination;

        tempMatrix.makeTranslation(x, y, z);
        const scale = moon.size;
        tempMatrix.scale(new THREE.Vector3(scale, scale, scale));

        moonsRef.current!.setMatrixAt(i, tempMatrix);
      });
      moonsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  // Atmosphere Shader (Fresnel Glow)
  const atmosphereVertexShader = `
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const atmosphereFragmentShader = `
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    uniform vec3 glowColor;
    void main() {
      float intensity = pow(0.65 - dot(vNormal, vPositionNormal), 3.0);
      gl_FragColor = vec4(glowColor, 1.0) * intensity;
    }
  `;

  return (
    <group position={position} ref={groupRef}>
      {/* Outer Crust (Photorealistic) */}
      <mesh ref={crustRef} castShadow receiveShadow>
        <sphereGeometry args={[size, 64, 64]} />
        <meshPhysicalMaterial
          map={hasTexture ? colorMap : undefined}
          color={hasTexture ? undefined : color}
          bumpMap={hasTexture ? colorMap : undefined}
          bumpScale={0.02}
          roughness={id === "earth" ? 0.4 : 0.8}
          metalness={id === "earth" ? 0.1 : 0.0}
        />
      </mesh>

      {/* Cloud Layer (Earth only) */}
      {cloudMap && (
        <mesh ref={cloudsRef} scale={1.01}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            map={cloudMap}
            transparent={true}
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Atmospheric Glow (Fresnel) */}
      <mesh ref={atmosphereRef} scale={1.15}>
        <sphereGeometry args={[size, 64, 64]} />
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          uniforms={{
            glowColor: { value: new THREE.Color(color).multiplyScalar(1.5) },
          }}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent={true}
        />
      </mesh>

      {/* Instanced Moons */}
      {moonCountSafe > 0 && (
        <instancedMesh
          ref={moonsRef}
          args={[undefined as any, undefined as any, moonCountSafe]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#bbccdd"
            roughness={0.9}
            metalness={0.1}
          />
        </instancedMesh>
      )}

      {/* Saturn's Rings */}
      {id === "saturn" && (
        <mesh rotation={[Math.PI / 2 - 0.2, 0, 0]} receiveShadow castShadow>
          <ringGeometry args={[size * 1.4, size * 2.5, 64]} />
          <meshStandardMaterial
            color="#d3c0a5"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Planet Name Label (Zoomed Out) */}
      {!isActive && (
        <Html position={[size * 1.5, 0, 0]} center>
          <div className="font-inter text-lg font-bold text-white/80 tracking-widest uppercase pointer-events-none whitespace-nowrap drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
            {name}
          </div>
        </Html>
      )}
      
      {/* Moon Orbits */}
      {isOrbitMode && moonsData.map((moon, index) => (
        <mesh key={`moon-orbit-${index}`} rotation-x={Math.PI / 2 + moon.inclination}>
          <ringGeometry args={[moon.distance - 0.05, moon.distance + 0.05, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
