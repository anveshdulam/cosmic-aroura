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
}

export function Planet({
  id,
  name,
  position,
  size,
  color,
  moonCount,
}: PlanetProps) {
  const isXRayMode = useJourneyStore((state) => state.isXRayMode);
  const activePlanetId = useJourneyStore((state) => state.activePlanetId);
  const isActive = activePlanetId === id;

  const groupRef = useRef<THREE.Group>(null);
  const crustRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Load Photorealistic Textures
  const textureUrl = `/textures/${id}.jpg`;
  const [colorMap] = useTexture([textureUrl]);

  let cloudMap = null;
  if (id === "earth") {
    cloudMap = useTexture("/textures/clouds.jpg");
  }

  // Clipping planes for X-Ray (Fixed to World Coordinates of the planet)
  const clipPlanes = useMemo(
    () => [
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), position[0]),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), position[2]),
    ],
    [position],
  );

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
    // Parallax Rotation
    if (groupRef.current) {
      if (!isXRayMode || !isActive) {
        groupRef.current.rotation.y += delta * 0.05;
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
        <meshStandardMaterial
          map={colorMap}
          roughness={id === "earth" ? 0.4 : 0.8}
          metalness={id === "earth" ? 0.1 : 0.0}
          clippingPlanes={isXRayMode && isActive ? clipPlanes : []}
          clipIntersection={true}
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
            clippingPlanes={isXRayMode && isActive ? clipPlanes : []}
            clipIntersection={true}
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
          clippingPlanes={isXRayMode && isActive ? clipPlanes : []}
          clipIntersection={true}
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
            clippingPlanes={isXRayMode && isActive ? clipPlanes : []}
            clipIntersection={true}
          />
        </instancedMesh>
      )}

      {/* Internal Layers (Only visible in X-Ray mode) */}
      {isXRayMode && isActive && (
        <>
          <mesh>
            <sphereGeometry args={[size * 0.99, 64, 64]} />
            <meshStandardMaterial color="#333" side={THREE.BackSide} />
          </mesh>

          <mesh>
            <sphereGeometry args={[size * 0.8, 64, 64]} />
            <meshStandardMaterial
              color="#ff4400"
              emissive="#ff2200"
              emissiveIntensity={2}
            />
            <Html position={[size * 0.8, 0, 0]} center>
              <div className="px-3 py-1 bg-black/80 text-orange-500 text-xs font-bold border border-orange-500/50 rounded pointer-events-none backdrop-blur-md">
                Silicate Mantle
              </div>
            </Html>
          </mesh>

          <mesh>
            <sphereGeometry args={[size * 0.4, 32, 32]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffeedd"
              emissiveIntensity={5}
            />
            <Html position={[size * 0.4, size * 0.4, 0]} center>
              <div className="px-3 py-1 bg-black/80 text-white text-xs font-bold border border-white/50 rounded pointer-events-none backdrop-blur-md whitespace-nowrap">
                Iron Core
              </div>
            </Html>
          </mesh>
        </>
      )}
    </group>
  );
}
