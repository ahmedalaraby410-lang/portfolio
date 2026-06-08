"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
import type { Project } from "@/lib/types";

const thoughtConcepts: Array<{
  id: string;
  label: string;
  x: number;
  y: number;
  size: "small" | "medium" | "large";
  products: string[];
  focus: string[];
}> = [
  { id: "trust", label: "Trust", x: 16, y: 21, size: "large", products: ["Debtbox", "King Khalid Foundation"], focus: ["Financial confidence", "Transparency", "User reassurance"] },
  { id: "growth", label: "Growth", x: 44, y: 13, size: "medium", products: ["Kashkom", "Sphinx Store"], focus: ["Acquisition loops", "Value realization", "Sustainable expansion"] },
  { id: "retention", label: "Retention", x: 73, y: 20, size: "medium", products: ["Kashkom", "Debtbox"], focus: ["Habit formation", "Recurring value", "Meaningful engagement"] },
  { id: "adoption", label: "Adoption", x: 89, y: 40, size: "small", products: ["Debtbox", "Sphinx Store"], focus: ["Onboarding clarity", "Behavior change", "Time to value"] },
  { id: "revenue", label: "Revenue", x: 69, y: 48, size: "large", products: ["Debtbox", "Sphinx Store"], focus: ["Commercial value", "Conversion paths", "Business viability"] },
  { id: "scale", label: "Scale", x: 85, y: 72, size: "large", products: ["Sphinx Store", "Property Platforms"], focus: ["Design systems", "Component architecture", "Long-term maintainability"] },
  { id: "operations", label: "Operations", x: 57, y: 80, size: "medium", products: ["Sphinx Store", "Debtbox"], focus: ["Internal workflows", "Role clarity", "Operational efficiency"] },
  { id: "research", label: "Research", x: 24, y: 75, size: "large", products: ["Debtbox", "Kashkom"], focus: ["User interviews", "Behavior analysis", "Discovery"] },
  { id: "accessibility", label: "Accessibility", x: 10, y: 49, size: "small", products: ["King Khalid Foundation", "Government Platforms"], focus: ["Inclusive access", "Content clarity", "Usable interfaces"] },
  { id: "experience", label: "Experience", x: 34, y: 43, size: "medium", products: ["Debtbox", "Kashkom"], focus: ["Comprehension", "Interaction quality", "Emotional confidence"] },
  { id: "systems", label: "Systems", x: 48, y: 61, size: "large", products: ["Sphinx Store", "Enterprise Platforms"], focus: ["Reusable logic", "Connected journeys", "Consistent behavior"] },
  { id: "strategy", label: "Strategy", x: 56, y: 29, size: "large", products: ["Debtbox", "King Khalid Foundation", "Sphinx Store"], focus: ["Product goals", "Prioritization", "Business alignment"] }
];

const thoughtLinks: Array<[string, string]> = [
  ["trust", "experience"],
  ["trust", "accessibility"],
  ["trust", "adoption"],
  ["growth", "retention"],
  ["growth", "revenue"],
  ["growth", "adoption"],
  ["retention", "experience"],
  ["research", "strategy"],
  ["research", "experience"],
  ["research", "accessibility"],
  ["strategy", "growth"],
  ["strategy", "revenue"],
  ["strategy", "systems"],
  ["scale", "systems"],
  ["scale", "operations"],
  ["systems", "operations"],
  ["systems", "experience"],
  ["adoption", "experience"]
];

const career = [
  ["2019", "Started learning design", "Curiosity became a craft."],
  ["2020", "First freelance projects", "Real briefs, real users, real responsibility."],
  ["2021", "Professional design work", "Moved from isolated screens to complete journeys."],
  ["2022", "Saudi market experience", "Designed for regional behavior, trust, and operations."],
  ["2023", "Product design specialization", "Research, systems, and product thinking converged."],
  ["2024", "Senior UI/UX Designer", "Led complex interfaces with stronger business context."],
  ["2025", "Large-scale products", "Designed platforms spanning roles, channels, and teams."],
  ["2026", "International product design", "Work expanded across the Middle East, Europe, and the US."]
];

