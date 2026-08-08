import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

interface SunProps {
  position: [number, number, number];
  sunRef?: React.Ref<THREE.Mesh>;
}

export function Sun({ position, sunRef }: SunProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load real solar texture
  const textureUrl = "/textures/sun.jpg";
  const [colorMap] = useTexture([textureUrl]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group position={position} ref={groupRef}>
      <mesh ref={sunRef}>
        <sphereGeometry args={[12, 64, 64]} />
        <meshBasicMaterial map={colorMap} />
      </mesh>

      {/* Intense glow aura */}
      <mesh scale={1.2}>
        <sphereGeometry args={[12, 64, 64]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent={true}
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      <pointLight intensity={0.8} color="#ffaa33" distance={500} decay={1.5} />
      <pointLight intensity={0.4} color="#ffffff" distance={4000} decay={0.5} />
    </group>
  );
}
