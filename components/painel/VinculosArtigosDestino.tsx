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
  const [busca, setBusca] = useState("");
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

  const filtrados = artigos.filter((artigo) =>
    artigo.titulo.toLowerCase().includes(busca.trim().toLowerCase()),
  );

  return (
    <div>
      {artigos.length > 8 && (
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar artigo por título…"
          className="mb-3 w-full max-w-sm border border-borda bg-paper px-3 py-2 text-sm text-ink focus:border-lacre focus:outline-none"
        />
      )}

      <div className="flex flex-wrap gap-2">
        {filtrados.length === 0 && (
          <p className="meta text-chumbo-lt">Nada encontrado com essa busca.</p>
        )}
        {filtrados.map((artigo) => (
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
    </div>
  );
}
