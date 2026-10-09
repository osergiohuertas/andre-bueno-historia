"use client";

import { useCallback, useEffect, useState } from "react";
import { ImagemSegura } from "@/components/ui/ImagemSegura";
import type { Midia } from "@/lib/obra";

export function FotosSection({ fotos }: { fotos: Midia[] }) {
  const [aberta, setAberta] = useState<number | null>(null);

  const fechar = useCallback(() => setAberta(null), []);
  const mover = useCallback(
    (passo: number) =>
      setAberta((atual) =>
        atual === null ? null : (atual + passo + fotos.length) % fotos.length,
      ),
    [fotos.length],
  );

  useEffect(() => {
    if (aberta === null) return;
    const teclas = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };
    document.addEventListener("keydown", teclas);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", teclas);
      document.body.style.overflow = "";
    };
  }, [aberta, fechar, mover]);

  const atual = aberta === null ? null : fotos[aberta];

  return (
    <section className="py-10 md:py-14">
      <div className="mb-10">
        <p className="meta text-lacre">Catálogo</p>
        <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
          Fotos
        </h2>
      </div>

      {fotos.length === 0 ? (
        <p className="meta text-chumbo-lt">Nenhuma foto cadastrada ainda.</p>
      ) : (
        <div className="gap-6 sm:columns-2 lg:columns-3">
          {fotos.map((foto, i) => (
            <figure key={foto.id} className="mb-6 break-inside-avoid border border-borda bg-paper">
              <button
                type="button"
                onClick={() => setAberta(i)}
                aria-label={`Ampliar: ${foto.titulo}`}
                className="group relative block aspect-[4/3] w-full overflow-hidden bg-paper-mid"
              >
                <ImagemSegura
                  src={foto.url}
                  alt={foto.titulo}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <span className="meta absolute bottom-3 right-3 bg-ink/75 px-2.5 py-1.5 text-paper opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  Ampliar
                </span>
              </button>
              <figcaption className="p-5">
                <p className="font-display text-lg leading-snug text-ink">{foto.titulo}</p>
                {foto.descricao && (
                  <p className="mt-2 font-serif text-sm leading-relaxed text-chumbo">
                    {foto.descricao}
                  </p>
                )}
                {foto.credito && (
                  <p className="meta mt-3 text-chumbo-lt">Crédito: {foto.credito}</p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {atual && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={atual.titulo}
          className="fixed inset-0 z-[100] flex flex-col bg-ink"
          onClick={fechar}
        >
          <div className="flex items-center justify-between px-6 py-4 text-paper">
            <span className="meta text-paper/60">
              {aberta! + 1} / {fotos.length}
            </span>
            <button type="button" onClick={fechar} className="meta text-paper hover:text-ouro">
              Fechar ✕
            </button>
          </div>

          <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
            <ImagemSegura
              key={atual.id}
              src={atual.url}
              alt={atual.titulo}
              fill
              sizes="100vw"
              className="object-contain"
            />
            {fotos.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Foto anterior"
                  onClick={() => mover(-1)}
                  className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-paper/30 text-paper hover:border-ouro hover:text-ouro"
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Próxima foto"
                  onClick={() => mover(1)}
                  className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-paper/30 text-paper hover:border-ouro hover:text-ouro"
                >
                  →
                </button>
              </>
            )}
          </div>

          <div className="mx-auto max-w-3xl px-6 py-6 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="font-display text-xl text-paper">{atual.titulo}</p>
            {atual.credito && (
              <p className="meta mt-2 text-paper/60">Crédito: {atual.credito}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