export function DesignPhilosophySection({ projects }: { projects: Project[] }) {
  const reducedMotion = useReducedMotion();
  const [activeConceptId, setActiveConceptId] = useState("trust");
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 65, damping: 25, mass: 0.9 });
  const smoothY = useSpring(pointerY, { stiffness: 65, damping: 25, mass: 0.9 });
  const sceneX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const sceneY = useTransform(smoothY, [-0.5, 0.5], [-7, 7]);
  const activeConcept = thoughtConcepts.find((concept) => concept.id === activeConceptId) || thoughtConcepts[0];
  const connectedIds = new Set(
    thoughtLinks.flatMap(([from, to]) => {
      if (from === activeConceptId) return [to];
      if (to === activeConceptId) return [from];
      return [];
    })
  );

  const updateParallax = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  return (
    <section id="philosophy" className="relative overflow-hidden border-y border-white/10 bg-[#030304] py-24 sm:py-36">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 30 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 text-xs uppercase tracking-[0.32em] text-[#B18D43]">04 · How I Think</p>
            <h2 className="max-w-2xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl">
              Most designers think about screens.
              <span className="mt-3 block text-[#D4B66F]">I think about outcomes.</span>
            </h2>
          </motion.div>
          <p className="max-w-xl text-lg leading-8 text-paper/56 lg:justify-self-end">
            Products succeed when user needs, business goals, trust, scalability, and execution work together. My job is not to design screens. My job is to create outcomes.
          </p>
        </div>

        <div
          className="thought-space mt-16 overflow-hidden rounded-[28px] border border-white/10"
          onPointerMove={updateParallax}
          onPointerLeave={() => {
            pointerX.set(0);
            pointerY.set(0);
          }}
        >
          <div className="grid min-h-[700px] lg:grid-cols-[minmax(0,1fr)_340px]">
            <motion.div
              className="relative min-h-[600px] overflow-hidden sm:min-h-[680px] lg:min-h-[700px]"
              style={reducedMotion ? undefined : { x: sceneX, y: sceneY }}
            >
              <svg
                viewBox="0 0 1000 700"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  <filter id="thought-glow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {thoughtLinks.map(([fromId, toId], index) => {
                  const from = thoughtConcepts.find((concept) => concept.id === fromId)!;
                  const to = thoughtConcepts.find((concept) => concept.id === toId)!;
                  const active = fromId === activeConceptId || toId === activeConceptId;

                  return (
                    <motion.line
                      key={`${fromId}-${toId}`}
                      x1={from.x * 10}
                      y1={from.y * 7}
                      x2={to.x * 10}
                      y2={to.y * 7}
                      stroke={active ? "rgba(177,141,67,0.7)" : "rgba(255,255,255,0.1)"}
                      strokeWidth={active ? 1.5 : 1}
                      filter={active ? "url(#thought-glow)" : undefined}
                      initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
                      whileInView={reducedMotion ? undefined : { pathLength: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{
                        pathLength: { duration: 0.8, delay: 0.35 + index * 0.04 },
                        opacity: { duration: 0.45, delay: 0.35 + index * 0.04 },
                        stroke: { duration: 0.35 }
                      }}
                    />
                  );
                })}
              </svg>

              {thoughtConcepts.map((concept, index) => {
                const active = concept.id === activeConceptId;
                const connected = connectedIds.has(concept.id);
                return (
                  <div
                    key={concept.id}
                    className="absolute z-[2]"
                    style={{
                      left: `${concept.x}%`,
                      top: `${concept.y}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                  >
                    <motion.button
                      type="button"
                      className={`thought-keyword thought-keyword-${concept.size} ${active ? "is-active" : ""} ${connected ? "is-connected" : ""}`}
                      initial={reducedMotion ? false : { opacity: 0, scale: 0.88 }}
                      whileInView={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{
                        opacity: { duration: 0.65, delay: 0.3 + index * 0.08 },
                        scale: { duration: 0.65, delay: 0.3 + index * 0.08 },
                        y: { duration: 0.65 }
                      }}
                      onMouseEnter={() => setActiveConceptId(concept.id)}
                      onFocus={() => setActiveConceptId(concept.id)}
                      onClick={() => setActiveConceptId(concept.id)}
                      aria-pressed={active}
                    >
                      <span className="thought-keyword-dot" />
                      {concept.label}
                    </motion.button>
                  </div>
                );
              })}

              <p className="absolute bottom-6 left-8 text-[9px] uppercase tracking-[0.28em] text-paper/22">
                Product judgment is relational
              </p>
            </motion.div>

            <div className="thought-context relative flex items-center border-t border-white/10 p-7 sm:p-10 lg:border-t-0">
              <motion.div
                key={activeConcept.id}
                initial={reducedMotion ? false : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
                aria-live="polite"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4B66F]">Decision lens</p>
                <h3 className="mt-5 text-5xl font-semibold tracking-[-0.055em]">{activeConcept.label}</h3>

                <div className="mt-9">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-paper/28">Products</p>
                  <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
                    {activeConcept.products.map((productName) => {
                      const project = projects.find((item) =>
                        item.title.toLowerCase().replace(/\s/g, "").includes(productName.toLowerCase().replace(/\s/g, "")) ||
                        productName.toLowerCase().replace(/\s/g, "").includes(item.title.toLowerCase().replace(/\s/g, ""))
                      );
                      return project ? (
                        <Link key={productName} href={`/projects/${project.slug}`} className="text-sm text-paper/72 transition hover:text-[#D4B66F]">
                          {productName} ↗
                        </Link>
                      ) : (
                        <span key={productName} className="text-sm text-paper/52">{productName}</span>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-9 border-t border-white/10 pt-7">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-paper/28">Focus</p>
                  <ul className="mt-5 grid gap-4">
                    {activeConcept.focus.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-paper/64">
                        <span className="h-px w-5 bg-[#B18D43]/55" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CareerJourneySection() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "end 55%"]
  });
  const journeyProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    mass: 0.8
  });

  return (
    <section ref={sectionRef} id="journey" className="relative overflow-hidden py-32 sm:py-44">
      <div className="career-ambient pointer-events-none absolute left-[42%] top-[48%] size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />

      <div className="container-x relative mb-20 grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end sm:mb-28">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.32em] text-[#B18D43]">05 · The Journey</p>
          <h2 className="max-w-2xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl">
            Built year by year.
          </h2>
        </div>
        <p className="max-w-xl text-lg leading-8 text-paper/56 lg:justify-self-end">
          Each stage added a new layer: visual craft, user understanding, market context, product judgment, and the ability to design systems that hold up under scale.
        </p>
      </div>

      <div className="career-scroll relative overflow-x-auto pb-10">
        <div className="container-x min-w-max">
          <div className="relative flex gap-14 px-8 pb-8 pt-4 sm:gap-20">
            <div className="absolute left-16 right-[310px] top-8 h-px bg-white/10 sm:right-[360px]" />
            <motion.div
              className="absolute left-16 right-[310px] top-8 h-px origin-left bg-gradient-to-r from-[#745D31] via-[#D4B66F] to-[#745D31] sm:right-[360px]"
              style={reducedMotion ? { scaleX: 1 } : { scaleX: journeyProgress }}
            />

            {career.map(([year, title, detail], index) => (
              <motion.article
                key={year}
                initial={reducedMotion ? false : { opacity: 0, y: 32 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{
                  duration: 0.75,
                  delay: Math.min(index * 0.08, 0.42),
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="career-chapter relative w-[310px] shrink-0 pt-28 sm:w-[360px]"
              >
                <motion.div
                  className="career-year absolute left-0 top-0 grid size-16 place-items-center rounded-full border border-[#B18D43]/52 bg-[#070708] text-xs font-semibold text-[#D4B66F]"
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.72 }}
                  whileInView={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{
                    duration: 0.55,
                    delay: 0.12 + Math.min(index * 0.1, 0.5),
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <span>{year}</span>
                  <span className="career-year-particle absolute -right-4 top-1 size-1 rounded-full bg-[#D4B66F]/60" />
                  <span className="career-year-particle absolute -left-2 bottom-1 size-0.5 rounded-full bg-paper/40 [animation-delay:900ms]" />
                </motion.div>

                <div className="max-w-[34ch]">
                  <p className="text-[10px] uppercase tracking-[0.27em] text-paper/28">
                    Chapter {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-5 text-3xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[2.15rem]">
                    {title}
                  </h3>
                  <p className="mt-5 text-base leading-7 text-paper/48">{detail}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x mt-3 flex items-center gap-4">
        <span className="h-px w-10 bg-[#B18D43]/40" />
        <p className="text-[9px] uppercase tracking-[0.28em] text-paper/24">
          Curious beginner to international product designer
        </p>
      </div>
    </section>
  );
}
