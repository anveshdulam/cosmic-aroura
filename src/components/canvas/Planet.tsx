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

const getXRayLayers = (id: string, size: number) => {
  const gasGiants = ["jupiter", "saturn"];
  const iceGiants = ["uranus", "neptune"];
  
  if (gasGiants.includes(id)) {
    return [
      { radius: size * 0.9, color: "#112233", emissive: "#000000", label: "Molecular Hydrogen", pos: size * 0.9, intensity: 0 },
      { radius: size * 0.6, color: "#4455aa", emissive: "#112255", label: "Metallic Hydrogen", pos: size * 0.6, intensity: 1 },
      { radius: size * 0.2, color: "#ffeedd", emissive: "#ccaa88", label: "Rocky/Ice Core", pos: size * 0.2, intensity: 3 }
    ];
  } else if (iceGiants.includes(id)) {
    return [
      { radius: size * 0.9, color: "#112233", emissive: "#000000", label: "H/He Atmosphere", pos: size * 0.9, intensity: 0 },
      { radius: size * 0.6, color: "#2288cc", emissive: "#114488", label: "Icy Mantle (H2O, NH3)", pos: size * 0.6, intensity: 1 },
      { radius: size * 0.3, color: "#ddbb99", emissive: "#aa8866", label: "Silicate/Iron Core", pos: size * 0.3, intensity: 2 }
    ];
  } else {
    // Terrestrial planets (Earth, Mars, Venus, Mercury, Trappist)
    return [
      { radius: size * 0.99, color: "#333333", emissive: "#000000", label: "Crust", pos: size * 0.95, intensity: 0 },
      { radius: size * 0.8, color: "#ff4400", emissive: "#ff2200", label: "Silicate Mantle", pos: size * 0.8, intensity: 2 },
      { radius: size * 0.4, color: "#ffffff", emissive: "#ffeedd", label: "Iron Core", pos: size * 0.4, intensity: 5 }
    ];
  }
};

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

      {/* Saturn's Rings */}
      {id === "saturn" && (
        <mesh rotation={[Math.PI / 2 - 0.2, 0, 0]} receiveShadow castShadow>
          <ringGeometry args={[size * 1.4, size * 2.5, 64]} />
          <meshStandardMaterial
            color="#d3c0a5"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
            clippingPlanes={isXRayMode && isActive ? clipPlanes : []}
            clipIntersection={true}
          />
        </mesh>
      )}

      {/* Internal Layers (Only visible in X-Ray mode) */}
      {isXRayMode && isActive && (
        <>
          {getXRayLayers(id, size).map((layer, index) => (
            <mesh key={index}>
              <sphereGeometry args={[layer.radius, 64, 64]} />
              <meshStandardMaterial
                color={layer.color}
                emissive={layer.emissive}
                emissiveIntensity={layer.intensity}
                side={index === 0 ? THREE.BackSide : THREE.FrontSide}
              />
              <Html position={[layer.pos, layer.pos * (index === 1 ? 0.5 : 0), 0]} center zIndexRange={[100, 0]}>
                <div className={`px-3 py-1 bg-black/80 text-xs font-bold border rounded pointer-events-none backdrop-blur-md whitespace-nowrap ${index === 0 ? 'text-gray-300 border-gray-500/50' : index === 1 ? 'text-orange-400 border-orange-500/50' : 'text-white border-white/50'}`}>
                  {layer.label}
                </div>
              </Html>
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}
