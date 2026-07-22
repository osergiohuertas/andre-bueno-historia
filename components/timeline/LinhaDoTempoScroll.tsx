"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PainelPeriodo } from "@/components/timeline/PainelPeriodo";
import type { FaixaLinhaDoTempo } from "@/lib/timeline";

export function LinhaDoTempoScroll({ faixas }: { faixas: FaixaLinhaDoTempo[] }) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const container = containerRef.current;
    const track = trackRef.current;
    if (!outer || !container || !track) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Sem exceção: com prefers-reduced-motion, a faixa fica no layout
    // vertical padrão (flex-col via CSS) e o scroll horizontal nunca roda.
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // getDistancia() é recalculada a cada invalidate/refresh — nunca
        // um valor congelado no fechamento. Antes, "distancia" era medida
        // uma vez no mount (às vezes antes das imagens carregarem), e o
        // scroll passava a travar numa distância que não batia mais com o
        // conteúdo real.
        const getDistancia = () => track.scrollWidth - container.offsetWidth;
        if (getDistancia() <= 0) return;

        // De propósito, SEM pin:true. pin faz o GSAP envolver o elemento
        // num <div class="pin-spacer"> por fora do controle do React. Isso
        // reparenta o DOM de um jeito que o React não sabe — e ao navegar
        // pra outra rota, o React tenta desmontar essa árvore assumindo a
        // estrutura original, encontra um nó que já não é mais filho
        // direto do pai que ele lembra e quebra com "Failed to execute
        // 'removeChild'" (reproduzido: acontecia sempre que se navegava
        // pra fora de /linha-do-tempo depois de rolar até o fim). position:
        // sticky nativo dá o mesmo efeito visual de "gruda na tela
        // enquanto a faixa horizontal roda" sem o GSAP tocar no DOM —
        // container fica sticky via CSS, GSAP só anima o x do track.
        const aplicarAltura = () => {
          outer.style.height = `calc(100vh + ${getDistancia()}px)`;
        };
        aplicarAltura();

        gsap.to(track, {
          x: () => -getDistancia(),
          ease: "none",
          scrollTrigger: {
            trigger: outer,
            start: "top top",
            end: () => `+=${getDistancia()}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: aplicarAltura,
          },
        });

        return () => {
          outer.style.height = "";
        };
      });
    }, outer);

    // Recalcula depois que imagens/fontes terminam de carregar — o layout
    // pode mudar de tamanho depois da primeira medição.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={outerRef} className="bg-ink">
      <div
        ref={containerRef}
        className="md:sticky md:top-0 md:h-screen md:overflow-hidden"
      >
        <div ref={trackRef} className="flex flex-col md:h-screen md:flex-row">
          {faixas.map((faixa) => (
            <PainelPeriodo key={faixa.periodo.id} faixa={faixa} />
          ))}
        </div>
      </div>
    </div>
  );
}
