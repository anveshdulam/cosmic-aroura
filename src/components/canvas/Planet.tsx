import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useJourneyStore } from "@/store/journeyStore";
import { Html, Line, useTexture } from "@react-three/drei";

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

  // Clipping planes for X-Ray mode (Clip front half facing the camera)
  const clipPlanes = useMemo(() => {
    return [new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)];
  }, []);

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
  
  // Refs for zoom-dependent label fading
  const internalLabelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const externalLabelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineMaterialRefs = useRef<any[]>([]);

  useFrame((state, delta) => {
    // Parallax Rotation
    if (groupRef.current) {
      if (!isXRayMode || !isActive) {
        groupRef.current.rotation.y += delta * 0.05;
      } else {
        let currentY = groupRef.current.rotation.y % (Math.PI * 2);
        // Ensure we take the shortest path to 0
        if (currentY > Math.PI) currentY -= Math.PI * 2;
        if (currentY < -Math.PI) currentY += Math.PI * 2;
        
        groupRef.current.rotation.y = THREE.MathUtils.lerp(currentY, 0, 0.05);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.05);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.05);
      }
      
      // Handle zoom-dependent label visibility
      if (isActive && isXRayMode) {
        const dist = state.camera.position.distanceTo(groupRef.current.position);
        // Fade starts at 2.5x size and ends at 4x size
        const minZoom = size * 2.5;
        const maxZoom = size * 4.0;
        const zoomLevel = THREE.MathUtils.clamp((dist - minZoom) / (maxZoom - minZoom), 0, 1);
        
        internalLabelRefs.current.forEach(ref => {
          if (ref) ref.style.opacity = (1 - zoomLevel).toString();
        });
        externalLabelRefs.current.forEach(ref => {
          if (ref) ref.style.opacity = zoomLevel.toString();
        });
        lineMaterialRefs.current.forEach(mat => {
          if (mat) {
             mat.opacity = zoomLevel * 0.8;
          }
        });
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
          {getXRayLayers(id, size).map((layer, index) => {
            // Draw an elegant 3-point infographic line in the XY plane
            const angle = Math.PI / 4; // 45 degrees top-right
            
            // Point A: On the edge of the layer
            const startX = layer.radius * Math.cos(angle);
            const startY = layer.radius * Math.sin(angle);
            const startPoint = new THREE.Vector3(startX, startY, 0);
            
            // Point B: Diagonal bend slightly outside the layer
            const bendRadius = layer.radius + size * 0.15;
            const bendX = bendRadius * Math.cos(angle);
            const bendY = bendRadius * Math.sin(angle);
            const bendPoint = new THREE.Vector3(bendX, bendY, 0);
            
            // Point C: Horizontal extension to the right
            const endX = size * 1.5;
            const endPoint = new THREE.Vector3(endX, bendY, 0);
            
            return (
              <mesh key={index}>
                <sphereGeometry args={[layer.radius, 64, 64]} />
                <meshStandardMaterial
                  color={layer.color}
                  emissive={layer.emissive}
                  emissiveIntensity={layer.intensity}
                  side={index === 0 ? THREE.BackSide : THREE.FrontSide}
                />
                
                {/* Infographic Line */}
                <Line
                  points={[startPoint, bendPoint, endPoint]}
                  color={index === 0 ? "#888888" : index === 1 ? "#ffaa00" : "#ffffff"}
                  lineWidth={2}
                  transparent
                  opacity={0.8}
                  ref={(r: any) => { if (r && r.material) lineMaterialRefs.current[index] = r.material; }}
                />

                {/* Internal Label ON the crust (Zoomed In) */}
                <Html position={[layer.pos * Math.cos(angle), layer.pos * Math.sin(angle), size * 0.05]} center transform sprite scale={0.01}>
                  <div 
                    ref={el => { internalLabelRefs.current[index] = el; }} 
                    className="font-inter text-sm md:text-base font-black tracking-wider uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] pointer-events-none whitespace-nowrap"
                  >
                    {layer.label}
                  </div>
                </Html>

                {/* External Label (Zoomed Out) */}
                <Html position={[endPoint.x, endPoint.y, endPoint.z]} center transform sprite scale={0.01}>
                  <div 
                    ref={el => { externalLabelRefs.current[index] = el; }} 
                    className={`font-inter px-3 py-1 bg-black/80 text-xs font-bold border rounded-lg pointer-events-none whitespace-nowrap shadow-[0_0_15px_rgba(0,0,0,0.8)] ${index === 0 ? 'text-gray-300 border-gray-500/50' : index === 1 ? 'text-orange-400 border-orange-500/50' : 'text-white border-white/50'}`}
                  >
                    {layer.label}
                  </div>
                </Html>
              </mesh>
            );
          })}
        </>
      )}

      {/* Planet Name Label (Zoomed Out) */}
      {!isActive && (
        <Html position={[size * 1.5, 0, 0]} center>
          <div className="font-inter text-lg font-bold text-white/80 tracking-widest uppercase pointer-events-none whitespace-nowrap drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
            {name}
          </div>
        </Html>
      )}
    </group>
  );
}
