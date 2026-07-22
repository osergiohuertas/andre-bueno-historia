"use client";

import { useState } from "react";
import Link from "next/link";
import type { Evento } from "@/lib/eventos";
import { EventoCard } from "@/components/eventos/EventoCard";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function agruparPorMes(eventos: Evento[]): { chave: string; label: string; eventos: Evento[] }[] {
  const grupos = new Map<string, Evento[]>();

  for (const evento of eventos) {
    const data = new Date(evento.dataInicio);
    const chave = `${data.getFullYear()}-${String(data.getMonth()).padStart(2, "0")}`;
    if (!grupos.has(chave)) grupos.set(chave, []);
    grupos.get(chave)!.push(evento);
  }

  return Array.from(grupos.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([chave, eventosDoMes]) => {
      const [ano, mes] = chave.split("-").map(Number);
      const label = new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
      }).format(new Date(ano, mes, 1));
      return { chave, label, eventos: eventosDoMes };
    });
}

function GradeMes({ mes, eventos }: { mes: { ano: number; mes: number }; eventos: Evento[] }) {
  const primeiroDia = new Date(mes.ano, mes.mes, 1);
  const diasNoMes = new Date(mes.ano, mes.mes + 1, 0).getDate();
  const offset = primeiroDia.getDay();

  const eventosPorDia = new Map<number, Evento[]>();
  for (const evento of eventos) {
    const dia = new Date(evento.dataInicio).getDate();
    if (!eventosPorDia.has(dia)) eventosPorDia.set(dia, []);
    eventosPorDia.get(dia)!.push(evento);
  }

  const celulas = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: diasNoMes }, (_, i) => i + 1),
  ];

  return (
    <div className="border border-borda">
      <div className="grid grid-cols-7 border-b border-borda bg-paper-mid">
        {DIAS_SEMANA.map((dia) => (
          <div key={dia} className="meta p-2 text-center text-chumbo-lt">
            {dia}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {celulas.map((dia, i) => (
          <div
            key={i}
            className="flex min-h-24 flex-col gap-1 border-b border-r border-borda p-1.5 last:border-r-0 [&:nth-child(7n)]:border-r-0"
          >
            {dia && (
              <>
                <span className="meta text-chumbo-lt">{dia}</span>
                {(eventosPorDia.get(dia) ?? []).map((evento) => (
                  <Link
                    key={evento.slug}
                    href={`/eventos/${evento.slug}`}
                    className={`truncate px-1.5 py-1 text-[10px] leading-tight ${
                      evento.participacao === "com_andre"
                        ? "border-l-2 border-lacre bg-paper-mid text-ink"
                        : "bg-paper-mid text-chumbo"
                    }`}
                  >
                    {evento.titulo}
                  </Link>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AlternadorVisualizacao({ eventos }: { eventos: Evento[] }) {
  const [visualizacao, setVisualizacao] = useState<"lista" | "grade">("lista");
  const meses = agruparPorMes(eventos);

  return (
    <div>
      <div className="mb-8 hidden items-center gap-2 md:flex">
        <button
          type="button"
          onClick={() => setVisualizacao("lista")}
          aria-pressed={visualizacao === "lista"}
          className={`meta border px-4 py-2 ${
            visualizacao === "lista"
              ? "border-ink bg-ink text-ouro"
              : "border-borda text-chumbo hover:border-lacre"
          }`}
        >
          Lista
        </button>
        <button
          type="button"
          onClick={() => setVisualizacao("grade")}
          aria-pressed={visualizacao === "grade"}
          className={`meta border px-4 py-2 ${
            visualizacao === "grade"
              ? "border-ink bg-ink text-ouro"
              : "border-borda text-chumbo hover:border-lacre"
          }`}
        >
          Grade mensal
        </button>
      </div>

      {eventos.length === 0 ? (
        <p className="meta text-chumbo-lt">Nenhum evento encontrado.</p>
      ) : visualizacao === "grade" ? (
        <div className="hidden flex-col gap-10 md:flex">
          {meses.map(({ chave, label, eventos: eventosDoMes }) => {
            const [ano, mes] = chave.split("-").map(Number);
            return (
              <div key={chave}>
                <p className="meta mb-3 text-lacre capitalize">{label}</p>
                <GradeMes mes={{ ano, mes }} eventos={eventosDoMes} />
              </div>
            );
          })}
        </div>
      ) : null}

      {visualizacao === "lista" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {eventos.map((evento) => (
            <EventoCard key={evento.slug} evento={evento} />
          ))}
        </div>
      )}
    </div>
  );
}
