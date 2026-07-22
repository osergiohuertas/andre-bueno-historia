"use client";

import { useState } from "react";
import { EtapaBasico } from "@/components/painel/editor/EtapaBasico";
import { EtapaConteudo } from "@/components/painel/editor/EtapaConteudo";
import { EtapaRevisao } from "@/components/painel/editor/EtapaRevisao";
import type { PeriodoId } from "@/data/periodos";

export type EstadoArtigo = {
  titulo: string;
  periodo: PeriodoId | null;
  periodosSecundarios: PeriodoId[];
  anoInicio: string;
  anoFim: string;
  regiao: string;
  serie: string;
  imagens: { url: string; legenda: string }[];
  corpoMdx: string;
  excerpt: string;
  metaDescription: string;
  tags: string[];
  slug: string;
};

const ESTADO_INICIAL: EstadoArtigo = {
  titulo: "",
  periodo: null,
  periodosSecundarios: [],
  anoInicio: "",
  anoFim: "",
  regiao: "",
  serie: "",
  imagens: [],
  corpoMdx: "",
  excerpt: "",
  metaDescription: "",
  tags: [],
  slug: "",
};

const ETAPAS = [
  { numero: 1, titulo: "Básico" },
  { numero: 2, titulo: "Conteúdo" },
  { numero: 3, titulo: "Revisão" },
] as const;

export function NovoArtigoWizard({
  series,
  contagens,
}: {
  series: { slug: string; nome: string }[];
  contagens: Partial<Record<PeriodoId, number>>;
}) {
  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [estado, setEstado] = useState<EstadoArtigo>(ESTADO_INICIAL);

  function atualizar(parcial: Partial<EstadoArtigo>) {
    setEstado((atual) => ({ ...atual, ...parcial }));
  }

  return (
    <div className="mt-10 max-w-2xl">
      <div className="mb-10 flex items-center gap-3">
        {ETAPAS.map((e, i) => (
          <div key={e.numero} className="flex items-center gap-3">
            <div
              className={`meta flex h-8 w-8 items-center justify-center rounded-full border ${
                etapa === e.numero
                  ? "border-lacre bg-lacre text-ouro"
                  : etapa > e.numero
                    ? "border-ink bg-ink text-ouro"
                    : "border-borda text-chumbo-lt"
              }`}
            >
              {e.numero}
            </div>
            <span
              className={`meta ${etapa === e.numero ? "text-ink" : "text-chumbo-lt"}`}
            >
              {e.titulo}
            </span>
            {i < ETAPAS.length - 1 && (
              <div className="h-px w-8 bg-borda" aria-hidden />
            )}
          </div>
        ))}
      </div>

      {etapa === 1 && (
        <EtapaBasico
          estado={estado}
          atualizar={atualizar}
          series={series}
          contagens={contagens}
          onAvancar={() => setEtapa(2)}
        />
      )}

      {etapa === 2 && (
        <EtapaConteudo
          estado={estado}
          atualizar={atualizar}
          onVoltar={() => setEtapa(1)}
          onAvancar={() => setEtapa(3)}
        />
      )}

      {etapa === 3 && (
        <EtapaRevisao
          estado={estado}
          atualizar={atualizar}
          onVoltar={() => setEtapa(2)}
        />
      )}
    </div>
  );
}
