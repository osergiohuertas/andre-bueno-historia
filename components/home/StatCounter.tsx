"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function StatCounter({
  valor,
  label,
  sufixo = "",
}: {
  valor: number;
  label: string;
  sufixo?: string;
}) {
  const numeroRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = numeroRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      el.textContent = `${valor}${sufixo}`;
      return;
    }

    const contador = { n: 0 };
    const tween = gsap.to(contador, {
      n: valor,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        once: true,
      },
      onUpdate: () => {
        el.textContent = `${Math.round(contador.n)}${sufixo}`;
      },
    });

    return () => {
      tween.kill();
    };
  }, [valor, sufixo]);

  return (
    <div>
      <p className="font-display text-4xl text-ink md:text-5xl">
        <span ref={numeroRef}>0{sufixo}</span>
      </p>
      <p className="meta mt-2 text-chumbo-lt">{label}</p>
    </div>
  );
}
