"use client";

import { useState } from "react";
import { ZonaAlcance } from "@/components/totem/ZonaAlcance";
import type { AcervoPreviewData } from "@/components/totem/EstadoAcervoPreview";
import type { PeriodoId } from "@/data/periodos";

export type PeriodoComAcervo = {
  id: PeriodoId;
  label: string;
  documentos: AcervoPreviewData[];
};

export function EstadoAcervo({
  periodos,
  onAbrirPreviaDocumento,
}: {
  periodos: PeriodoComAcervo[];
  onAbrirPreviaDocumento: (documento: AcervoPreviewData) => void;
}) {
  const [periodoAberto, setPeriodoAberto] = useState<PeriodoId | null>(null);
  const periodo = periodos.find((p) => p.id === periodoAberto) ?? null;

  const periodosOrdenados = [...periodos].sort((a, b) => {
    const aVazio = a.documentos.length === 0;
    const bVazio = b.documentos.length === 0;
    if (aVazio === bVazio) return 0;
    return aVazio ? 1 : -1;
  });

  return (
    <>
      <div
        className="absolute inset-x-0 top-0 flex flex-col items-center justify-end px-10 text-center"
        style={{ height: "20vh" }}
      >
        <p className="meta text-ouro">Acervo documental</p>
        <h1 className="mt-3 font-display text-2xl text-paper">
          {periodo ? periodo.label : "Escolha um período"}
        </h1>
      </div>

      {!periodo && (
        <ZonaAlcance className="gap-2 px-6">
          {periodosOrdenados.map((p) => {
            const vazio = p.documentos.length === 0;
            return (
              <button
                key={p.id}
                type="button"
                disabled={vazio}
                onClick={() => setPeriodoAberto(p.id)}
                className={`flex shrink-0 items-center justify-between border px-6 text-left transition-transform active:scale-[0.98] ${
                  vazio
                    ? "border-paper/10 text-paper/30"
                    : "border-paper/20 bg-paper/5 text-paper active:bg-ouro/15"
                }`}
                style={{ minHeight: "68px" }}
              >
                <span className="font-display text-lg">{p.label}</span>
                <span className="meta">
                  {vazio
                    ? "em pesquisa"
                    : `${p.documentos.length} documento${p.documentos.length > 1 ? "s" : ""}`}
                </span>
              </button>
            );
          })}
        </ZonaAlcance>
      )}

      {periodo && (
        <ZonaAlcance className="gap-2 px-6">
          <button
            type="button"
            onClick={() => setPeriodoAberto(null)}
            className="meta mb-1 self-start text-ouro"
          >
            ← Todos os períodos
          </button>
          {periodo.documentos.map((documento) => (
            <button
              key={documento.slug}
              type="button"
              onClick={() => onAbrirPreviaDocumento(documento)}
              className="shrink-0 border border-paper/20 bg-paper/5 px-6 py-5 text-left transition-transform active:scale-[0.98] active:bg-ouro/15"
            >
              <span className="block font-display text-lg text-paper">
                {documento.titulo}
              </span>
              <span className="mt-2 block font-serif text-xs text-paper/60 line-clamp-2">
                {documento.excerpt}
              </span>
            </button>
          ))}
        </ZonaAlcance>
      )}
    </>
  );
}
