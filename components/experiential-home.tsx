"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Download, Linkedin, Mail, MessageCircle } from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform
} from "framer-motion";
import { MagneticButton } from "@/components/magnetic-button";
import { LineReveal } from "@/components/line-reveal";
import { Reveal } from "@/components/reveal";
import { BordersGlobeSection } from "@/components/borders-globe-section";
import { CertificatesSection } from "@/components/certificates-section";
import { ClientsSection } from "@/components/clients-section";
import { ProfileAvatar } from "@/components/profile-avatar";
import { SocialPresenceCard } from "@/components/social-presence-card";
import { OriginStorySection } from "@/components/origin-story-section";
import { CareerJourneySection, DesignPhilosophySection } from "@/components/storytelling-sections";
import type { Certificate } from "@/data/certificates";
import type { Client } from "@/data/clients";
import type { ProfileSettings } from "@/data/profile";
import type { SocialItem } from "@/data/socials";
import type { Project } from "@/lib/types";
import { withBasePath } from "@/lib/base-path";

export function ExperientialHome({
  projects,
  clients,
  profile,
  certificates,
  socials
}: {
  projects: Project[];
  clients: Client[];
  profile: ProfileSettings;
  certificates: Certificate[];
  socials: SocialItem[];
}) {
  return (
    <main>
      <CinematicHero profileImage={profile.image} socials={socials} />
      <BordersGlobeSection />
      <DesignPhilosophySection projects={projects} />
      <ClientsSection clients={clients} />
      <ImmersiveWork projects={projects} />
      <CareerJourneySection />
      <CertificatesSection certificates={certificates} />
      <OriginStorySection />
      <AboutScene profileImage={profile.image} />
      <ContactScene profileImage={profile.image} socials={socials} />
    </main>
  );
}

