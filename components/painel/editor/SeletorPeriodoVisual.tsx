"use client";

import { periodosOrdenados, PERIODOS, type PeriodoId } from "@/data/periodos";

const ANO_MIN_VISUAL = 1300;
// Brasil Republicano não tem fim declarado ("até a atualidade") — a régua
// precisa de um teto concreto pra desenhar a última faixa, então usa o ano
// corrente em vez de um valor fixo que ficaria desatualizado.
const ANO_MAX_VISUAL = new Date().getFullYear();

export function SeletorPeriodoVisual({
  periodoSelecionado,
  periodosSecundarios,
  contagens,
  onSelecionarPrincipal,
  onAlternarSecundario,
}: {
  periodoSelecionado: PeriodoId | null;
  periodosSecundarios: PeriodoId[];
  contagens: Partial<Record<PeriodoId, number>>;
  onSelecionarPrincipal: (id: PeriodoId) => void;
  onAlternarSecundario: (id: PeriodoId) => void;
}) {
  const ordem = periodosOrdenados();
  const spanTotal = ANO_MAX_VISUAL - ANO_MIN_VISUAL;
  const transversal = PERIODOS.find((p) => p.id === "transversal")!;

  return (
    <div>
      <p className="meta mb-1 text-chumbo-lt">Período — clique para escolher</p>
      <p className="mb-3 font-serif text-xs text-chumbo-lt">
        A régua mostra os 4 períodos em escala, com quantos artigos você já
        tem em cada um. Lacunas ficam visíveis de propósito.
      </p>

      <div className="flex h-20 w-full border border-borda" role="group" aria-label="Régua temporal de períodos">
        {ordem.map((p) => {
          const inicioEfetivo = p.inicio ?? ANO_MIN_VISUAL;
          const fim = p.fim ?? ANO_MAX_VISUAL;
          const largura = ((fim - inicioEfetivo) / spanTotal) * 100;
          const contagem = contagens[p.id] ?? 0;
          const ativo = periodoSelecionado === p.id;
          const vazio = contagem === 0;

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelecionarPrincipal(p.id)}
              style={{ width: `${largura}%` }}
              aria-pressed={ativo}
              className={`flex flex-col items-center justify-end gap-1 border-r border-borda p-1 pb-2 text-center transition-colors last:border-r-0 ${
                ativo
                  ? "bg-lacre text-ouro"
                  : vazio
                    ? "bg-paper-mid text-chumbo-lt hover:bg-borda"
                    : "bg-paper text-ink hover:bg-paper-mid"
              }`}
              title={p.label}
            >
              <span className="meta text-[10px] leading-none">
                {contagem || "—"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-1 flex w-full text-[9px] text-chumbo-lt">
        {ordem.map((p) => {
          const inicioEfetivo = p.inicio ?? ANO_MIN_VISUAL;
          const fim = p.fim ?? ANO_MAX_VISUAL;
          const largura = ((fim - inicioEfetivo) / spanTotal) * 100;
          return (
            <span
              key={p.id}
              style={{ width: `${largura}%` }}
              className="truncate px-0.5"
            >
              {p.label}
            </span>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onSelecionarPrincipal("transversal")}
        aria-pressed={periodoSelecionado === "transversal"}
        className={`meta mt-4 inline-flex border px-3 py-1.5 ${
          periodoSelecionado === "transversal"
            ? "border-lacre bg-lacre text-ouro"
            : "border-borda text-chumbo hover:border-lacre"
        }`}
      >
        {transversal.label} ({contagens.transversal ?? 0})
      </button>

      <div className="mt-6">
        <p className="meta mb-2 text-chumbo-lt">
          Períodos secundários (opcional)
        </p>
        <div className="flex flex-wrap gap-2">
          {[...ordem, transversal]
            .filter((p) => p.id !== periodoSelecionado)
            .map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onAlternarSecundario(p.id)}
                aria-pressed={periodosSecundarios.includes(p.id)}
                className={`meta border px-2 py-1 text-[10px] ${
                  periodosSecundarios.includes(p.id)
                    ? "border-ouro bg-ouro/20 text-ink"
                    : "border-borda text-chumbo-lt hover:border-ouro"
                }`}
              >
                {p.label}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
