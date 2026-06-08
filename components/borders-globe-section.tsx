"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { withBasePath } from "@/lib/base-path";

type Marker = {
  name: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  anchor?: "start" | "end";
};

const markers: Marker[] = [
  { name: "USA", x: 350, y: 236, dx: -18, dy: -22, anchor: "end" },
  { name: "SPAIN", x: 706, y: 228, dx: -14, dy: 28, anchor: "end" },
  { name: "ENGLAND", x: 714, y: 176, dx: 14, dy: -19 },
  { name: "TUNISIA", x: 756, y: 256, dx: -22, dy: 30, anchor: "end" },
  { name: "EGYPT", x: 836, y: 287, dx: -24, dy: 36, anchor: "end" },
  { name: "IRAQ", x: 886, y: 259, dx: 22, dy: -32 },
  { name: "KUWAIT", x: 899, y: 276, dx: 26, dy: -12 },
  { name: "SAUDI ARABIA", x: 890, y: 299, dx: -22, dy: 51, anchor: "end" },
  { name: "UNITED ARAB EMIRATES", x: 925, y: 296, dx: 25, dy: 38 }
];

const routes = [
  ["USA", "ENGLAND"],
  ["ENGLAND", "SPAIN"],
  ["SPAIN", "TUNISIA"],
  ["TUNISIA", "EGYPT"],
  ["EGYPT", "SAUDI ARABIA"],
  ["SAUDI ARABIA", "UNITED ARAB EMIRATES"],
  ["SAUDI ARABIA", "KUWAIT"],
  ["KUWAIT", "IRAQ"],
  ["EGYPT", "IRAQ"]
] as const;

const markerMap = new Map(markers.map((marker) => [marker.name, marker]));

function routePath(fromName: string, toName: string) {
  const from = markerMap.get(fromName);
  const to = markerMap.get(toName);
  if (!from || !to) return "";
  const midX = (from.x + to.x) / 2;
  const lift = Math.min(-22, -Math.abs(to.x - from.x) * 0.09);
  const midY = Math.min(from.y, to.y) + lift;
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}

export function BordersGlobeSection() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-14% 0px -14% 0px" });

  return (
    <section
      ref={sectionRef}
      id="borders"
      className="relative left-1/2 w-screen -translate-x-1/2 scroll-mt-24 overflow-hidden border-y border-white/10 bg-[#020203] py-14 sm:py-20"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1680px] px-4 sm:px-8">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20, filter: "blur(10px)" }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 text-[10px] uppercase tracking-[0.32em] text-[#B18D43] sm:text-xs">02 · Why I&apos;m Different</p>
          <h2 className="text-3xl font-medium leading-tight tracking-[-0.035em] text-paper sm:text-5xl">
            Global Design Footprint
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-paper/48 sm:text-base">
            Products designed across the Middle East, Europe, and North America.
          </p>
        </motion.div>

        <div className="relative mx-auto mt-3 aspect-[2.05/1] w-full sm:mt-1">
          <svg viewBox="0 0 1440 700" className="h-full w-full overflow-visible" aria-label="World map showing Ahmed Alaraby's international design footprint">
            <defs>
              <filter id="soft-gold" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <clipPath id="map-reveal">
                <motion.rect
                  x="0"
                  y="0"
                  height="700"
                  initial={prefersReducedMotion ? { width: 1440 } : { width: 0 }}
                  animate={inView ? { width: 1440 } : { width: 0 }}
                  transition={{ duration: 1.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                />
              </clipPath>
            </defs>

            <motion.image
              href={withBasePath("/world-network-map.svg")}
              width="1440"
              height="700"
              clipPath="url(#map-reveal)"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />

            <g fill="none">
              {routes.map(([from, to], index) => (
                <path
                  key={`${from}-${to}`}
                  d={routePath(from, to)}
                  className={inView || prefersReducedMotion ? "network-route is-visible" : "network-route"}
                  stroke="rgba(255,255,255,0.32)"
                  strokeWidth="0.85"
                  pathLength="1"
                  style={{ transitionDelay: `${0.55 + index * 0.1}s` }}
                />
              ))}
            </g>

            <g>
              {markers.map((marker, index) => (
                <g
                  key={marker.name}
                  className={inView || prefersReducedMotion ? "network-marker is-visible" : "network-marker"}
                  style={{ transitionDelay: `${1.05 + index * 0.1}s` }}
                >
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r="11"
                    className="network-marker-pulse"
                    fill="rgba(177,141,67,0.13)"
                    style={{ animationDelay: `${index * 0.16}s` }}
                  />
                  <circle cx={marker.x} cy={marker.y} r="4.2" fill="#B18D43" filter="url(#soft-gold)" />
                  <circle cx={marker.x} cy={marker.y} r="1.5" fill="#F7E8C1" />
                  <path
                    d={`M ${marker.x} ${marker.y} L ${marker.x + marker.dx * 0.65} ${marker.y + marker.dy * 0.65}`}
                    stroke="rgba(177,141,67,0.62)"
                    strokeWidth="0.7"
                  />
                  <text
                    x={marker.x + marker.dx}
                    y={marker.y + marker.dy}
                    className={inView || prefersReducedMotion ? "network-label is-visible" : "network-label"}
                    fill="rgba(246,242,234,0.84)"
                    fontSize="10"
                    fontWeight="500"
                    letterSpacing="0.18em"
                    textAnchor={marker.anchor ?? "start"}
                    style={{ transitionDelay: `${1.28 + index * 0.1}s` }}
                  >
                    {marker.name}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
