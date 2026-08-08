import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Create a soft particle texture
function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

export function Nebula({ position }: { position: [number, number, number] }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 100000;

  const glowTexture = useMemo(() => createGlowTexture(), []);

  const [positions, colors] = useRef(
    (() => {
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const colorObj = new THREE.Color();

      // Based on the Crab Nebula image (Image 1)
      const colorInner = new THREE.Color("#00ffff"); // Bright cyan core
      const colorMid = new THREE.Color("#22aa44"); // Greenish transition
      const colorOuter = new THREE.Color("#ff4411"); // Fiery orange/red outer shell

      for (let i = 0; i < count; i++) {
        // Volumetric chaotic expansion
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);

        // Push most particles to an outer "shell" structure, with some in the core
        const r = Math.pow(Math.random(), 0.5) * 600;

        // Add turbulent distortions (simulating supernova explosion asymmetries)
        const distortionX = Math.sin(phi * 3) * 100;
        const distortionY = Math.cos(theta * 2) * 100;

        const x = r * Math.sin(phi) * Math.cos(theta) + distortionX;
        const z = r * Math.sin(phi) * Math.sin(theta);
        const y = r * Math.cos(phi) * 0.7 + distortionY; // slightly flattened

        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;

        // Color mapped by distance from center
        const dist = Math.sqrt(x * x + y * y + z * z);
        if (dist < 200) {
          colorObj.copy(colorInner).lerp(colorMid, dist / 200);
        } else {
          colorObj.copy(colorMid).lerp(colorOuter, (dist - 200) / 500);
        }

        // Randomize brightness slightly for texture
        const brightness = 0.5 + Math.random() * 0.5;
        col[i * 3] = colorObj.r * brightness;
        col[i * 3 + 1] = colorObj.g * brightness;
        col[i * 3 + 2] = colorObj.b * brightness;
      }
      return [pos, col];
    })(),
  ).current;

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.z += delta * 0.02;
    }
  });

  return (
    <group position={new THREE.Vector3(...position)}>
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
          size={15}
          map={glowTexture}
          vertexColors
          transparent
          opacity={0.4}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <pointLight color="#00ffff" intensity={3} distance={1000} decay={2} />
    </group>
  );
}
