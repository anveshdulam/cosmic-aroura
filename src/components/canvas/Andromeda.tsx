import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createStarTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }
  return new THREE.CanvasTexture(canvas);
}

export function Andromeda({
  position,
}: {
  position: [number, number, number];
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 150000;
  const starTexture = useMemo(() => createStarTexture(), []);

  const [positions, colors] = useRef(
    (() => {
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const colorObj = new THREE.Color();

      // Image 4 specific colors
      const colorCore = new THREE.Color("#ffffff"); // Bright white core
      const colorInnerArm = new THREE.Color("#ff00aa"); // Hot magenta
      const colorOuterArm = new THREE.Color("#4400aa"); // Deep purple
      const colorEdge = new THREE.Color("#0044ff"); // Icy blue edges

      for (let i = 0; i < count; i++) {
        // Tightly wound spiral
        const radius = Math.pow(Math.random(), 1.2) * 1500;
        const spinAngle = radius * 0.008; // very tight spiral
        const branchAngle = ((i % 2) * Math.PI * 2) / 2; // 2 major arms
        const angle = spinAngle + branchAngle + (Math.random() - 0.5) * 0.4;

        // Elongated disk (simulate the bulge)
        const x = Math.cos(angle) * radius * 1.5;
        const z = Math.sin(angle) * radius * 0.5;
        const y = (Math.random() - 0.5) * (150 * Math.exp(-radius / 300));

        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;

        // Beautiful layered color logic
        if (radius < 150) {
          colorObj.copy(colorCore);
        } else if (radius < 600) {
          colorObj.copy(colorCore).lerp(colorInnerArm, (radius - 150) / 450);
        } else if (radius < 1100) {
          colorObj
            .copy(colorInnerArm)
            .lerp(colorOuterArm, (radius - 600) / 500);
        } else {
          colorObj.copy(colorOuterArm).lerp(colorEdge, (radius - 1100) / 400);
        }

        // Randomize brightness
        const brightness = 0.5 + Math.random() * 0.5;
        col[i * 3] = colorObj.r * brightness;
        col[i * 3 + 1] = colorObj.g * brightness;
        col[i * 3 + 2] = colorObj.b * brightness;
      }
      return [pos, col];
    })(),
  ).current;

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    // Extreme tilt to match Image 4 (Edge-on perspective)
    <group
      position={new THREE.Vector3(...position)}
      rotation={[Math.PI / 4, 0, Math.PI / 6]}
    >
      <points ref={pointsRef}>
        <bufferGeometry>
          {/* @ts-ignore */}
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          {/* @ts-ignore */}
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={8}
          map={starTexture}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Supermassive Black Hole & Intense Core Glow */}
      <mesh>
        <sphereGeometry args={[15, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      <pointLight color="#ffffff" intensity={15} distance={1500} decay={2} />
      <mesh>
        <sphereGeometry args={[80, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
