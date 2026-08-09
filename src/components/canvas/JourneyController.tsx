import { useFrame, useThree } from "@react-three/fiber";
import { useScroll, OrbitControls } from "@react-three/drei";
import { useJourneyStore } from "@/store/journeyStore";
import * as THREE from "three";
import { useMemo, useEffect } from "react";

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
    description:
      "The Red Planet is a cold, desert world covered in iron oxide dust. It features the tallest volcano in the Solar System, Olympus Mons, and a canyon system, Valles Marineris, that dwarfs the Grand Canyon. Ancient river valleys suggest that billions of years ago, Mars was a wet and potentially habitable world.",
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
    description:
      "The farthest known planet from the Sun, Neptune is a dark, cold, and incredibly windy ice giant. Supersonic winds whip through its atmosphere, pushing giant dark storms across its deep blue visage. Its largest moon, Triton, orbits backward and is geologically active, spewing geysers of nitrogen ice.",
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

export function JourneyController() {
  const scroll = useScroll();
  const { camera } = useThree();
  const setActivePlanet = useJourneyStore((state) => state.setActivePlanet);
  const isXRayMode = useJourneyStore((state) => state.isXRayMode);
  const activePlanetId = useJourneyStore((state) => state.activePlanetId);
  const setScrollTo = useJourneyStore((state) => state.setScrollTo);

  useEffect(() => {
    // Register the smooth scrolling function to the global store
    setScrollTo((offset: number) => {
      // scroll.el is the DOM element created by ScrollControls
      scroll.el.scrollTo({
        top: offset * scroll.el.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [scroll, setScrollTo]);

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

  const prevCamPos = useRef(new THREE.Vector3());

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
    const lookAheadTarget = Math.min(t + 0.01, 1); // Clamp to 1 so we never drift off the end
    
    const lookAtPoint = curve.getPointAt(lookAheadTarget);

    const currentQuat = camera.quaternion.clone();
    camera.lookAt(lookAtPoint);
    const targetQuat = camera.quaternion.clone();

    camera.quaternion.copy(currentQuat).slerp(targetQuat, 0.1);

    // Adjust camera far clipping plane dynamically to render massive galaxies without clipping
    const currentFar = (camera as THREE.PerspectiveCamera).far;
    if (camera.position.z < -2000) {
      if (currentFar !== 15000) {
        (camera as THREE.PerspectiveCamera).far = 15000;
        camera.updateProjectionMatrix();
      }
    } else {
      if (currentFar !== 5000) {
        (camera as THREE.PerspectiveCamera).far = 5000;
        camera.updateProjectionMatrix();
      }
    }

    // Calculate camera speed to prevent HUD flicker during rapid jumps
    const speed = delta > 0 ? camera.position.distanceTo(prevCamPos.current) / delta : 0;
    prevCamPos.current.copy(camera.position);

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

    const isFlyingFast = speed > 1000;

    if (minDistance < depthScale && !isFlyingFast) {
      if (activePlanetId !== closest.id) {
        setActivePlanet(closest.id);
      }
    } else {
      if (activePlanetId !== null) {
        setActivePlanet(null);
      }
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
