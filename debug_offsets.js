const THREE = require('three');

const planetData = [
  { id: "sun", position: [0, 0, -50] },
  { id: "mercury", position: [15, 0, -150] },
  { id: "venus", position: [-20, 0, -250] },
  { id: "earth", position: [25, 0, -350] },
  { id: "mars", position: [-15, 0, -450] },
  { id: "jupiter", position: [40, 0, -600] },
  { id: "saturn", position: [-35, 0, -800] },
  { id: "uranus", position: [20, 0, -1000] },
  { id: "neptune", position: [-25, 0, -1200] },
  { id: "kuiper", position: [0, 0, -1500] },
  { id: "trappist", position: [40, 0, -2500] },
  { id: "milkyway", position: [0, 0, -5000] },
  { id: "nebula", position: [0, 0, -6000] },
  { id: "andromeda", position: [-80, 0, -7500] },
  { id: "localgroup", position: [120, 0, -9000] },
  { id: "laniakea", position: [0, 0, -11000] },
];

const journeyCurve = new THREE.CatmullRomCurve3(
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
  0.5
);

const planetScrollOffsets = planetData.map((planet) => {
  let bestT = 0;
  let minDistance = Infinity;
  const pPos = new THREE.Vector3(...planet.position);
  
  for (let i = 0; i <= 2000; i++) {
    const t = i / 2000;
    const point = journeyCurve.getPointAt(t);
    const dist = point.distanceTo(pPos);
    if (dist < minDistance) {
      minDistance = dist;
      bestT = t;
    }
  }
  
  console.log(planet.id, "minDist:", minDistance.toFixed(2), "bestT:", bestT.toFixed(4));
  return Math.max(0, bestT - 0.005);
});

console.log("Offsets Array:");
console.log(planetScrollOffsets);
