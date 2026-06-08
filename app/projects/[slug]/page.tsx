import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { GsapEffects } from "@/components/gsap-effects";
import { MagneticButton } from "@/components/magnetic-button";
import { Reveal } from "@/components/reveal";
import { SiteNav } from "@/components/site-nav";
import { getProject, getProjects } from "@/lib/projects";
import { withBasePath } from "@/lib/base-path";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} - Ahmed Alaraby`,
      description: project.description,
      images: [{ url: project.coverImage }]
    }
  };
}

const sections = [
  ["Overview", "overview"],
  ["Problem", "problem"],
  ["Solution", "solution"],
  ["Process", "process"],
  ["Outcome", "outcome"]
] as const;

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  return (
    <>
      <SiteNav />
      <GsapEffects />
      <main>
        <section className="container-x min-h-screen pb-12 pt-32">
          <Reveal>
            <Link href="/#featured-work" className="mb-10 inline-flex items-center gap-2 text-sm text-paper/55 transition hover:text-lime">
              <ArrowLeft size={16} />
              Back to work
            </Link>
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <p className="mb-5 text-sm uppercase tracking-[0.3em] text-lime">{project.category}</p>
                <h1 className="max-w-4xl text-[clamp(4.5rem,11vw,13rem)] font-semibold leading-[0.8] tracking-[-0.07em] text-balance">
                  {project.title}
                </h1>
              </div>
              <div className="lg:pb-5">
                <p className="text-2xl leading-tight text-paper/76">{project.description}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-paper/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="mt-12">
            <div data-image-reveal className="relative aspect-[16/9] overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04]">
              <Image src={withBasePath(project.coverImage)} alt={`${project.title} hero image`} fill priority sizes="100vw" className="object-cover" />
            </div>
          </Reveal>
        </section>

        <section className="container-x py-20">
          <div className="grid gap-6 lg:grid-cols-[0.45fr_1fr]">
            <Reveal>
              <div className="sticky top-28 grid gap-4 text-sm uppercase tracking-[0.25em] text-paper/42">
                <span>{project.year}</span>
                <span>{project.client}</span>
                {project.behanceUrl ? (
                  <a className="inline-flex items-center gap-2 text-lime" href={project.behanceUrl} target="_blank" rel="noreferrer">
                    Behance <ArrowUpRight size={14} />
                  </a>
                ) : null}
              </div>
            </Reveal>
            <div className="grid gap-4">
              {sections.map(([label, key], index) => (
                <Reveal key={label} delay={index * 0.04}>
                  <article className="grid gap-8 border-t border-white/10 py-10 md:grid-cols-[0.28fr_1fr]">
                    <h2 className="text-sm uppercase tracking-[0.3em] text-paper/42">{label}</h2>
                    <p className="text-2xl leading-snug text-paper/78">{project[key]}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="container-x py-20">
          <Reveal className="mb-10 flex items-end justify-between gap-8">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-paper/42">Gallery</p>
              <h2 className="text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">Selected screens</h2>
            </div>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            {project.gallery.map((image, index) => (
              <Reveal key={image} delay={index * 0.06}>
                <div data-image-reveal className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04]">
                  <Image src={withBasePath(image)} alt={`${project.title} gallery ${index + 1}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="container-x pb-10 pt-16">
          <Reveal>
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 sm:p-12">
              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-paper/42">Next step</p>
              <h2 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-7xl">
                Have a similar product challenge?
              </h2>
              <div className="mt-8">
                <MagneticButton href="mailto:ahmedalaraby410@gmail.com">Start a Conversation</MagneticButton>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}
