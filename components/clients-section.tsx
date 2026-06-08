"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Client } from "@/data/clients";
import { withBasePath } from "@/lib/base-path";

function ClientCard({ client }: { client: Client }) {
  return (
    <article
      className="client-logo-card group relative flex h-[142px] w-[238px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.028] px-6 pb-9 pt-5 sm:h-[164px] sm:w-[286px] sm:px-7 sm:pb-10 sm:pt-6 lg:h-[176px] lg:w-[310px]"
      data-cursor="Client"
    >
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transition duration-500 group-hover:via-[#B18D43]/45" />
      <Image
        src={withBasePath(client.logo)}
        alt={`${client.name} logo`}
        width={520}
        height={200}
        sizes="310px"
        unoptimized
        className="client-logo h-auto max-h-[82px] w-auto max-w-[92%] object-contain sm:max-h-[96px]"
      />
      <span className="client-logo-name absolute bottom-4 left-5 right-5 truncate text-center text-xs font-medium text-white sm:bottom-5">
        {client.name}
      </span>
    </article>
  );
}

function MarqueeRow({ clients, reverse = false }: { clients: Client[]; reverse?: boolean }) {
  if (!clients.length) return null;

  return (
    <div className="client-marquee-row overflow-hidden">
      <div className={`client-marquee-track ${reverse ? "is-reverse" : ""}`}>
        <div className="client-marquee-copy">
          {clients.map((client) => <ClientCard key={client.id} client={client} />)}
        </div>
        <div className="client-marquee-copy" aria-hidden="true">
          {clients.map((client) => <ClientCard key={`copy-${client.id}`} client={client} />)}
        </div>
      </div>
    </div>
  );
}

export function ClientsSection({ clients }: { clients: Client[] }) {
  const prefersReducedMotion = useReducedMotion();
  const visibleClients = clients
    .filter((client) => client.visible)
    .sort((a, b) => a.order - b.order);
  const useTwoRows = visibleClients.length > 6;
  const firstRow = useTwoRows ? visibleClients.filter((_, index) => index % 2 === 0) : visibleClients;
  const secondRow = useTwoRows ? visibleClients.filter((_, index) => index % 2 === 1) : [];

  if (!visibleClients.length) return null;

  return (
    <section id="clients" className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-20 sm:py-28">
      <div className="container-x">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 grid gap-5 border-b border-white/10 pb-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end"
        >
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.32em] text-[#B18D43]">06 · Who Trusts Me</p>
            <h2 className="max-w-3xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-6xl">
              Selected Clients &amp; Companies
            </h2>
          </div>
          <p className="max-w-xl leading-7 text-paper/54 lg:justify-self-end">
            A snapshot of brands, platforms, and organizations I&apos;ve contributed to across multiple markets.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, delay: 0.12 }}
        className="client-marquee-shell grid gap-4"
      >
        <MarqueeRow clients={firstRow} />
        {secondRow.length ? <MarqueeRow clients={secondRow} reverse /> : null}
      </motion.div>
    </section>
  );
}
