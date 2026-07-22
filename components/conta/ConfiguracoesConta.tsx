"use client";

import { useState, useTransition } from "react";
import {
  exportarMeusDados,
  excluirMinhaConta,
} from "@/lib/conta-actions";

export function ConfiguracoesConta() {
  const [exportando, iniciarExportacao] = useTransition();
  const [excluindo, iniciarExclusao] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState(false);

  function aoExportar() {
    setErro(null);
    iniciarExportacao(async () => {
      const resultado = await exportarMeusDados();
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }

      const blob = new Blob([JSON.stringify(resultado.dados, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "meus-dados.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  function aoExcluir() {
    setErro(null);
    iniciarExclusao(async () => {
      const resultado = await excluirMinhaConta();
      if (resultado && !resultado.ok) {
        setErro(resultado.erro);
      }
    });
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="border border-borda p-6">
        <h2 className="font-display text-xl text-ink">Exportar meus dados</h2>
        <p className="mt-2 font-serif text-sm text-chumbo">
          Baixe tudo que temos sobre você — perfil, biblioteca e séries
          seguidas — num arquivo JSON.
        </p>
        <button
          type="button"
          onClick={aoExportar}
          disabled={exportando}
          className="mt-4 border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre disabled:opacity-50"
        >
          <span className="meta text-ouro">
            {exportando ? "Gerando…" : "Baixar meus dados"}
          </span>
        </button>
      </div>

      <div className="border border-lacre p-6">
        <h2 className="font-display text-xl text-lacre">Excluir conta</h2>
        <p className="mt-2 font-serif text-sm text-chumbo">
          Isso apaga sua conta, biblioteca e séries seguidas — de verdade,
          sem volta.
        </p>

        {!confirmando ? (
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            className="group mt-4 border border-lacre px-6 py-3 transition-colors hover:bg-lacre"
          >
            <span className="meta text-lacre group-hover:text-ouro">
              Quero excluir minha conta
            </span>
          </button>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="font-serif text-sm text-ink">Tem certeza?</p>
            <button
              type="button"
              onClick={aoExcluir}
              disabled={excluindo}
              className="border border-lacre bg-lacre px-6 py-3 text-ouro transition-colors hover:bg-ink hover:border-ink disabled:opacity-50"
            >
              <span className="meta text-ouro">
                {excluindo ? "Excluindo…" : "Sim, excluir de verdade"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              className="border border-borda px-6 py-3 text-chumbo hover:border-ink"
            >
              <span className="meta">Cancelar</span>
            </button>
          </div>
        )}

        {erro && <p className="mt-3 font-serif text-sm text-lacre">{erro}</p>}
      </div>
    </div>
  );
}
