"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { SocialItem } from "@/data/socials";
import { withBasePath } from "@/lib/base-path";

export function SocialPresenceCard({ socials }: { socials: SocialItem[] }) {
  const reducedMotion = useReducedMotion();
  const visibleSocials = socials
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <motion.aside
      className="social-presence-card relative overflow-hidden rounded-[22px] border border-white/12 bg-black/55 p-5 backdrop-blur-md"
      initial={reducedMotion ? false : { opacity: 0, x: 18, y: 14 }}
      animate={reducedMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
      transition={{
        opacity: { duration: 0.75, delay: 1.05 },
        x: { duration: 0.75, delay: 1.05, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 0.7, delay: 0.8, ease: [0.22, 1, 0.36, 1] }
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4B66F]">Connect</p>
        <span className="size-1.5 rounded-full bg-[#B18D43] shadow-[0_0_14px_rgba(177,141,67,0.65)]" />
      </div>

      <nav aria-label="Ahmed Alaraby social links" className="grid">
        {visibleSocials.map((social) => {
          const external = social.url.startsWith("http");
          return (
            <a
              key={social.id}
              href={withBasePath(social.url)}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="social-presence-link group flex min-h-10 items-center justify-between gap-4 border-t border-white/[0.07] text-sm text-paper/68"
              data-cursor={social.label}
            >
              <span className="transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-hover:text-paper">
                {social.label}
              </span>
              <ArrowUpRight
                size={14}
                className="translate-x-[-4px] text-paper/20 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:text-[#D4B66F] group-hover:opacity-100"
              />
            </a>
          );
        })}
      </nav>

      <p className="mt-5 border-t border-white/[0.07] pt-4 text-[11px] leading-5 text-paper/36">
        Open to UI/UX design opportunities worldwide.
      </p>
    </motion.aside>
  );
}
