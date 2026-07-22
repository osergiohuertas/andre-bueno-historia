"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function TimelineGrowLine({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const linhaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const linha = linhaRef.current;
    if (!container || !linha) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(linha, { scaleX: 1 });
      return;
    }

    gsap.set(linha, { scaleX: 0, transformOrigin: "left center" });

    const tween = gsap.to(linha, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top 75%",
        end: "bottom 60%",
        scrub: 0.5,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative h-px w-full bg-paper/15 ${className}`}
    >
      <div
        ref={linhaRef}
        className="absolute inset-0 bg-ouro"
        style={{ transformOrigin: "left center" }}
      />
    </div>
  );
}
