import { useFrame, useThree } from "@react-three/fiber";
import { useScroll, OrbitControls } from "@react-three/drei";
import { useJourneyStore } from "@/store/journeyStore";
import * as THREE from "three";
import { useMemo } from "react";

export const planetData = [
  {
    id: "sun",
    position: [0, 0, -50],
    title: "The Sun",
    color: "#ffcc00",
    size: 12,
    distance: "0.00 AU",
    speed: "Stationary",
    mass: "1.989 × 10^30 kg",
    gravity: "274 m/s²",
    temp: "5,500 °C",
    atm: "Hydrogen, Helium",
    moonCount: 0,
  },
  {
    id: "mercury",
    position: [15, -5, -150],
    title: "Mercury",
    color: "#a8a8a8",
    size: 1,
    distance: "0.39 AU",
    speed: "47.87 km/s",
    mass: "3.301 × 10^23 kg",
    gravity: "3.7 m/s²",
    temp: "167 °C",
    atm: "Trace",
    moonCount: 0,
  },
  {
    id: "venus",
    position: [-20, 10, -250],
    title: "Venus",
    color: "#e6a87c",
    size: 2,
    distance: "0.72 AU",
    speed: "35.02 km/s",
    mass: "4.867 × 10^24 kg",
    gravity: "8.87 m/s²",
    temp: "464 °C",
    atm: "Carbon Dioxide",
    moonCount: 0,
  },
  {
    id: "earth",
    position: [25, 0, -350],
    title: "Earth",
    color: "#2b82c9",
    size: 2.1,
    distance: "1.00 AU",
    speed: "29.78 km/s",
    mass: "5.972 × 10^24 kg",
    gravity: "9.8 m/s²",
    temp: "15 °C",
    atm: "Nitrogen, Oxygen",
    moonCount: 1,
  },
  {
    id: "mars",
    position: [-15, -10, -450],
    title: "Mars",
    color: "#c1440e",
    size: 1.5,
    distance: "1.52 AU",
    speed: "24.07 km/s",
    mass: "6.39 × 10^23 kg",
    gravity: "3.71 m/s²",
    temp: "-65 °C",
    atm: "Carbon Dioxide",
    moonCount: 2,
  },
  {
    id: "jupiter",
    position: [40, 15, -600],
    title: "Jupiter",
    color: "#d39c7e",
    size: 6,
    distance: "5.20 AU",
    speed: "13.07 km/s",
    mass: "1.898 × 10^27 kg",
    gravity: "24.79 m/s²",
    temp: "-110 °C",
    atm: "Hydrogen, Helium",
    moonCount: 95,
  },
  {
    id: "saturn",
    position: [-35, -5, -800],
    title: "Saturn",
    color: "#ead6b8",
    size: 5,
    distance: "9.58 AU",
    speed: "9.68 km/s",
    mass: "5.683 × 10^26 kg",
    gravity: "10.44 m/s²",
    temp: "-140 °C",
    atm: "Hydrogen, Helium",
    moonCount: 146,
  },
  {
    id: "uranus",
    position: [20, 20, -1000],
    title: "Uranus",
    color: "#4b70dd",
    size: 3,
    distance: "19.20 AU",
    speed: "6.80 km/s",
    mass: "8.681 × 10^25 kg",
    gravity: "8.69 m/s²",
    temp: "-195 °C",
    atm: "Hydrogen, Helium, Methane",
    moonCount: 27,
  },
  {
    id: "neptune",
    position: [-25, -15, -1200],
    title: "Neptune",
    color: "#274687",
    size: 3,
    distance: "30.05 AU",
    speed: "5.43 km/s",
    mass: "1.024 × 10^26 kg",
    gravity: "11.15 m/s²",
    temp: "-200 °C",
    atm: "Hydrogen, Methane",
    moonCount: 14,
  },
  {
    id: "kuiperbelt",
    position: [0, 0, -1500],
    title: "Kuiper Belt",
    color: "#888888",
    size: 0,
    distance: "50.00 AU",
    speed: "4.00 km/s",
    mass: "Unknown",
    gravity: "Microgravity",
    temp: "-220 °C",
    atm: "Vacuum",
    moonCount: 0,
  },
  {
    id: "trappist",
    position: [50, 20, -2500],
    title: "TRAPPIST-1 System",
    color: "#ff4422",
    size: 4,
    distance: "39.46 Ly",
    speed: "Unknown",
    mass: "0.089 M☉",
    gravity: "Varied",
    temp: "-20 °C",
    atm: "Unknown",
    moonCount: 0,
  },
  {
    id: "milkyway",
    position: [0, -50, -5000],
    title: "Milky Way Galaxy",
    color: "#ffffff",
    size: 0,
    distance: "26,000 Ly",
    speed: "210 km/s",
    mass: "1.5 × 10^12 M☉",
    gravity: "Galactic",
    temp: "2.7 K",
    atm: "Interstellar Gas",
    moonCount: 0,
  },
  {
    id: "nebula",
    position: [100, 50, -6000],
    title: "Crab Nebula",
    color: "#00ffff",
    size: 0,
    distance: "6,500 Ly",
    speed: "Expansion",
    mass: "5 M☉",
    gravity: "Micro",
    temp: "10,000 K",
    atm: "Ionized Gas",
    moonCount: 0,
  },
  {
    id: "andromeda",
    position: [-150, 100, -7500],
    title: "Andromeda Galaxy",
    color: "#6688ff",
    size: 0,
    distance: "2.537 M Ly",
    speed: "110 km/s",
    mass: "1.5 × 10^12 M☉",
    gravity: "Galactic",
    temp: "2.7 K",
    atm: "Interstellar Gas",
    moonCount: 0,
  },
  {
    id: "localgroup",
    position: [200, -100, -9000],
    title: "Local Group Map",
    color: "#aaaaaa",
    size: 0,
    distance: "10.0 M Ly",
    speed: "Unknown",
    mass: "2 × 10^12 M☉",
    gravity: "Cluster",
    temp: "2.7 K",
    atm: "Intergalactic Medium",
    moonCount: 0,
  },
  {
    id: "cosmicweb",
    position: [0, 0, -11000],
    title: "Laniakea Supercluster",
    color: "#ff00ff",
    size: 0,
    distance: "250.0 M Ly",
    speed: "Hubble Flow",
    mass: "10^17 M☉",
    gravity: "Supercluster",
    temp: "2.7 K",
    atm: "Dark Matter Filaments",
    moonCount: 0,
  },
];

