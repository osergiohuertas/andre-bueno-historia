"use client";

import { SeletorPeriodoVisual } from "@/components/painel/editor/SeletorPeriodoVisual";
import type { PeriodoId } from "@/data/periodos";
import type { EstadoArtigo } from "@/components/painel/editor/NovoArtigoWizard";

export function EtapaBasico({
  estado,
  atualizar,
  series,
  contagens,
  onAvancar,
}: {
  estado: EstadoArtigo;
  atualizar: (parcial: Partial<EstadoArtigo>) => void;
  series: { slug: string; nome: string }[];
  contagens: Partial<Record<PeriodoId, number>>;
  onAvancar: () => void;
}) {
  const podeAvancar = estado.titulo.trim() !== "" && estado.periodo !== null && estado.anoInicio !== "";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <label htmlFor="titulo" className="meta mb-2 block text-chumbo-lt">
          Título
        </label>
        <input
          id="titulo"
          value={estado.titulo}
          onChange={(e) => atualizar({ titulo: e.target.value })}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <SeletorPeriodoVisual
        periodoSelecionado={estado.periodo}
        periodosSecundarios={estado.periodosSecundarios}
        contagens={contagens}
        onSelecionarPrincipal={(id) => atualizar({ periodo: id })}
        onAlternarSecundario={(id) =>
          atualizar({
            periodosSecundarios: estado.periodosSecundarios.includes(id)
              ? estado.periodosSecundarios.filter((p) => p !== id)
              : [...estado.periodosSecundarios, id],
          })
        }
      />

      <div className="flex gap-6">
        <div>
          <label htmlFor="anoInicio" className="meta mb-2 block text-chumbo-lt">
            Ano início
          </label>
          <input
            id="anoInicio"
            type="number"
            value={estado.anoInicio}
            onChange={(e) => atualizar({ anoInicio: e.target.value })}
            className="w-32 border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="anoFim" className="meta mb-2 block text-chumbo-lt">
            Ano fim (opcional)
          </label>
          <input
            id="anoFim"
            type="number"
            value={estado.anoFim}
            onChange={(e) => atualizar({ anoFim: e.target.value })}
            className="w-32 border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="regiao" className="meta mb-2 block text-chumbo-lt">
          Região (opcional)
        </label>
        <input
          id="regiao"
          value={estado.regiao}
          onChange={(e) => atualizar({ regiao: e.target.value })}
          className="w-full max-w-sm border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="serie" className="meta mb-2 block text-chumbo-lt">
          Série (opcional)
        </label>
        <select
          id="serie"
          value={estado.serie}
          onChange={(e) => atualizar({ serie: e.target.value })}
          className="w-full max-w-sm border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        >
          <option value="">Nenhuma</option>
          {series.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button
          type="button"
          disabled={!podeAvancar}
          onClick={onAvancar}
          className="border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="meta text-ouro">Próximo — Conteúdo</span>
        </button>
        {!podeAvancar && (
          <p className="mt-2 font-serif text-xs text-chumbo-lt">
            Título, período e ano de início são obrigatórios.
          </p>
        )}
      </div>
    </div>
  );
}
