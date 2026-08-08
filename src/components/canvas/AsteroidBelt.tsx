import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function AsteroidBelt() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 5000;

  // Generate random asteroid positions and rotations
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Radius between 430 and 520 (between Mars and Jupiter)
      const radius = 430 + Math.random() * 90;
      // Random angle
      const theta = Math.random() * Math.PI * 2;
      // Slight vertical variation
      const y = (Math.random() - 0.5) * 40;

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      temp.push({
        position: new THREE.Vector3(x, y, z),
        rotation: new THREE.Vector3(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ),
        scale: 0.2 + Math.random() * 1.5,
        speed: 0.05 + Math.random() * 0.1,
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
        particle.angle += particle.speed * delta * 0.05;

        const x = Math.cos(particle.angle) * particle.radius;
        const z = Math.sin(particle.angle) * particle.radius;

        dummy.position.set(x, particle.position.y, z);

        // Rotate individual rock
        dummy.rotation.x += delta * 0.2;
        dummy.rotation.y += delta * 0.3;

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
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#665544" roughness={0.9} metalness={0.1} />
      </instancedMesh>
    </group>
  );
}
