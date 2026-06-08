"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MouseEvent, ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function MagneticButton({ href, children, variant = "primary", className }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  const onMove = (event: MouseEvent<HTMLElement>) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    element.style.transform = `translate3d(${x * 0.18}px, ${y * 0.28}px, 0)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
  };

  const classes = cn(
    "magnetic inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition duration-300",
    variant === "primary"
      ? "bg-paper text-ink hover:bg-lime"
      : "border border-white/15 bg-white/[0.04] text-paper hover:border-lime/50 hover:text-lime",
    className
  );

  if (href) {
    return (
      <Link ref={ref as React.RefObject<HTMLAnchorElement>} href={href} onMouseMove={onMove} onMouseLeave={onLeave} className={classes}>
        {children}
        <ArrowUpRight size={16} />
      </Link>
    );
  }

  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} onMouseMove={onMove} onMouseLeave={onLeave} className={classes}>
      {children}
      <ArrowUpRight size={16} />
    </button>
  );
}
