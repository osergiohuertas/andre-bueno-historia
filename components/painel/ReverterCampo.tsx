"use client";

import { useState, useTransition } from "react";
import { reverterCampo } from "@/app/painel/(protegido)/conteudo/actions";

function formatarData(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function truncar(texto: string, max = 60): string {
  return texto.length > max ? `${texto.slice(0, max)}…` : texto;
}

/**
 * Reverter é uma escrita real no site (pode sobrescrever o texto do hero
 * da home, por exemplo) — antes tinha menos fricção que apagar qualquer
 * outro item do painel (um clique só, sem confirmar). Agora pede
 * confirmação como o resto, e mostra até 5 versões anteriores em vez de
 * só a mais recente.
 */
export function ReverterCampo({
  chave,
  versoes,
}: {
  chave: string;
  versoes: { valor: string; alteradoEm: string }[];
}) {
  const [expandido, setExpandido] = useState(false);
  const [confirmandoIdx, setConfirmandoIdx] = useState<number | null>(null);
  const [pendente, iniciar] = useTransition();

  function reverter(valor: string) {
    iniciar(async () => {
      await reverterCampo(chave, valor);
      setConfirmandoIdx(null);
    });
  }

  const [maisRecente, ...anteriores] = versoes;

  return (
    <div className="mt-1">
      <VersaoLinha
        versao={maisRecente}
        confirmando={confirmandoIdx === 0}
        pendente={pendente}
        onPedirConfirmacao={() => setConfirmandoIdx(0)}
        onCancelar={() => setConfirmandoIdx(null)}
        onConfirmar={() => reverter(maisRecente.valor)}
      />

      {anteriores.length > 0 && (
        <>
          {!expandido ? (
            <button
              type="button"
              onClick={() => setExpandido(true)}
              className="meta mt-1 text-chumbo-lt hover:text-lacre"
            >
              Ver mais {anteriores.length}{" "}
              {anteriores.length === 1 ? "versão anterior" : "versões anteriores"}
            </button>
          ) : (
            <div className="mt-1 flex flex-col gap-1 border-l border-borda pl-3">
              {anteriores.map((versao, i) => (
                <VersaoLinha
                  key={i}
                  versao={versao}
                  confirmando={confirmandoIdx === i + 1}
                  pendente={pendente}
                  onPedirConfirmacao={() => setConfirmandoIdx(i + 1)}
                  onCancelar={() => setConfirmandoIdx(null)}
                  onConfirmar={() => reverter(versao.valor)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function VersaoLinha({
  versao,
  confirmando,
  pendente,
  onPedirConfirmacao,
  onCancelar,
  onConfirmar,
}: {
  versao: { valor: string; alteradoEm: string };
  confirmando: boolean;
  pendente: boolean;
  onPedirConfirmacao: () => void;
  onCancelar: () => void;
  onConfirmar: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <p className="truncate font-serif text-xs text-chumbo-lt">
        {formatarData(versao.alteradoEm)}: &ldquo;{truncar(versao.valor)}&rdquo;
      </p>
      {!confirmando ? (
        <button
          type="button"
          onClick={onPedirConfirmacao}
          className="meta shrink-0 text-lacre hover:underline"
        >
          Reverter
        </button>
      ) : (
        <span className="flex shrink-0 items-center gap-2">
          <span className="meta text-chumbo">Confirmar?</span>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={pendente}
            className="meta text-lacre hover:underline disabled:opacity-50"
          >
            {pendente ? "Revertendo…" : "Sim"}
          </button>
          <button
            type="button"
            onClick={onCancelar}
            disabled={pendente}
            className="meta text-chumbo-lt hover:text-ink"
          >
            Cancelar
          </button>
        </span>
      )}
    </div>
  );
}
