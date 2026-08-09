import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll } from "@react-three/drei";

export function Starfield({ count = 5000 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const scroll = useScroll(); // Access the scroll state

  const [positions, scales, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    const col = new Float32Array(count * 3);
    
    // Star color palette (Realistic star temperatures, dimmer for low intensity)
    const starColors = [
      new THREE.Color("#ffffff").multiplyScalar(0.4), // Dim White
      new THREE.Color("#e2f0ff").multiplyScalar(0.4), // Dim Hot Blue
      new THREE.Color("#ffd4a1").multiplyScalar(0.4), // Dim Warm Yellow
      new THREE.Color("#ffb48a").multiplyScalar(0.3), // Dim Red Dwarf
      new THREE.Color("#ffffff").multiplyScalar(0.2), // Very dim white
      new THREE.Color("#ffffff").multiplyScalar(0.1), // Barely visible
    ];

    for (let i = 0; i < count; i++) {
      // Spread stars over a massive area
      pos[i * 3] = (Math.random() - 0.5) * 4000;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4000;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6000; // Deep Z axis
      
      // Make most stars small, very few large ones
      scl[i] = Math.random() > 0.95 ? (Math.random() * 2.0 + 1.0) : Math.random() * 0.5 + 0.1;
      
      // Assign random realistic color
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, scl, col];
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
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={2.5}
        vertexColors={true}
        sizeAttenuation={true}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
