import { useState } from "react";

export type DeviceTier = {
  tier: "mobile" | "desktop";
  dpr: [number, number];
  shadows: boolean;
  postprocessing: boolean;
};

export function useDeviceTier(): DeviceTier {
  const [deviceTier] = useState<DeviceTier>(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return {
        tier: "desktop",
        dpr: [1, 2],
        shadows: true,
        postprocessing: true,
      };
    }

    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = window.innerWidth < 768;
    const isLowEnd = cores <= 4 || isMobile;

    return isLowEnd
      ? {
          tier: "mobile",
          dpr: [1, 1.5],
          shadows: false,
          postprocessing: false,
        }
      : {
          tier: "desktop",
          dpr: [1, 2],
          shadows: true,
          postprocessing: true,
        };
  });

  return deviceTier;
}
