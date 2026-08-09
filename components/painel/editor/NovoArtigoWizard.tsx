"use client";

import { useState } from "react";
import { EtapaBasico } from "@/components/painel/editor/EtapaBasico";
import { EtapaConteudo } from "@/components/painel/editor/EtapaConteudo";
import { EtapaRevisao } from "@/components/painel/editor/EtapaRevisao";
import { useAvisoSairSemSalvar } from "@/lib/hooks/useAvisoSairSemSalvar";
import type { PeriodoId } from "@/data/periodos";

const CHAVE_RASCUNHO = "painel:novo-artigo:rascunho";

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
  // Lê o rascunho do sessionStorage já no valor inicial (em vez de useEffect)
  // — evita um render extra e a re-hidratação piscando o estado vazio antes
  // do restaurado.
  const [estado, setEstado] = useState<EstadoArtigo>(() => {
    if (typeof window === "undefined") return ESTADO_INICIAL;
    try {
      const salvo = sessionStorage.getItem(CHAVE_RASCUNHO);
      return salvo ? JSON.parse(salvo) : ESTADO_INICIAL;
    } catch {
      return ESTADO_INICIAL;
    }
  });
  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [rascunhoRestaurado] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(CHAVE_RASCUNHO) !== null;
    } catch {
      return false;
    }
  });
  const [descartado, setDescartado] = useState(false);
  const [publicadoComSucesso, setPublicadoComSucesso] = useState(false);

  function atualizar(parcial: Partial<EstadoArtigo>) {
    setEstado((atual) => {
      const novo = { ...atual, ...parcial };
      try {
        sessionStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(novo));
      } catch {
        // idem — sem rascunho persistido, mas o formulário continua funcionando.
      }
      return novo;
    });
  }

  function comecarDoZero() {
    setEstado(ESTADO_INICIAL);
    setEtapa(1);
    setDescartado(true);
    try {
      sessionStorage.removeItem(CHAVE_RASCUNHO);
    } catch {
      // sem-efeito se sessionStorage não estiver disponível.
    }
  }

  function lidarComPublicado() {
    setPublicadoComSucesso(true);
    try {
      sessionStorage.removeItem(CHAVE_RASCUNHO);
    } catch {
      // idem.
    }
  }

  const sujo =
    !publicadoComSucesso &&
    (estado.titulo.trim() !== "" || estado.corpoMdx.trim() !== "");
  useAvisoSairSemSalvar(sujo);

  return (
    <div className="mt-10 max-w-2xl">
      {rascunhoRestaurado && !descartado && !publicadoComSucesso && (
        <div className="mb-6 flex items-center justify-between border border-ouro bg-ouro/10 px-4 py-3">
          <p className="meta text-chumbo">
            Rascunho restaurado — você tinha um artigo pela metade.
          </p>
          <button
            type="button"
            onClick={comecarDoZero}
            className="meta text-lacre hover:underline"
          >
            Começar do zero
          </button>
        </div>
      )}

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
          onPublicado={lidarComPublicado}
        />
      )}
    </div>
  );
}
