import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll } from "@react-three/drei";

export function Starfield({ count = 5000 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const scroll = useScroll(); // Access the scroll state

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Spread stars over a massive area
      pos[i * 3] = (Math.random() - 0.5) * 2000;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5000; // Deep Z axis
      scl[i] = Math.random();
    }
    return [pos, scl];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !scroll) return;

    // We can use scroll delta to stretch stars or just move them fast
    // Scroll.offset goes from 0 to 1
    // To simulate warp speed, we move the stars along Z when scrolling fast.
    // For now, let's just create a continuous slow movement, and warp when scrolling.

    // Simple endless forward movement
    pointsRef.current.position.z += delta * 10;

    // Wrap around
    if (pointsRef.current.position.z > 2500) {
      pointsRef.current.position.z -= 5000;
    }
  });

  return (
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
          attach="attributes-scale"
          count={count}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={2}
        color="#ffffff"
        sizeAttenuation={true}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
