"use client";

import Image from "next/image";
import { ArrowUpRight, Award } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Certificate } from "@/data/certificates";
import { withBasePath } from "@/lib/base-path";

export function CertificatesSection({ certificates }: { certificates: Certificate[] }) {
  const prefersReducedMotion = useReducedMotion();
  const visibleCertificates = certificates
    .filter((certificate) => certificate.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="certificates" className="container-x py-24 sm:py-36">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 grid gap-6 border-t border-white/10 pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
      >
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.32em] text-[#B18D43]">07 · Still Learning</p>
          <h2 className="text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">
            Continuous Learning
          </h2>
        </div>
        <p className="max-w-xl text-lg leading-8 text-paper/58 lg:justify-self-end">
          A collection of programs and certifications that shaped my product design, analytics, and UX thinking.
        </p>
      </motion.div>

      {visibleCertificates.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleCertificates.map((certificate, index) => (
            <motion.article
              key={`${certificate.issuer}-${certificate.title}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 34, filter: "blur(8px)" }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{
                duration: 0.72,
                delay: Math.min(index * 0.08, 0.24),
                ease: [0.22, 1, 0.36, 1]
              }}
              className="certificate-card group relative flex min-h-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] p-3"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[17px] border border-white/10 bg-[#0a0a0c]">
                <Image
                  src={withBasePath(certificate.image)}
                  alt={`${certificate.title} certificate preview`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/[0.025]" />
                <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-paper/72 backdrop-blur-xl">
                  {certificate.issuer}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-3 pb-2 pt-6 sm:p-5 sm:pb-3 sm:pt-7">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-paper/38">
                    <Award size={14} className="text-[#B18D43]" />
                    Certificate
                  </span>
                  <span className="text-xs text-paper/42">{certificate.date}</span>
                </div>

                <h3 className="text-2xl font-semibold leading-tight tracking-[-0.035em] text-paper sm:text-[1.75rem]">
                  {certificate.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-6 text-paper/54">{certificate.description}</p>

                <a
                  href={withBasePath(certificate.link)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-medium text-paper/76 transition duration-300 hover:text-[#D4B66F]"
                  data-cursor="View"
                >
                  View certificate
                  <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          className="grid min-h-56 place-items-center rounded-[24px] border border-dashed border-white/12 bg-white/[0.02] px-6 text-center"
        >
          <div>
            <Award className="mx-auto mb-4 text-[#B18D43]" size={24} />
            <p className="text-lg font-medium text-paper/78">New certifications are being added.</p>
            <p className="mt-2 text-sm text-paper/42">Check back soon for Ahmed&apos;s latest programs.</p>
          </div>
        </motion.div>
      )}
    </section>
  );
}
