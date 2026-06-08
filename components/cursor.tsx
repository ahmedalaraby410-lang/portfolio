"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function Cursor() {
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, { stiffness: 900, damping: 58, mass: 0.35 });
  const y = useSpring(rawY, { stiffness: 900, damping: 58, mass: 0.35 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    setEnabled(finePointer);
    if (!finePointer) return;

    const move = (event: PointerEvent) => {
      rawX.set(event.clientX - 12);
      rawY.set(event.clientY - 12);
    };

    const over = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      const interactive = target.closest<HTMLElement>("a, button, input, textarea, select, .cursor-target");
      setActive(Boolean(interactive));
      setLabel(interactive?.dataset.cursor || "");
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [rawX, rawY]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden size-6 items-center justify-center rounded-full border border-paper/55 bg-ink/35 text-[0.48rem] font-semibold uppercase tracking-[0.18em] text-paper md:flex"
      style={{ x, y }}
      animate={{ scale: active ? (label ? 3.2 : 2.35) : 1, opacity: active ? 0.92 : 0.82 }}
      transition={{ type: "spring", stiffness: 520, damping: 36 }}
    >
      {label ? <span>{label}</span> : null}
    </motion.div>
  );
}
