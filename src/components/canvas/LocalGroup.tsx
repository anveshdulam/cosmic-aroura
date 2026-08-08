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
    gradient.addColorStop(0.3, "rgba(200, 200, 255, 0.8)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }
  return new THREE.CanvasTexture(canvas);
}

export function LocalGroup({
  position,
}: {
  position: [number, number, number];
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 150000;

  const starTexture = useMemo(() => createStarTexture(), []);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    // Create multiple "Clusters" to map the Local Group voids and nodes
    const numClusters = 40;
    const clusters: THREE.Vector3[] = [];

    for (let c = 0; c < numClusters; c++) {
      // Scatter clusters across a massive volume
      clusters.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 4000,
          (Math.random() - 0.5) * 2000,
          (Math.random() - 0.5) * 4000,
        ),
      );
    }

    for (let i = 0; i < count; i++) {
      // 90% of stars belong to a cluster, 10% drift in voids
      if (Math.random() > 0.1) {
        const cluster = clusters[Math.floor(Math.random() * numClusters)];
        // Denser near cluster center
        const r = Math.pow(Math.random(), 2) * 500;
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);

        pos[i * 3] = cluster.x + r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = cluster.y + r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = cluster.z + r * Math.cos(phi);
      } else {
        // Void stars
        pos[i * 3] = (Math.random() - 0.5) * 5000;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 2500;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 5000;
      }
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.01;
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
        </bufferGeometry>
        <pointsMaterial
          size={20}
          map={starTexture}
          color="#ffffff"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
