import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function KuiperBelt() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 15000; // Pushing the GPU limit for realism

  // Generate random asteroid positions and rotations
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Radius between 1350 and 1650 (Outer edge of solar system)
      const radius = 1350 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      // Greater vertical variation for the Kuiper Belt/Oort cloud
      const y = (Math.random() - 0.5) * 150;

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      // Icy/Rock compositions mean some vary in size drastically
      temp.push({
        position: new THREE.Vector3(x, y, z),
        rotation: new THREE.Vector3(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ),
        scale: 0.5 + Math.random() * 2.5,
        speed: 0.01 + Math.random() * 0.05,
        angle: theta,
        radius: radius,
      });
    }
    return temp;
  }, [count]);

  useMemo(() => {
    if (meshRef.current) {
      particles.forEach((particle, i) => {
        dummy.position.copy(particle.position);
        dummy.rotation.set(
          particle.rotation.x,
          particle.rotation.y,
          particle.rotation.z,
        );
        dummy.scale.set(particle.scale, particle.scale, particle.scale);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [particles, dummy]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      particles.forEach((particle, i) => {
        // Slowly orbit around the Sun (which is at z=-50)
        particle.angle += particle.speed * delta * 0.01;

        const x = Math.cos(particle.angle) * particle.radius;
        const z = Math.sin(particle.angle) * particle.radius;

        dummy.position.set(x, particle.position.y, z);

        // Rotate individual icy rock
        dummy.rotation.x += delta * 0.1;
        dummy.rotation.y += delta * 0.15;

        dummy.scale.set(particle.scale, particle.scale, particle.scale);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, -50]}>
      {/* Sun is at [0,0,-50], so we center the belt's orbit there */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[1, 1]} />
        {/* Icy blue-grey material for Kuiper Belt objects */}
        <meshStandardMaterial color="#88aacc" roughness={0.7} metalness={0.2} />
      </instancedMesh>
    </group>
  );
}
