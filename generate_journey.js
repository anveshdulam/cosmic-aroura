const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src/components/canvas/JourneyController.tsx');
let content = fs.readFileSync(srcPath, 'utf8');

// 1. We will extract the existing planetData array string using regex.
const planetDataMatch = content.match(/export const planetData = \[([\s\S]*?)\];/);
if (!planetDataMatch) {
  console.error("Could not find planetData array");
  process.exit(1);
}

// 2. We don't want to parse it as JSON because it's JS code. Let's just require it.
// Actually, it's easier to manually construct the new file since I have the descriptions.
// Let's just generate the new file entirely in this script.

const newPlanetData = `export const getDynamicPosition = (planet: any, time: number = 0) => {
  if (planet.orbitRadius && planet.orbitSpeed) {
    const angle = planet.orbitAngle + time * planet.orbitSpeed;
    const x = Math.cos(angle) * planet.orbitRadius;
    const z = Math.sin(angle) * planet.orbitRadius - 50; // -50 is Sun Z
    return new THREE.Vector3(x, planet.position[1], z);
  }
  return new THREE.Vector3(...(planet.position as [number, number, number]));
};

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
    description:
      "The Sun is a G-type main-sequence star (G2V) that accounts for 99.86% of the mass in the Solar System. Deep in its core, hydrogen undergoes nuclear fusion, releasing immense amounts of energy that travels outward as light and heat. Its dynamic magnetic field drives solar flares and coronal mass ejections that shape the entire heliosphere.",
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
    orbitRadius: 100,
    orbitSpeed: 0.1,
    orbitAngle: Math.random() * Math.PI * 2,
    description:
      "Mercury is the smallest and innermost planet in the Solar System. Without a substantial atmosphere to retain heat, it experiences the greatest temperature variations of all the planets, ranging from -173 °C at night to 427 °C during the day. Its heavily cratered surface resembles Earth's Moon, indicating a long history of dormancy.",
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
    orbitRadius: 200,
    orbitSpeed: 0.08,
    orbitAngle: Math.random() * Math.PI * 2,
    description:
      "Often called Earth's twin due to its similar size, Venus is a hellish world choked by a thick, toxic atmosphere of carbon dioxide and sulfuric acid clouds. This immense greenhouse effect makes it the hottest planet in the Solar System. It spins slowly in retrograde, meaning the Sun rises in the west and sets in the east.",
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
    orbitRadius: 300,
    orbitSpeed: 0.06,
    orbitAngle: Math.random() * Math.PI * 2,
    description:
      "Our home world is the only known planet to harbor life. It sits safely in the Goldilocks zone, where liquid water flows freely on the surface. Protected by a strong magnetic field and a nitrogen-oxygen atmosphere, Earth's dynamic tectonic plates and active biosphere continually reshape its vibrant surface.",
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
    orbitRadius: 400,
    orbitSpeed: 0.04,
    orbitAngle: Math.random() * Math.PI * 2,
    description:
      "The Red Planet is a cold, desert world covered in iron oxide dust. It features the tallest volcano in the Solar System, Olympus Mons, and a canyon system, Valles Marineris, that dwarfs the Grand Canyon. Ancient river valleys suggest that billions of years ago, Mars was a wet and potentially habitable world.",
  },
  {
    id: "ceres",
    position: [0, 0, -525],
    title: "Ceres",
    color: "#999999",
    size: 0.5,
    distance: "2.77 AU",
    speed: "17.9 km/s",
    mass: "9.39 × 10^20 kg",
    gravity: "0.28 m/s²",
    temp: "-105 °C",
    atm: "Water Vapor",
    moonCount: 0,
    orbitRadius: 475,
    orbitSpeed: 0.035,
    orbitAngle: Math.random() * Math.PI * 2,
    description: "Ceres is the largest object in the asteroid belt and the only dwarf planet in the inner Solar System. It is composed of rock and ice, with mysterious bright spots of salt deposits on its surface.",
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
    orbitRadius: 550,
    orbitSpeed: 0.03,
    orbitAngle: Math.random() * Math.PI * 2,
    description:
      "Jupiter is a gas giant with a mass more than two and a half times that of all the other planets combined. Its iconic swirling cloud bands are driven by fierce winds and massive storms, the most famous being the Great Red Spot. Deep within its core, immense pressure creates a bizarre ocean of liquid metallic hydrogen.",
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
    orbitRadius: 750,
    orbitSpeed: 0.02,
    orbitAngle: Math.random() * Math.PI * 2,
    description:
      "Known as the Jewel of the Solar System, Saturn is famous for its stunning, complex ring system made primarily of ice particles and rocky debris. Like Jupiter, it is a massive gas giant without a solid surface. Its moon Titan is the only moon in the Solar System with a thick atmosphere and liquid methane lakes.",
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
    orbitRadius: 950,
    orbitSpeed: 0.015,
    orbitAngle: Math.random() * Math.PI * 2,
    description:
      "Uranus is an ice giant that orbits the Sun completely on its side, a strange tilt likely caused by a colossal collision in the ancient past. The methane in its upper atmosphere absorbs red light, giving the planet its serene, pale blue color. It experiences extreme seasons, with its poles plunged into darkness for 42 years at a time.",
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
    orbitRadius: 1150,
    orbitSpeed: 0.01,
    orbitAngle: Math.random() * Math.PI * 2,
    description:
      "The farthest known planet from the Sun, Neptune is a dark, cold, and incredibly windy ice giant. Supersonic winds whip through its atmosphere, pushing giant dark storms across its deep blue visage. Its largest moon, Triton, orbits backward and is geologically active, spewing geysers of nitrogen ice.",
  },
  {
    id: "pluto",
    position: [0, 0, -1300],
    title: "Pluto",
    color: "#ddccaa",
    size: 0.8,
    distance: "39.48 AU",
    speed: "4.74 km/s",
    mass: "1.309 × 10^22 kg",
    gravity: "0.62 m/s²",
    temp: "-225 °C",
    atm: "Nitrogen, Methane",
    moonCount: 5,
    orbitRadius: 1250,
    orbitSpeed: 0.008,
    orbitAngle: Math.random() * Math.PI * 2,
    description: "Once considered the ninth planet, Pluto is a fascinating dwarf planet in the Kuiper belt with a heart-shaped glacier and a complex system of moons, including the large moon Charon.",
  },
  {
    id: "haumea",
    position: [0, 0, -1350],
    title: "Haumea",
    color: "#eeeeee",
    size: 0.6,
    distance: "43.13 AU",
    speed: "4.48 km/s",
    mass: "4.0 × 10^21 kg",
    gravity: "0.4 m/s²",
    temp: "-241 °C",
    atm: "None",
    moonCount: 2,
    orbitRadius: 1300,
    orbitSpeed: 0.007,
    orbitAngle: Math.random() * Math.PI * 2,
    description: "Haumea is an elongated, fast-spinning dwarf planet located beyond Neptune's orbit. Its rapid rotation has stretched it into an egg-like shape.",
  },
  {
    id: "makemake",
    position: [0, 0, -1400],
    title: "Makemake",
    color: "#ccaaaa",
    size: 0.7,
    distance: "45.79 AU",
    speed: "4.42 km/s",
    mass: "3.1 × 10^21 kg",
    gravity: "0.5 m/s²",
    temp: "-243 °C",
    atm: "Trace Methane",
    moonCount: 1,
    orbitRadius: 1350,
    orbitSpeed: 0.006,
    orbitAngle: Math.random() * Math.PI * 2,
    description: "Makemake is perhaps the second largest Kuiper belt object in the classical population, covered in frozen methane and tholins that give it a reddish-brown hue.",
  },
  {
    id: "eris",
    position: [0, 0, -1450],
    title: "Eris",
    color: "#dddddd",
    size: 0.8,
    distance: "68.01 AU",
    speed: "3.44 km/s",
    mass: "1.66 × 10^22 kg",
    gravity: "0.82 m/s²",
    temp: "-243 °C",
    atm: "Trace Methane",
    moonCount: 1,
    orbitRadius: 1400,
    orbitSpeed: 0.005,
    orbitAngle: Math.random() * Math.PI * 2,
    description: "Eris is one of the most massive and second-largest known dwarf planet in the Solar System. Its discovery sparked the debate that led to the reclassification of Pluto.",
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
    description:
      "The Kuiper Belt is a vast, icy ring of remnants from the formation of the Solar System. It stretches beyond the orbit of Neptune and is home to thousands of dwarf planets, including Pluto, Haumea, and Makemake. These ancient, frozen relics hold key secrets to the primordial origins of our planetary neighborhood.",
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
    description:
      "Located nearly 40 light-years away, TRAPPIST-1 is an ultra-cool red dwarf star surrounded by seven Earth-sized rocky planets. Three of these planets orbit firmly within the habitable zone, making it one of the most promising and heavily studied extrasolar systems in the search for liquid water and alien life.",
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
    description:
      "Our cosmic home is a vast, barred spiral galaxy stretching over 100,000 light-years across. It contains anywhere from 100 to 400 billion stars, spiraling intricately around a supermassive black hole known as Sagittarius A*. From the inside, it appears as a glowing band of ancient starlight arching across the night sky.",
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
    description:
      "The Crab Nebula is the sprawling, glowing wreckage of a massive star that exploded in a brilliant supernova witnessed by Earth astronomers in the year 1054. At its very center lies a rapidly spinning neutron star—a pulsar—that violently emits beams of radiation 30 times a second as it whips up the surrounding gas clouds.",
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
    description:
      "Andromeda is a spectacular spiral galaxy and the nearest major galactic neighbor to the Milky Way. Containing approximately one trillion stars, it is on a slow, multi-billion-year collision course with our galaxy. Over immense cosmic timescales, the two will eventually merge to form an enormous, elliptical super-galaxy.",
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
    description:
      "The Local Group is the galactic neighborhood that contains the Milky Way, Andromeda, the Triangulum Galaxy, and over 50 smaller dwarf galaxies. Bound together by immense gravitational forces, this localized cluster stretches over 10 million light-years in diameter, acting as a small node in the vast cosmic web.",
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
    description:
      "Laniakea (Hawaiian for 'immense heaven') is the gargantuan galaxy supercluster that is home to our Milky Way. It spans an incomprehensible 500 million light-years and contains over 100,000 galaxies. Here, matter is drawn along glowing filaments of dark matter toward a mysterious gravitational anomaly known as the Great Attractor.",
  },
];
`;

