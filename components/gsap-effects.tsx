"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function GsapEffects() {
  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        const distance = Number(element.dataset.parallax || 80);
        gsap.fromTo(
          element,
          { y: -distance },
          {
            y: distance,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-image-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { clipPath: "inset(14% 14% 14% 14% round 26px)", scale: 1.06 },
          {
            clipPath: "inset(0% 0% 0% 0% round 26px)",
            scale: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
              end: "top 30%",
              scrub: 0.7
            }
          }
        );
      });
    });

    return () => media.revert();
  });

  return null;
}
