import { useEffect, useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CameraPath() {
  const { camera } = useThree();
  const scrollObj = useRef({ progress: 0 });

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 2, 8),
        new THREE.Vector3(-10, 4, -8),
        new THREE.Vector3(5, 6, -18),
        new THREE.Vector3(15, 8, -28),
      ]),
    [],
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(scrollObj.current, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  useFrame(() => {
    const p = scrollObj.current.progress;

    // Sample the curve at the current scroll progress
    const point = curve.getPoint(p);

    // Sample slightly ahead for the camera to look at
    const lookAtPoint = curve.getPoint(Math.min(p + 0.05, 1));

    camera.position.lerp(point, 0.1);

    const currentLookAt = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(camera.quaternion)
      .add(camera.position);
    currentLookAt.lerp(lookAtPoint, 0.1);
    camera.lookAt(currentLookAt);
  });

  return null;
}
