"use client";

import { useEffect, useRef } from "react";
import { useJourneyStore } from "@/store/journeyStore";

export default function ThanosParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isSnapping = useJourneyStore((state) => state.isSnapping);

  useEffect(() => {
    if (!isSnapping || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas to full screen overlay
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles: any[] = [];
    // Glassmorphic / Space colors matching the UI (white, indigo, grays)
    const colors = ["#ffffff", "#818cf8", "#c7d2fe", "#4f46e5", "#94a3b8", "#1e1b4b"];

    // Generate 2500 particles clustered in the center (where the modal is)
    for (let i = 0; i < 2500; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * Math.min(800, canvas.width - 40), // Spread across modal width
        y: canvas.height / 2 + (Math.random() - 0.5) * Math.min(600, canvas.height - 40), // Spread across modal height
        size: Math.random() * 3 + 1, // Dust spec size (1px to 4px)
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: Math.random() * 3 + 1, // Wind blowing forcefully to the right
        vy: (Math.random() - 1) * 4 - 1, // Drifting upwards
        alpha: Math.random() * 0.8 + 0.2, // Initial opacity
        decay: Math.random() * 0.01 + 0.005, // Speed of fading to dust
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let aliveParticles = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Move particle
        p.x += p.vx;
        p.y += p.vy;
        
        // Add slight gravity/wind turbulence
        p.vy -= 0.02; // Accelerate upwards
        p.vx += 0.01; // Accelerate rightwards
        
        // Fade out
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          aliveParticles++;
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          // Render as a tiny glowing dust speck
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (aliveParticles > 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isSnapping]);

  if (!isSnapping) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[200] pointer-events-none"
    />
  );
}
