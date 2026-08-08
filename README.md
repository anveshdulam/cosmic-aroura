# 🌌 Aurora Atlas

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-white)

**Aurora Atlas** is an immersive, high-performance 3D interactive journey from the center of our solar system to the edge of the observable universe. Built as a submission for a 3D Interactive Website Hackathon, it combines procedural astrophysics, volumetric WebGL shaders, and cinematic user experiences.

---

## ✨ Features

- 🔭 **Cinematic Scroll-Driven Journey:** Travel seamlessly from the Sun to the Laniakea Supercluster via a smooth Catmull-Rom spline camera path, driven entirely by user scrolling.
- 🪐 **Procedural Astrophysics:**
  - **Milky Way Galaxy:** Rendered using realistic Sérsic profiles and 4-arm logarithmic spiral equations.
  - **Sagittarius A*:** Features a dynamic Accretion Disk, Event Horizon, and gravitational lensing effects.
  - **Instanced Moons:** Rendering 285 dynamic moons (e.g., Saturn's 146 moons) in a single draw call via `InstancedMesh` with Kepler-like orbital physics.
- 🎇 **Volumetric Custom Shaders:** Raw GLSL and HTML5 Canvas shaders generate accurate atmospheric Fresnel glows, stellar coronas, and the cosmic web's dark matter filaments.
- 🔬 **Educational X-Ray Mode:** Interactively slice planets with clipping planes to reveal their Silicate Mantles and Iron Cores.
- ⚡ **High Performance:** Heavily optimized React Three Fiber engine designed to maintain 60+ FPS even when rendering thousands of instanced celestial bodies.

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router)
- **3D Engine:** Three.js, React Three Fiber, React Three Drei
- **Post-Processing:** React Three Postprocessing (Bloom, GodRays, Vignette)
- **Styling:** Tailwind CSS & Framer Motion
- **State Management:** Zustand
- **UI Components:** shadcn/ui

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/anveshdulam/cosmic-aroura.git
   ```
2. Navigate into the project directory:
   ```bash
   cd cosmic-aroura
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the cosmos.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/anveshdulam/cosmic-aroura/issues).

## 📄 License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
