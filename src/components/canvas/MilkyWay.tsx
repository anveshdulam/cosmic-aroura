import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function createMilkyWayParticleSystem(particleCount = 250000) {
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  // Astrophysical constants
  const pitchAngleRad = 13 * (Math.PI / 180);
  const k = Math.tan(pitchAngleRad); // Spiral growth factor (k ≈ 0.2308)
  const h_Z = 0.35; // Vertical disk scale height
  const numArms = 4;
  const armOffset = (2 * Math.PI) / numArms;

  // Region color profiles
  const colorCore = new THREE.Color(0xffb347); // Warm Amber (3,500 K - Pop II)
  const colorArm = new THREE.Color(0x2299ff); // Electric Blue (20,000 K - Pop I)
  const colorHII = new THREE.Color(0xff2288); // Ionized H II Pink (656.3 nm)
  const colorDisk = new THREE.Color(0xd0d8ff); // Neutral White (Inter-arm)

  for (let i = 0; i < particleCount; i++) {
    let x, y, z;
    const color = new THREE.Color();
    const pType = Math.random();

    if (pType < 0.18) {
      // --- 1. Triaxial Ellipsoidal Central Bar (18% of particles) ---
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2 * Math.PI;
      const phi = Math.acos(2 * v - 1);

      // Sérsic n=4 profile approximation for central density concentration
      const r = Math.pow(Math.random(), 2.2) * 2.2;

      // Orient bar at 27 degrees relative to major axis
      const barAngle = 27 * (Math.PI / 180);
      const bx = r * Math.sin(phi) * Math.cos(theta) * 1.7; // Elongated x-axis
      const by = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      const bz = r * Math.cos(phi) * 0.4;

      x = bx * Math.cos(barAngle) - by * Math.sin(barAngle);
      y = bx * Math.sin(barAngle) + by * Math.cos(barAngle);
      z = bz;

      color.copy(colorCore).lerp(colorDisk, r / 2.2);
    } else {
      // --- 2. 4-Arm Logarithmic Disk (82% of particles) ---
      const armIndex = Math.floor(Math.random() * numArms);
      const thetaBase = Math.random() * 3.2 * Math.PI;
      const r0 = 0.65;

      // Logarithmic Spiral: r = r0 * e^(k * theta)
      const distFromCenter = r0 * Math.exp(k * thetaBase);

      // Gaussian scatter off arm spine (wider dispersion at greater radii)
      const scatterAngle =
        (Math.random() - 0.5) * (0.25 + distFromCenter * 0.12);
      const theta = thetaBase + armIndex * armOffset + scatterAngle;

      x = distFromCenter * Math.cos(theta);
      y = distFromCenter * Math.sin(theta);

      // Inverse transform sampling for hyperbolic sech^2(z / h_Z) height profile
      const uZ = Math.min(Math.max(Math.random(), 0.0001), 0.9999);
      z = (h_Z / 2.0) * Math.log(uZ / (1.0 - uZ));

      // Color assignment based on arm proximity & H II nebular probability
      const armCoreProximity = Math.exp(-Math.pow(scatterAngle, 2) / 0.02);

      if (Math.random() < 0.03 && armCoreProximity > 0.6) {
        // Active H II Star-Forming Region
        color.copy(colorHII);
      } else if (armCoreProximity > 0.4) {
        // High-density O/B arm ridge
        color.copy(colorArm).lerp(colorDisk, 1.0 - armCoreProximity);
      } else {
        // Low-density inter-arm stellar field
        color.copy(colorDisk);
      }
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.15, // Increased size for fuller appearance
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  return new THREE.Points(geometry, material);
}

export function MilkyWay({
  position = [0, 0, -5000],
}: {
  position?: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);

  const milkyWaySystem = useMemo(() => {
    // Generate the particle system (massive density increase)
    const points = createMilkyWayParticleSystem(400000);
    // The procedural math produces points in the ~[-10, 10] range, so we scale it up massively
    points.scale.set(400, 400, 400);
    // Rotate to match our typical X-Z plane view
    points.rotation.x = Math.PI / 2.5;
    return points;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <group position={new THREE.Vector3(...position)} ref={groupRef}>
      <primitive object={milkyWaySystem} />

      {/* Supermassive Black Hole (Sagittarius A*) */}
      <group>
        {/* Event Horizon */}
        <mesh>
          <sphereGeometry args={[20, 64, 64]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Accretion Disk */}
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[25, 45, 64]} />
          <meshBasicMaterial
            color="#ff8822"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Accretion Disk Glow */}
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[22, 60, 64]} />
          <meshBasicMaterial
            color="#ff4400"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Intense Core Glow matching the 3500K Pop II stars */}
      <pointLight color="#ffb347" intensity={4} distance={2000} decay={2} />
      <mesh>
        <sphereGeometry args={[150, 32, 32]} />
        <meshBasicMaterial
          color="#ffb347"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[300, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa33"
          transparent
          opacity={0.02}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
