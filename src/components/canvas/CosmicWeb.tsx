import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(255, 220, 150, 0.8)"); // Golden white
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }
  return new THREE.CanvasTexture(canvas);
}

function createRedGlow() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.1, "rgba(255, 50, 50, 0.8)");
    gradient.addColorStop(0.4, "rgba(150, 0, 0, 0.4)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(canvas);
}

export function CosmicWeb({
  position,
}: {
  position: [number, number, number];
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 300000;

  const starTexture = useMemo(() => createGlowTexture(), []);
  const redGlow = useMemo(() => createRedGlow(), []);

  const [positions, colors] = useRef(
    (() => {
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const colorObj = new THREE.Color();

      // The Great Attractor is at (0,0,0) locally.
      // We will create "veins" that converge to it.
      const numTrunks = 5;
      const branchesPerTrunk = 8;

      const veins: {
        start: THREE.Vector3;
        end: THREE.Vector3;
        control: THREE.Vector3;
      }[] = [];

      // Generate the branching skeleton
      for (let t = 0; t < numTrunks; t++) {
        const trunkEnd = new THREE.Vector3(
          (Math.random() - 0.5) * 8000,
          (Math.random() - 0.5) * 8000,
          (Math.random() - 0.5) * 8000,
        );
        const trunkControl = new THREE.Vector3(
          (Math.random() - 0.5) * 4000,
          (Math.random() - 0.5) * 4000,
          (Math.random() - 0.5) * 4000,
        );

        veins.push({
          start: new THREE.Vector3(0, 0, 0),
          end: trunkEnd,
          control: trunkControl,
        });

        for (let b = 0; b < branchesPerTrunk; b++) {
          const branchStartT = 0.2 + Math.random() * 0.6; // Branch off somewhere along the trunk
          const branchStart = new THREE.Vector3(
            Math.pow(1 - branchStartT, 2) * 0 +
              2 * (1 - branchStartT) * branchStartT * trunkControl.x +
              Math.pow(branchStartT, 2) * trunkEnd.x,
            Math.pow(1 - branchStartT, 2) * 0 +
              2 * (1 - branchStartT) * branchStartT * trunkControl.y +
              Math.pow(branchStartT, 2) * trunkEnd.y,
            Math.pow(1 - branchStartT, 2) * 0 +
              2 * (1 - branchStartT) * branchStartT * trunkControl.z +
              Math.pow(branchStartT, 2) * trunkEnd.z,
          );

          const branchEnd = new THREE.Vector3(
            trunkEnd.x + (Math.random() - 0.5) * 4000,
            trunkEnd.y + (Math.random() - 0.5) * 4000,
            trunkEnd.z + (Math.random() - 0.5) * 4000,
          );

          const branchControl = new THREE.Vector3(
            (branchStart.x + branchEnd.x) / 2 + (Math.random() - 0.5) * 2000,
            (branchStart.y + branchEnd.y) / 2 + (Math.random() - 0.5) * 2000,
            (branchStart.z + branchEnd.z) / 2 + (Math.random() - 0.5) * 2000,
          );

          veins.push({
            start: branchStart,
            end: branchEnd,
            control: branchControl,
          });
        }
      }

      for (let i = 0; i < count; i++) {
        // Pick a random vein
        const vein = veins[Math.floor(Math.random() * veins.length)];

        // Pick a position along the quadratic bezier curve of the vein
        const t = Math.pow(Math.random(), 1.5); // Biased towards the Great Attractor (t=0)

        const baseX =
          Math.pow(1 - t, 2) * vein.start.x +
          2 * (1 - t) * t * vein.control.x +
          Math.pow(t, 2) * vein.end.x;
        const baseY =
          Math.pow(1 - t, 2) * vein.start.y +
          2 * (1 - t) * t * vein.control.y +
          Math.pow(t, 2) * vein.end.y;
        const baseZ =
          Math.pow(1 - t, 2) * vein.start.z +
          2 * (1 - t) * t * vein.control.z +
          Math.pow(t, 2) * vein.end.z;

        // Add scattering thickness to the vein
        const scatter = 300 * Math.exp(t * 2); // gets wider further out
        const x = baseX + (Math.random() - 0.5) * scatter;
        const y = baseY + (Math.random() - 0.5) * scatter;
        const z = baseZ + (Math.random() - 0.5) * scatter;

        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;

        // Colors: Golden white filaments converging
        const dist = Math.sqrt(x * x + y * y + z * z);
        if (dist < 300) {
          colorObj.set("#ff0000"); // Red core (Great Attractor)
        } else {
          colorObj.lerpColors(
            new THREE.Color("#ffffff"),
            new THREE.Color("#ffaa44"),
            Math.min(dist / 3000, 1),
          );
        }

        col[i * 3] = colorObj.r;
        col[i * 3 + 1] = colorObj.g;
        col[i * 3 + 2] = colorObj.b;
      }
      return [pos, col];
    })(),
  ).current;

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.002;
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
          size={25}
          map={starTexture}
          vertexColors
          transparent
          opacity={0.3}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* The Great Attractor (Realistic Anomaly) */}
      <sprite scale={[1500, 1500, 1]}>
        <spriteMaterial
          map={redGlow}
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </sprite>

      {/* Deep dark void core */}
      <mesh>
        <sphereGeometry args={[80, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      <pointLight color="#ff2222" intensity={8} distance={6000} decay={2} />
    </group>
  );
}