export function JourneyController() {
  const scroll = useScroll();
  const { camera } = useThree();
  const setActivePlanet = useJourneyStore((state) => state.setActivePlanet);
  const isXRayMode = useJourneyStore((state) => state.isXRayMode);
  const activePlanetId = useJourneyStore((state) => state.activePlanetId);

  // Cinematic 3D Spline Curve for Camera
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 2, 0), // Start
        new THREE.Vector3(12, 5, -40), // Swoop right over Sun
        new THREE.Vector3(22, -2, -140), // Pass Mercury on left
        new THREE.Vector3(-28, 12, -240), // Swing wide left past Venus
        new THREE.Vector3(32, 5, -340), // Bank right past Earth
        new THREE.Vector3(-22, -12, -440), // Dive left under Mars
        new THREE.Vector3(55, 20, -580), // Huge arc right around Jupiter
        new THREE.Vector3(-50, -10, -780), // Deep dive left past Saturn
        new THREE.Vector3(30, 25, -980), // High bank over Uranus
        new THREE.Vector3(-35, -20, -1180), // Low swoop past Neptune
        new THREE.Vector3(0, 0, -1450), // Through Kuiper Belt
        new THREE.Vector3(55, 25, -2400), // Swoop around TRAPPIST-1
        new THREE.Vector3(0, 0, -4000), // Warp to Milky Way scale
        new THREE.Vector3(0, 50, -4900), // Plunge into Galactic core
        new THREE.Vector3(80, 40, -5900), // Fly through Nebula
        new THREE.Vector3(-120, 80, -7300), // Fly past Andromeda
        new THREE.Vector3(180, -80, -8800), // Fly through Local Group
        new THREE.Vector3(0, 0, -10900), // Enter Cosmic Web (Laniakea)
        new THREE.Vector3(0, 0, -11200), // Infinity
      ],
      false,
      "catmullrom",
      0.5,
    );
  }, []);

  useFrame((state, delta) => {
    if (isXRayMode) {
      return;
    }

    // Get current position on curve (0 to 1 based on scroll)
    const t = scroll.offset;

    // Position camera on the curve
    const currentPoint = curve.getPointAt(t);
    camera.position.lerp(currentPoint, 0.1);

    // Look slightly ahead on the curve (rollercoaster effect)
    const lookAheadTarget = t + 0.01; // reduced look-ahead due to huge scale
    if (lookAheadTarget <= 1) {
      const lookAtPoint = curve.getPointAt(lookAheadTarget);

      const currentQuat = camera.quaternion.clone();
      camera.lookAt(lookAtPoint);
      const targetQuat = camera.quaternion.clone();

      camera.quaternion.copy(currentQuat).slerp(targetQuat, 0.1);
    }

    // Adjust camera far clipping plane dynamically to render massive galaxies without clipping
    if (camera.position.z < -2000) {
      (camera as THREE.PerspectiveCamera).far = 15000;
      camera.updateProjectionMatrix();
    } else {
      (camera as THREE.PerspectiveCamera).far = 5000;
      camera.updateProjectionMatrix();
    }

    // Collision / Proximity detection for active planet
    let closest = planetData[0];
    let minDistance = Infinity;

    // Scale distance threshold based on Z depth to account for huge gaps
    const depthScale =
      Math.abs(camera.position.z) > 1500
        ? (Math.abs(camera.position.z) / 1000) * 100
        : 60;

    planetData.forEach((planet) => {
      const pPos = new THREE.Vector3(...planet.position);
      const dist = camera.position.distanceTo(pPos);
      if (dist < minDistance) {
        minDistance = dist;
        closest = planet;
      }
    });

    if (minDistance < depthScale) {
      setActivePlanet(closest.id);
    } else {
      setActivePlanet(null);
    }
  });

  const activePlanet = planetData.find((p) => p.id === activePlanetId);
  const orbitTarget = activePlanet
    ? new THREE.Vector3(...activePlanet.position)
    : new THREE.Vector3(0, 0, 0);

  return (
    <>{isXRayMode && <OrbitControls enableDamping target={orbitTarget} />}</>
  );
}
