"use client";

import { motion, useReducedMotion } from "framer-motion";

type LineRevealProps = {
  lines: string[];
  as?: "h1" | "h2" | "p";
  className?: string;
  delay?: number;
};

export function LineReveal({ lines, as = "h2", className = "", delay = 0 }: LineRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag className={className}>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className="block"
            initial={prefersReducedMotion ? false : { y: "105%", opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { y: "0%", opacity: 1 }}
            transition={{ duration: 0.68, delay: delay + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
