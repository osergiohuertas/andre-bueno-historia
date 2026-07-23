"use client";

import { useState, useTransition } from "react";

/**
 * Botão de apagar com confirmação inline (sem window.confirm, que foge do
 * visual do painel). A action passada é chamada dentro de useTransition —
 * se ela fizer redirect() no sucesso (padrão do painel), a navegação
 * acontece sozinha; se retornar {ok:false, mensagem}, mostra o erro aqui.
 */
export function ConfirmarExclusao({
  action,
  label = "Apagar",
}: {
  action: () => Promise<{ ok: boolean; mensagem: string } | void>;
  label?: string;
}) {
  const [confirmando, setConfirmando] = useState(false);
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function apagar() {
    setErro(null);
    iniciar(async () => {
      const resultado = await action();
      if (resultado && !resultado.ok) {
        setErro(resultado.mensagem);
        setConfirmando(false);
      }
    });
  }

  if (!confirmando) {
    return (
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className="meta text-lacre hover:underline"
      >
        {label}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-3">
        <span className="meta text-chumbo">Confirmar apagar?</span>
        <button
          type="button"
          onClick={apagar}
          disabled={pendente}
          className="meta border border-lacre bg-lacre px-3 py-1.5 text-paper disabled:opacity-50"
        >
          {pendente ? "Apagando…" : "Sim, apagar"}
        </button>
        <button
          type="button"
          onClick={() => setConfirmando(false)}
          disabled={pendente}
          className="meta text-chumbo-lt hover:text-ink"
        >
          Cancelar
        </button>
      </div>
      {erro && <p className="font-serif text-xs text-lacre">{erro}</p>}
    </div>
  );
}