const completeFile = `import { useFrame, useThree } from "@react-three/fiber";
import { useScroll, OrbitControls } from "@react-three/drei";
import { useJourneyStore } from "@/store/journeyStore";
import * as THREE from "three";
import { useEffect, useRef } from "react";

${newPlanetData}

export function JourneyController() {
  const scroll = useScroll();
  const { camera } = useThree();
  const setActivePlanet = useJourneyStore((state) => state.setActivePlanet);
  const isFocusMode = useJourneyStore((state) => state.isFocusMode);
  const activePlanetId = useJourneyStore((state) => state.activePlanetId);
  const setScrollTo = useJourneyStore((state) => state.setScrollTo);

  useEffect(() => {
    // Register the smooth scrolling function to the global store
    setScrollTo((offset: number) => {
      // scroll.el is the DOM element created by ScrollControls
      // max scrollable distance is scrollHeight - clientHeight
      const maxScroll = scroll.el.scrollHeight - scroll.el.clientHeight;
      scroll.el.scrollTo({
        top: offset * maxScroll,
        behavior: "smooth",
      });
    });
  }, [scroll, setScrollTo]);

  const targetCamPos = useRef(new THREE.Vector3());
  const targetCamLook = useRef(new THREE.Vector3());
  
  useFrame((state, delta) => {
    if (isFocusMode) {
      return;
    }

    const t = scroll.offset;
    const totalSegments = planetData.length - 1;
    
    // Map scroll.offset to a continuous index
    let segmentFloat = t * totalSegments;
    // Clamp to valid range
    segmentFloat = Math.max(0, Math.min(totalSegments, segmentFloat));
    
    const index = Math.floor(segmentFloat);
    const fraction = segmentFloat - index;
    const nextIndex = Math.min(index + 1, totalSegments);
    
    // Get real-time dynamic positions for the current and next target
    const currentPlanet = planetData[index];
    const nextPlanet = planetData[nextIndex];
    
    const p0 = getDynamicPosition(currentPlanet, state.clock.elapsedTime);
    const p2 = getDynamicPosition(nextPlanet, state.clock.elapsedTime);
    
    // Calculate dynamic camera waypoints (offset from planet)
    // For smaller planets, we get closer. For galaxies, we stay far away.
    const getCamOffset = (planet: any) => {
      if (planet.id === "sun") return new THREE.Vector3(12, 5, 10);
      if (planet.size === 0) return new THREE.Vector3(0, 50, 100); // Deep space
      return new THREE.Vector3(planet.size * 3 + 5, planet.size + 2, planet.size * 5 + 10);
    };
    
    const wp0 = p0.clone().add(getCamOffset(currentPlanet));
    const wp2 = p2.clone().add(getCamOffset(nextPlanet));
    
    // Create a dynamic Bezier control point that bows outward from the Sun
    // This prevents the camera from flying straight through the Sun!
    const mid = wp0.clone().lerp(wp2, 0.5);
    const dist = wp0.distanceTo(wp2);
    
    // The sun is at (0, 0, -50)
    const sunPos = new THREE.Vector3(0, 0, -50);
    const pushDir = mid.clone().sub(sunPos).normalize();
    // Push the control point out by 30% of the distance between planets
    const p1 = mid.clone().add(pushDir.multiplyScalar(dist * 0.3));
    
    // Quadratic Bezier evaluation
    const smoothF = THREE.MathUtils.smoothstep(fraction, 0, 1);
    const currentPos = new THREE.Vector3();
    const invF = 1 - smoothF;
    currentPos.x = invF * invF * wp0.x + 2 * invF * smoothF * p1.x + smoothF * smoothF * wp2.x;
    currentPos.y = invF * invF * wp0.y + 2 * invF * smoothF * p1.y + smoothF * smoothF * wp2.y;
    currentPos.z = invF * invF * wp0.z + 2 * invF * smoothF * p1.z + smoothF * smoothF * wp2.z;
    
    // Look at interpolation
    const lookAtPos = new THREE.Vector3().lerpVectors(p0, p2, smoothF);
    
    // Apply camera position
    camera.position.lerp(currentPos, 0.1);
    targetCamLook.current.lerp(lookAtPos, 0.1);
    camera.lookAt(targetCamLook.current);

    // Dynamic HUD activation logic
    // Determine the closest planet for the HUD
    let closestId = currentPlanet.id;
    if (fraction > 0.5) {
      closestId = nextPlanet.id;
    }
    
    // Only activate if we are very close to the node (fraction near 0 or 1)
    const isCloseToNode = fraction < 0.1 || fraction > 0.9;
    
    if (isCloseToNode && closestId !== activePlanetId) {
      setActivePlanet(closestId);
    } else if (!isCloseToNode && activePlanetId !== null) {
      setActivePlanet(null);
    }
  });

  const activePlanet = planetData.find((p) => p.id === activePlanetId);
  const orbitTarget = activePlanet
    ? getDynamicPosition(activePlanet, useThree().clock.elapsedTime)
    : new THREE.Vector3(0, 0, 0);

  return (
    <>{isFocusMode && <OrbitControls enableDamping target={orbitTarget} />}</>
  );
}
`;

fs.writeFileSync(srcPath, completeFile, 'utf8');
console.log("Successfully rebuilt JourneyController.tsx");
