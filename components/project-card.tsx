import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group cursor-target grid min-h-[560px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] lg:grid-cols-[0.95fr_1.25fr]"
    >
      <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
        <div>
          <div className="mb-9 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-paper/45">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span>{project.category}</span>
          </div>
          <h3 className="max-w-[9ch] text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-balance sm:text-7xl">
            {project.title}
          </h3>
        </div>
        <div className="mt-10">
          <p className="max-w-md text-base leading-7 text-paper/62">{project.description}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-paper/58">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="relative min-h-[320px] overflow-hidden bg-paper/5">
        <Image
          src={project.coverImage}
          alt={`${project.title} cover`}
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute right-5 top-5 grid size-12 place-items-center rounded-full bg-paper text-ink transition duration-500 group-hover:rotate-45 group-hover:bg-lime">
          <ArrowUpRight size={20} />
        </div>
      </div>
    </Link>
  );
}
