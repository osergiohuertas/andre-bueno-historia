"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Respeito sem exceção: nada de Lenis nem ticker do GSAP aqui.
    // O navegador assume o scroll nativo.
    if (prefersReducedMotion) return;

    const lenis = new Lenis({ autoRaf: false });
    lenisRef.current = lenis;

    function onTick(time: number) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Navegação client-side (App Router) não recarrega a página: o conteúdo
  // muda de altura sem que o Lenis recalcule os limites sozinho. Sem isso,
  // o scroll às vezes "trava" numa posição herdada da rota anterior. Roda
  // depois do DOM da nova rota assentar.
  //
  // Importante: NÃO chamamos ScrollTrigger.refresh() aqui. Um refresh
  // global logo após a troca de rota reprocessa todo ScrollTrigger vivo —
  // inclusive o pin da página anterior, que pode ainda estar no meio do
  // próprio revert() de desmontagem nesse instante. Isso corrompe a
  // estrutura do DOM que o React espera encontrar e quebra a navegação
  // com "Failed to execute 'removeChild'". Cada ScrollTrigger com pin já
  // se responsabiliza pelo próprio refresh via invalidateOnRefresh.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      lenisRef.current?.resize();
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return <>{children}</>;
}
