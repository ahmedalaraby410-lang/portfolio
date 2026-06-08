"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function MouseGlow() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const rawX = useMotionValue(-500);
  const rawY = useMotionValue(-500);
  const x = useSpring(rawX, { stiffness: 85, damping: 28, mass: 0.8 });
  const y = useSpring(rawY, { stiffness: 85, damping: 28, mass: 0.8 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const isFine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(isFine);
    if (!isFine) return;

    const move = (event: PointerEvent) => {
      rawX.set(event.clientX - 320);
      rawY.set(event.clientY - 320);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [prefersReducedMotion, rawX, rawY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[-1] h-[640px] w-[640px] rounded-full opacity-50 blur-3xl"
      style={{
        x,
        y,
        background:
          "radial-gradient(circle, rgba(205,245,106,0.14), rgba(134,231,255,0.08) 38%, rgba(255,118,95,0.045) 52%, transparent 70%)"
      }}
    />
  );
}
