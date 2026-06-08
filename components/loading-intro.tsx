"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingIntro() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const seen = sessionStorage.getItem("ahmed-portfolio-intro");
    if (seen) return;

    setVisible(true);
    sessionStorage.setItem("ahmed-portfolio-intro", "seen");
    const timer = window.setTimeout(() => setVisible(false), 1550);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center overflow-hidden bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-6%" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-lime/60 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="relative text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.56, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 text-xs uppercase tracking-[0.55em] text-paper/42">Entering the system</p>
            <h2 className="text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">Ahmed Alaraby</h2>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
