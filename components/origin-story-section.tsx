"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  Boxes,
  BriefcaseBusiness,
  ImageIcon,
  PenTool,
  ScanSearch,
  Shapes,
  Sparkles
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform
} from "framer-motion";
import { withBasePath } from "@/lib/base-path";

const stages = [
  {
    title: "Calligraphy",
    period: "Age 10",
    description: "Discovered the beauty of letters, form, spacing, and composition.",
    insight: "The first lesson was restraint: every mark changes the balance of the whole.",
    icon: PenTool
  },
  {
    title: "Photoshop",
    period: "2019",
    description: "Learned visual communication through digital design.",
    insight: "A new medium made experimentation immediate and curiosity impossible to ignore.",
    icon: ImageIcon
  },
  {
    title: "Illustrator",
    period: "2019",
    description: "Learned precision, vectors, scalability, and systems.",
    insight: "Craft became repeatable. Shapes became rules, and rules became visual systems.",
    icon: Shapes
  },
  {
    title: "UI Design",
    period: "2020",
    description: "Started designing interfaces people interact with.",
    insight: "Composition moved beyond the page and became something people could use.",
    icon: Sparkles
  },
  {
    title: "UX Design",
    period: "2021",
    description: "Learned user behavior, psychology, and problem solving.",
    insight: "The strongest design decisions began before pixels, with evidence and empathy.",
    icon: ScanSearch
  },
  {
    title: "Product Design",
    period: "2022",
    description: "Began solving business and user problems together.",
    insight: "Design became a way to align people, systems, constraints, and measurable value.",
    icon: Boxes
  },
  {
    title: "Senior UI/UX Designer",
    period: "2024–2026",
    description: "Leading complex digital experiences across multiple industries and countries.",
    insight: "Today, the work is about giving complexity a clear structure that can scale.",
    icon: BriefcaseBusiness
  }
];

