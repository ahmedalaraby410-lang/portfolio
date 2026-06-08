"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function MouseGlow() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const rawX = useMotionValue(-500);
  const rawY = useMotionValue(-500);
  const x = useSpring(rawX, { stiffness: 150, damping: 32, mass: 0.55 });
  const y = useSpring(rawY, { stiffness: 150, damping: 32, mass: 0.55 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const isFine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(isFine);
    if (!isFine) return;

    let frame = 0;
    let nextX = -500;
    let nextY = -500;

    const update = () => {
      rawX.set(nextX);
      rawY.set(nextY);
      frame = 0;
    };

    const move = (event: PointerEvent) => {
      nextX = event.clientX - 210;
      nextY = event.clientY - 210;
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion, rawX, rawY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[-1] h-[420px] w-[420px] rounded-full opacity-40"
      style={{
        x,
        y,
        background:
          "radial-gradient(circle, rgba(205,245,106,0.1), rgba(134,231,255,0.055) 36%, rgba(255,118,95,0.025) 52%, transparent 72%)"
      }}
    />
  );
}
