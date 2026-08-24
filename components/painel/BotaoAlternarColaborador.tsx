"use client";

import { useTransition } from "react";
import { alternarColaboradorAction } from "@/app/painel/(protegido)/colaboradores/actions";

export function BotaoAlternarColaborador({
  id,
  ativo,
}: {
  id: string;
  ativo: boolean;
}) {
  const [pendente, iniciar] = useTransition();

  return (
    <button
      type="button"
      disabled={pendente}
      onClick={() =>
        iniciar(async () => {
          await alternarColaboradorAction(id, !ativo);
        })
      }
      className={`meta border px-3 py-1.5 disabled:opacity-50 ${
        ativo
          ? "border-borda text-chumbo hover:border-lacre hover:text-lacre"
          : "border-lacre text-lacre"
      }`}
    >
      {pendente ? "…" : ativo ? "Desativar" : "Reativar"}
    </button>
  );
}
