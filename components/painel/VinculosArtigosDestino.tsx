"use client";

import { useState, useTransition } from "react";
import { alternarVinculoArtigo } from "@/app/painel/(protegido)/destinos/actions";

export function VinculosArtigosDestino({
  destinoId,
  artigos,
  vinculadosIniciais,
}: {
  destinoId: string;
  artigos: { slug: string; titulo: string }[];
  vinculadosIniciais: string[];
}) {
  const [vinculados, setVinculados] = useState(new Set(vinculadosIniciais));
  const [, iniciarTransicao] = useTransition();

  function aoAlternar(slug: string) {
    const vincularAgora = !vinculados.has(slug);
    setVinculados((atual) => {
      const proximo = new Set(atual);
      if (vincularAgora) proximo.add(slug);
      else proximo.delete(slug);
      return proximo;
    });
    iniciarTransicao(async () => {
      await alternarVinculoArtigo(destinoId, slug, vincularAgora);
    });
  }

  if (artigos.length === 0) {
    return (
      <p className="meta text-chumbo-lt">Nenhum artigo publicado ainda.</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {artigos.map((artigo) => (
        <button
          key={artigo.slug}
          type="button"
          onClick={() => aoAlternar(artigo.slug)}
          aria-pressed={vinculados.has(artigo.slug)}
          className={`meta border px-3 py-1.5 text-left ${
            vinculados.has(artigo.slug)
              ? "border-lacre bg-lacre text-ouro"
              : "border-borda text-chumbo hover:border-lacre"
          }`}
        >
          {artigo.titulo}
        </button>
      ))}
    </div>
  );
}
