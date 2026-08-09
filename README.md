# 🌌 Cosmic Atlas

An immersive, interactive 3D web experience mapping our Solar System and beyond. Built with cutting-edge web technologies, Cosmic Atlas allows users to seamlessly scroll from the burning surface of the Sun to the cosmic web of the Laniakea Supercluster, all directly within the browser.

## ✨ Features

- **Seamless Universal Scroll:** A cinematic, rollercoaster-like camera curve that journeys from the Sun, past the planets, out into interstellar space, and towards the edge of the observable universe.
- **Photorealistic PBR Rendering:** Planets feature high-fidelity physically based rendering (PBR), atmospheric scattering, and procedural bump mapping.
- **Dynamic X-Ray Mode:** Select any terrestrial planet and enter X-Ray mode to dynamically slice the planet open and reveal its internal crust, mantle, and core layers with perfectly scaled 3D infographic labels.
- **Orbit Paths:** Visualize the orbital paths of every planet around the sun, and every moon around its respective planet.
- **Procedural Shaders:** The Sun utilizes a custom GLSL shader simulating turbulent plasma, sunspots, and dynamic coronal flares.
- **Glassmorphic HUD:** A dynamic, beautiful user interface displaying real telemetry data, mass, gravity, and atmospheric composition for celestial bodies.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 18)
- **3D Engine:** [Three.js](https://threejs.org/)
- **React Wrapper:** [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) & [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Post-Processing:** God rays, bloom, vignette, and cinematic noise.

## 🚀 Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/cosmic-atlas.git
   cd cosmic-atlas
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Explore the Universe:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 Controls

- **Scroll:** Journey through the cosmos.
- **Click Planet List:** Instantly warp to a specific planet.
- **Drag:** Orbit around the actively selected planet.
- **X-Ray Mode:** (Top navigation) Engage to view the internal geology of terrestrial planets.
- **Orbit Mode:** Toggle to view the physical orbital paths of the solar system.

## 📜 License
MIT License. Created for the 3D Web Hackathon.
