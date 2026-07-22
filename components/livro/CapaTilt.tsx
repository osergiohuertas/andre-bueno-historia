"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function CapaTilt({
  titulo,
  capa,
}: {
  titulo: string;
  capa?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const capaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const alvo = capaRef.current;
    if (!container || !alvo) return;

    // Tilt é só para desktop com mouse fino. Em mobile/touch a capa fica
    // estática — sem listener nenhum, então não há risco de travar o
    // scroll. Duas checagens (largura + capacidade de hover) porque nem
    // todo ambiente reporta pointer/hover corretamente ao emular mobile.
    const podeTilt =
      window.innerWidth >= 768 &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!podeTilt || prefersReducedMotion) return;

    const rotateX = gsap.quickTo(alvo, "rotateX", {
      duration: 0.5,
      ease: "power3.out",
    });
    const rotateY = gsap.quickTo(alvo, "rotateY", {
      duration: 0.5,
      ease: "power3.out",
    });

    function onMouseMove(e: MouseEvent) {
      const rect = container!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY(x * 24);
      rotateX(y * -24);
    }

    function onMouseLeave() {
      rotateX(0);
      rotateY(0);
    }

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-xs [perspective:1200px] md:max-w-sm"
    >
      <div
        ref={capaRef}
        className="relative aspect-[2/3] w-full bg-ink [transform-style:preserve-3d] drop-shadow-[0_25px_40px_rgba(13,13,13,0.35)]"
      >
        {capa ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capa}
            alt={`Capa do livro ${titulo}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col justify-between border border-paper/10 p-8">
            <p className="meta text-ouro">André Bueno</p>
            <p className="font-display text-2xl leading-tight text-paper">
              {titulo}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
