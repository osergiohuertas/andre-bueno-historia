"use client";

import { useEffect, useState } from "react";

type TocEntry = { title: string; url: string; items: TocEntry[] };

function achatar(entradas: TocEntry[]): TocEntry[] {
  return entradas.flatMap((e) => [e, ...achatar(e.items)]);
}

export function TableOfContents({ toc }: { toc: TocEntry[] }) {
  const entradas = achatar(toc);
  const [ativo, setAtivo] = useState<string | null>(null);

  useEffect(() => {
    const alvos = entradas
      .map((e) => document.getElementById(e.url.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    if (alvos.length === 0) return;

    const LIMITE_LEITURA = 120;

    // Ativo = o último heading que já passou da linha de leitura.
    // Checar a posição de todos a cada scroll é mais robusto que
    // IntersectionObserver aqui: scrolls rápidos/grandes podem pular
    // inteiramente por uma faixa estreita de interseção sem disparar.
    function recalcular() {
      let atualId: string | null = null;
      for (const el of alvos) {
        if (el.getBoundingClientRect().top <= LIMITE_LEITURA) {
          atualId = el.id;
        }
      }
      setAtivo(atualId ? `#${atualId}` : null);
    }

    recalcular();
    window.addEventListener("scroll", recalcular, { passive: true });
    window.addEventListener("resize", recalcular);
    return () => {
      window.removeEventListener("scroll", recalcular);
      window.removeEventListener("resize", recalcular);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (entradas.length === 0) return null;

  return (
    <nav aria-label="Sumário do artigo" className="sticky top-24 hidden self-start xl:block">
      <p className="meta mb-4 text-chumbo-lt">Sumário</p>
      <ol className="flex flex-col gap-3 border-l border-borda">
        {entradas.map((entrada) => (
          <li key={entrada.url}>
            <a
              href={entrada.url}
              className={`block border-l-2 py-0.5 pl-4 -ml-px font-sans text-sm transition-colors ${
                ativo === entrada.url
                  ? "border-lacre text-lacre"
                  : "border-transparent text-chumbo hover:text-lacre"
              }`}
            >
              {entrada.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
