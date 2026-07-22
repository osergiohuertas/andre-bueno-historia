"use client";

import { useEffect, useRef } from "react";

export function ReadingProgress({ targetId }: { targetId: string }) {
  const barraRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const alvo = document.getElementById(targetId);
    const barra = barraRef.current;
    if (!alvo || !barra) return;

    function atualizar() {
      if (!alvo) return;
      const { top, height } = alvo.getBoundingClientRect();
      const janela = window.innerHeight;
      const total = height - janela;
      const percorrido = total > 0 ? Math.min(1, Math.max(0, -top / total)) : 0;
      if (barra) barra.style.transform = `scaleX(${percorrido})`;
    }

    atualizar();
    window.addEventListener("scroll", atualizar, { passive: true });
    window.addEventListener("resize", atualizar);
    return () => {
      window.removeEventListener("scroll", atualizar);
      window.removeEventListener("resize", atualizar);
    };
  }, [targetId]);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-40 h-0.5 bg-borda/40"
    >
      <div
        ref={barraRef}
        className="h-full origin-left bg-lacre"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