export function OriginStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 78%", "end 68%"]
  });
  const imageY = useTransform(scrollYProgress, [0, 0.45], reducedMotion ? [0, 0] : [28, -24]);
  const lineScale = useTransform(scrollYProgress, [0.18, 0.88], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="origin-story"
      aria-labelledby="origin-story-title"
      className="origin-story relative overflow-hidden border-y border-white/[0.08] bg-[#030303] py-24 sm:py-36"
    >
      <div className="origin-story-halo pointer-events-none absolute left-[18%] top-[12%] size-[34rem] rounded-full" />

      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:items-stretch lg:gap-20">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 32 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-6 text-[10px] uppercase tracking-[0.36em] text-[#B18D43]">08 · The Origin Story</p>
            <h2
              id="origin-story-title"
              className="max-w-[10ch] text-[clamp(4rem,9vw,9.5rem)] font-semibold uppercase leading-[0.82] tracking-[-0.065em]"
            >
              It started with letters.
            </h2>
            <div className="mt-10 max-w-2xl space-y-5 text-base leading-8 text-paper/58 sm:text-lg">
              <p>
                Long before product design, I spent my childhood practicing Arabic and English calligraphy. At ten years old, I became fascinated by form, balance, spacing, and visual rhythm.
              </p>
              <p>
                Years later, after recovering from leukemia in 2019, that same curiosity became an obsession with learning Photoshop, Illustrator, interface design, and eventually product design.
              </p>
              <p>
                What began as learning how to shape letters became learning how to shape products, systems, and experiences used by thousands of people.
              </p>
            </div>
          </motion.div>

          <motion.figure
            className="origin-story-image relative h-full min-h-[560px] overflow-hidden rounded-[6px] border border-white/10 bg-[#0a0908] sm:min-h-[720px]"
            initial={reducedMotion ? false : { opacity: 0, clipPath: "inset(12% 0 12% 0)" }}
            whileInView={reducedMotion ? undefined : { opacity: 1, clipPath: "inset(0% 0 0% 0)" }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 1.15, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div className="absolute inset-[-7%] will-change-transform" style={{ y: imageY }}>
              <Image
                src={withBasePath("/images/calligraphy-origin.png")}
                alt="Traditional Arabic calligraphy tools illuminated by warm gold light"
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
            <figcaption className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-5 border-t border-white/15 pt-4 text-[9px] uppercase tracking-[0.28em] text-paper/42">
              <span>Form · Balance · Rhythm</span>
              <span className="text-[#D4B66F]">Age 10</span>
            </figcaption>
          </motion.figure>
        </div>

        <div className="mt-28 sm:mt-44">
          <div className="mb-14 max-w-2xl sm:mb-20">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#B18D43]">One curiosity, many forms</p>
            <h3 className="mt-5 text-4xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-6xl">
              The medium evolved.<br />
              The instinct stayed.
            </h3>
          </div>

          <div className="relative">
            <div className="absolute bottom-0 left-6 top-0 w-px bg-white/10 md:left-1/2" />
            <motion.div
              aria-hidden
              className="absolute bottom-0 left-6 top-0 w-px origin-top bg-gradient-to-b from-[#765D2D] via-[#D4B66F] to-[#765D2D] shadow-[0_0_22px_rgba(177,141,67,0.26)] md:left-1/2"
              style={reducedMotion ? { scaleY: 1 } : { scaleY: lineScale }}
            />

            <div className="grid gap-12 sm:gap-16">
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                const active = activeStage === index;
                const alignsRight = index % 2 === 1;

                return (
                  <motion.article
                    key={stage.title}
                    className="origin-stage cursor-target relative ml-16 md:ml-0 md:grid md:grid-cols-2"
                    initial={reducedMotion ? false : { opacity: 0, y: 38 }}
                    whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.75, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
                    onPointerEnter={() => setActiveStage(index)}
                    onPointerLeave={() => setActiveStage(null)}
                    onFocus={() => setActiveStage(index)}
                    onBlur={() => setActiveStage(null)}
                    onClick={() => setActiveStage(active ? null : index)}
                    tabIndex={0}
                    aria-expanded={active}
                    data-cursor="Discover"
                  >
                    <span
                      className={`origin-stage-node absolute -left-[2.55rem] top-9 z-10 grid size-12 place-items-center rounded-full border bg-[#080706] text-[#D4B66F] transition duration-500 md:left-1/2 md:-translate-x-1/2 ${
                        active ? "border-[#D4B66F]/80 shadow-[0_0_32px_rgba(177,141,67,0.25)]" : "border-[#B18D43]/38"
                      }`}
                    >
                      <Icon size={18} strokeWidth={1.45} />
                    </span>

                    <div
                      className={`origin-stage-card group relative max-w-xl overflow-hidden rounded-[8px] border p-6 transition duration-500 sm:p-8 ${
                        alignsRight
                          ? "md:col-start-2 md:ml-14"
                          : "md:mr-14 md:justify-self-end"
                      } ${
                        active
                          ? "border-[#B18D43]/45 bg-[#B18D43]/[0.055] shadow-[0_28px_80px_rgba(0,0,0,0.38),0_0_42px_rgba(177,141,67,0.07)]"
                          : "border-white/10 bg-white/[0.025]"
                      }`}
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B18D43]/55 to-transparent opacity-0 transition duration-500 group-hover:opacity-100 group-focus-within:opacity-100" />
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-[#B18D43]">
                            {String(index + 1).padStart(2, "0")} · {stage.period}
                          </p>
                          <h4 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{stage.title}</h4>
                        </div>
                        <span className="text-5xl font-light leading-none text-paper/[0.055]">{String(index + 1).padStart(2, "0")}</span>
                      </div>
                      <p className="mt-6 max-w-[36ch] leading-7 text-paper/58">{stage.description}</p>
                      <motion.div
                        className="overflow-hidden"
                        initial={false}
                        animate={{ height: active ? "auto" : 0, opacity: active ? 1 : 0 }}
                        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="mt-6 border-t border-white/10 pt-5 text-sm leading-6 text-[#D8C99F]/72">
                          {stage.insight}
                        </p>
                      </motion.div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>

        <motion.blockquote
          className="relative mx-auto mt-28 max-w-5xl border-y border-[#B18D43]/22 py-16 text-center sm:mt-44 sm:py-24"
          initial={reducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="absolute left-1/2 top-0 h-px w-28 -translate-x-1/2 bg-[#D4B66F]" />
          <p className="text-4xl font-medium leading-[1.08] tracking-[-0.045em] text-paper/90 sm:text-6xl">
            “The tools changed.<br />
            The medium evolved.<br />
            <span className="text-[#D4B66F]">But the purpose stayed the same:</span><br />
            create impact through design.”
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