function CinematicHero({ profileImage, socials }: { profileImage: string; socials: SocialItem[] }) {
  const prefersReducedMotion = useReducedMotion();
  const resumeUrl = socials.find((item) => item.visible && item.label.toLowerCase().includes("resume"))?.url || "/resume/1780851703945-ahmedalarabyseniorproductdesignerresume.pdf";
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [3.5, -3.5]), { stiffness: 150, damping: 28 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-4.5, 4.5]), { stiffness: 150, damping: 28 });
  const networkX = useSpring(useTransform(mx, [0, 1], [-5, 5]), { stiffness: 110, damping: 28 });
  const networkY = useSpring(useTransform(my, [0, 1], [-3, 3]), { stiffness: 110, damping: 28 });

  const onMove = (event: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width);
    my.set((event.clientY - rect.top) / rect.height);
  };

  return (
    <section
      onPointerMove={onMove}
      className="scene-hero container-x relative grid min-h-screen place-items-end overflow-hidden pb-10 pt-32 sm:pb-14 lg:pb-16"
    >
      <HeroSystemBackground
        reducedMotion={Boolean(prefersReducedMotion)}
        x={networkX}
        y={networkY}
      />
      <div className="relative z-10 grid w-full gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
        <div>
          <motion.p
            className="mb-6 text-sm uppercase tracking-[0.34em] text-lime"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            Senior UI/UX Designer
          </motion.p>
          <motion.h1 className="max-w-[11ch] text-[clamp(5.2rem,15vw,16.5rem)] font-semibold leading-[0.76] tracking-[-0.075em] text-balance">
            {["Ahmed", "Alaraby"].map((line, index) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={prefersReducedMotion ? false : { y: "106%", opacity: 0 }}
                  animate={prefersReducedMotion ? undefined : { y: "0%", opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h1>
        </div>
        <motion.div
          className="glass relative overflow-hidden rounded-[30px] p-5 sm:p-7"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 36, scale: 0.97 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={prefersReducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
        >
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#B18D43]/70 to-transparent" />
          <div className="mb-7 grid gap-4 sm:grid-cols-[minmax(150px,0.72fr)_minmax(210px,1fr)] sm:items-stretch">
            <motion.div
              className="hero-profile-stack relative overflow-hidden rounded-[22px] border border-white/10 bg-black/40"
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="hero-identity-portrait relative h-full min-h-[21rem] overflow-hidden bg-white/[0.025]">
                {profileImage ? (
                  <Image
                    src={withBasePath(profileImage)}
                    alt="Ahmed Alaraby"
                    fill
                    unoptimized
                    sizes="240px"
                    className="object-cover transition duration-700 ease-out hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-4xl font-semibold tracking-[0.08em] text-[#D4B66F]">AA</div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/78 to-transparent px-4 pb-4 pt-20">
                  <p className="text-sm font-medium text-paper">Ahmed Alaraby</p>
                  <div className="mt-3 border-l border-[#B18D43]/55 pl-2.5">
                    <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#D4B66F]">Product Analytics &amp; AI</p>
                    <p className="mt-1 text-[8px] uppercase tracking-[0.15em] text-[#B18D43]/70">University of Virginia</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <SocialPresenceCard socials={socials} />
          </div>
          <p className="text-2xl leading-tight text-paper/84 sm:text-3xl">
            Designing digital products that make complexity feel quiet, valuable, and inevitable.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 text-xs uppercase tracking-[0.22em] text-paper/42">
            <span>Fintech</span>
            <span>Enterprise</span>
            <span>Systems</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton href="#featured-work">Enter Work</MagneticButton>
            <MagneticButton href="#contact" variant="secondary">Contact</MagneticButton>
            <a
              href={withBasePath(resumeUrl)}
              className="magnetic inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-paper transition duration-300 hover:border-lime/50 hover:text-lime"
              data-cursor="Resume"
            >
              <Download size={16} />
              Resume
            </a>
          </div>
        </motion.div>
      </div>
      <a
        href="#borders"
        className="scroll-cue absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 rounded-full border border-white/10 p-4 text-paper/55 transition hover:text-lime md:block"
        aria-label="Begin the story"
        data-cursor="Scroll"
      >
        <ArrowDown size={18} />
      </a>
    </section>
  );
}

function HeroSystemBackground({
  reducedMotion,
  x,
  y
}: {
  reducedMotion: boolean;
  x: ReturnType<typeof useSpring>;
  y: ReturnType<typeof useSpring>;
}) {
  const systemPaths = [
    "M 142 500 C 260 404, 378 412, 490 344 S 710 230, 870 282 S 1080 440, 1324 266",
    "M 198 214 C 338 286, 420 256, 548 184 S 764 118, 898 192 S 1116 312, 1360 174",
    "M 330 598 C 462 508, 588 530, 704 440 S 916 352, 1100 432 S 1250 506, 1392 420",
    "M 520 82 C 594 202, 706 264, 816 304 S 1034 330, 1196 520",
    "M 88 334 C 246 322, 350 352, 472 430 S 650 548, 804 546"
  ];

  const nodes = [
    [142, 500], [252, 423], [360, 418], [490, 344], [614, 268], [742, 246], [870, 282], [1018, 370],
    [1160, 394], [1324, 266], [198, 214], [330, 270], [448, 232], [548, 184], [680, 142], [808, 154],
    [898, 192], [1038, 270], [1180, 288], [1360, 174], [330, 598], [466, 516], [590, 520], [704, 440],
    [820, 382], [946, 374], [1100, 432], [1242, 486], [1392, 420], [520, 82], [580, 184], [706, 264],
    [816, 304], [940, 314], [1080, 362], [1196, 520], [88, 334], [224, 326], [350, 352], [472, 430],
    [584, 510], [690, 550], [804, 546]
  ];

  const goldNodes = [[490, 344], [870, 282], [1100, 432], [680, 142], [1196, 520]];

  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 1440 720"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={reducedMotion ? undefined : { x, y }}
    >
      <defs>
        <filter id="hero-node-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="hero-line-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="20%" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="72%" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hero-system-depth" cx="72%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#B18D43" stopOpacity="0.055" />
          <stop offset="46%" stopColor="#fff" stopOpacity="0.018" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <mask id="hero-map-mask">
          <linearGradient id="hero-map-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="black" />
            <stop offset="34%" stopColor="white" stopOpacity="0.28" />
            <stop offset="100%" stopColor="white" />
          </linearGradient>
          <rect width="1440" height="720" fill="url(#hero-map-fade)" />
        </mask>
      </defs>

      <rect width="1440" height="720" fill="url(#hero-system-depth)" />

      <motion.image
        href={withBasePath("/world-network-map.svg")}
        x="250"
        y="34"
        width="1260"
        height="612"
        opacity="0.2"
        mask="url(#hero-map-mask)"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2.2, delay: 0.25, ease: "easeOut" }}
      />

      <g fill="none" stroke="url(#hero-line-fade)" strokeWidth="0.8">
        {systemPaths.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            pathLength="1"
            initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 2.2, delay: 0.55 + index * 0.16, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.8, delay: 0.55 + index * 0.16 }
            }}
          />
        ))}
      </g>

      <g fill="#F6F2EA">
        {nodes.map(([cx, cy], index) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={index % 4 === 0 ? 1.8 : 1.15}
            initial={reducedMotion ? false : { opacity: 0, scale: 0 }}
            animate={{ opacity: index % 4 === 0 ? 0.34 : 0.2, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.85 + index * 0.025, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </g>

      <g>
        {goldNodes.map(([cx, cy], index) => (
          <g key={`${cx}-${cy}`}>
            <motion.circle
              cx={cx}
              cy={cy}
              r="14"
              fill="#B18D43"
              opacity="0.08"
              animate={reducedMotion ? undefined : { r: [10, 14, 11], opacity: [0.05, 0.1, 0.06] }}
              transition={{ duration: 2.8, delay: index * 0.18, repeat: 1, ease: "easeInOut" }}
            />
            <circle cx={cx} cy={cy} r="2.8" fill="#B18D43" opacity="0.72" filter="url(#hero-node-glow)" />
            <circle cx={cx} cy={cy} r="1.1" fill="#F7E8C1" opacity="0.92" />
          </g>
        ))}
      </g>
    </motion.svg>
  );
}

function ImmersiveWork({ projects }: { projects: Project[] }) {
  const featuredProjects = projects.filter((project) => project.featured !== false);

  return (
    <section id="featured-work" className="relative py-24 sm:py-36">
      <div className="container-x mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <p className="mb-4 text-xs uppercase tracking-[0.32em] text-[#B18D43]">05 · What I&apos;ve Built</p>
          <h2 className="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-7xl">
            Featured work with real pressure behind it.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-md leading-7 text-paper/58">
            Selected product work shaped by operational complexity, market behavior, trust, and the need to scale.
          </p>
        </Reveal>
      </div>
      <div className="container-x grid gap-7">
        {featuredProjects.map((project, index) => (
          <WorldProject key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

function WorldProject({ project, index }: { project: Project; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [2.5, -2.5]), { stiffness: 180, damping: 30 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-3, 3]), { stiffness: 180, damping: 30 });
  const imageX = useTransform(mx, [0, 1], [-10, 10]);
  const imageY = useTransform(my, [0, 1], [-8, 8]);
  const glowX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(my, [0, 1], ["0%", "100%"]);
  const glowBackground = useMotionTemplate`radial-gradient(circle at ${glowX} ${glowY}, rgba(205,245,106,0.17), rgba(134,231,255,0.07) 30%, transparent 58%)`;

  const onMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width);
    my.set((event.clientY - rect.top) / rect.height);
  };

  return (
    <Reveal delay={Math.min(index * 0.06, 0.24)}>
      <motion.div style={prefersReducedMotion ? undefined : { transformPerspective: 1400, rotateX, rotateY }}>
        <Link
          href={`/projects/${project.slug}`}
          onPointerMove={onMove}
          className="world-card group cursor-target relative grid min-h-[70vh] overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.035] p-5 transition duration-700 hover:-translate-y-2 hover:border-lime/35 hover:shadow-glow lg:grid-cols-[0.9fr_1.15fr] lg:p-8"
          data-cursor="Open"
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100"
            style={{
              background: glowBackground
            }}
          />
          <div className="relative z-10 flex flex-col justify-between p-2 sm:p-4">
            <div>
              <div className="mb-10 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-paper/42">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{project.category}</span>
              </div>
              <h3 className="max-w-[9ch] text-6xl font-semibold leading-[0.86] tracking-[-0.065em] transition duration-700 group-hover:tracking-[-0.045em] sm:text-8xl">
                {project.title}
              </h3>
            </div>
            <div className="mt-12 max-w-xl">
              <p className="line-clamp-6 text-lg leading-8 text-paper/66">{project.overview || project.description}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {project.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-paper/58 transition group-hover:border-lime/25 group-hover:text-paper/80">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="relative z-10 min-h-[340px] overflow-hidden rounded-[26px] border border-white/10 bg-paper/5">
            <motion.div className="absolute inset-[-5%]" style={prefersReducedMotion ? undefined : { x: imageX, y: imageY }}>
              <Image
                src={withBasePath(project.coverImage)}
                alt={`${project.title} cover`}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition duration-1000 ease-out group-hover:scale-110"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
              <span className="rounded-full border border-white/12 bg-ink/60 px-4 py-2 text-xs uppercase tracking-[0.24em] text-paper/64 backdrop-blur-md">
                Enter Case Study
              </span>
              <span className="grid size-12 place-items-center rounded-full bg-paper text-ink transition duration-500 group-hover:rotate-45 group-hover:bg-lime">
                <ArrowUpRight size={20} />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </Reveal>
  );
}

function AboutScene({ profileImage }: { profileImage: string }) {
  return (
    <section id="about" className="container-x py-24 sm:py-36">
      <div className="grid gap-12 border-y border-white/10 py-16 lg:grid-cols-[0.6fr_1.4fr]">
        <Reveal>
          <div>
            <ProfileAvatar image={profileImage} className="mb-7 size-28 sm:size-36" />
            <p className="text-xs uppercase tracking-[0.32em] text-[#B18D43]">09 · The Person</p>
          </div>
        </Reveal>
        <div>
          <LineReveal
            className="text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl"
            lines={["The person behind the products."]}
          />
          <Reveal delay={0.16}>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-paper/60">
              I&apos;m Ahmed, a product designer from Egypt who enjoys turning complicated systems into experiences that feel calm and human. Across fintech, real estate, government, commerce, and enterprise platforms, I&apos;ve learned that strong design comes from listening closely, asking better questions, and caring about what happens after the interface ships.
            </p>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-paper/60">
              I value clarity over decoration, systems over isolated screens, and collaboration over design theatre. The goal is always the same: make the product more useful, the business more capable, and the user more confident.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactScene({ profileImage, socials }: { profileImage: string; socials: SocialItem[] }) {
  const findSocial = (label: string) =>
    socials.find((item) => item.visible && item.label.toLowerCase().includes(label))?.url;
  const emailUrl = findSocial("email") || "mailto:ahmedalaraby410@gmail.com";
  const resumeUrl = findSocial("resume") || "/resume/1780851703945-ahmedalarabyseniorproductdesignerresume.pdf";
  const linkedinUrl = findSocial("linkedin") || "https://www.linkedin.com/in/ahmed-a-81621a1b3/";
  const whatsappUrl = "https://wa.me/201029466632?text=Hi%20Ahmed%2C%20I%27d%20like%20to%20discuss%20a%20product%20design%20opportunity.";

  return (
    <section id="contact" className="container-x pb-10 pt-24 sm:pt-36">
      <Reveal>
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-paper p-8 text-ink sm:p-12 lg:p-16">
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-lime/35 blur-3xl" />
          <div className="relative mb-5 flex items-center justify-between gap-5">
            <p className="text-xs uppercase tracking-[0.32em] text-ink/50">10 · Let&apos;s Work Together</p>
            <ProfileAvatar image={profileImage} className="size-16 border-ink/15 bg-ink/5 text-ink" />
          </div>
          <h2 className="relative max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-8xl">
            Let&apos;s build something people trust.
          </h2>
          <div className="relative mt-10 flex flex-wrap gap-3">
            <a href={emailUrl} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-lime hover:text-ink" data-cursor="Email">
              <Mail size={16} />
              ahmedalaraby410@gmail.com
            </a>
            <a href={withBasePath(resumeUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-medium text-ink/72 transition hover:border-ink hover:text-ink" data-cursor="Resume">
              <Download size={16} />
              Download Resume
            </a>
            <a href={linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-medium text-ink/72 transition hover:border-ink hover:text-ink">
              <Linkedin size={16} />
              LinkedIn
            </a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-medium text-ink/72 transition hover:border-ink hover:text-ink">
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
