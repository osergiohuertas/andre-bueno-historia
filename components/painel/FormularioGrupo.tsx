"use client";

import { useActionState, useState } from "react";
import { salvarGrupo } from "@/app/painel/(protegido)/conteudo/actions";
import { Campo } from "@/components/painel/Campo";
import { CampoTextoRico } from "@/components/painel/CampoTextoRico";
import { ReverterCampo } from "@/components/painel/ReverterCampo";
import { useAvisoSairSemSalvar } from "@/lib/hooks/useAvisoSairSemSalvar";
import type { Database } from "@/types/supabase";

type LinhaConfig = Database["public"]["Tables"]["site_config"]["Row"];

export function FormularioGrupo({
  grupo,
  campos,
  historico,
}: {
  grupo: string;
  campos: LinhaConfig[];
  historico: Record<string, { valor: string; alteradoEm: string }[]>;
}) {
  const [estado, formAction, pendente] = useActionState(
    salvarGrupo.bind(null, grupo),
    null,
  );
  const [sujo, setSujo] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  useAvisoSairSemSalvar(sujo);

  // Ajusta `sujo`/`confirmando` durante o render (não em efeito nem ref)
  // quando `estado` muda pra sucesso — padrão do React pra "resetar estado
  // quando algo muda" sem o round-trip extra de um useEffect.
  const [estadoAnterior, setEstadoAnterior] = useState(estado);
  if (estadoAnterior !== estado) {
    setEstadoAnterior(estado);
    if (estado?.ok) {
      if (sujo) setSujo(false);
      if (confirmando) setConfirmando(false);
    }
  }

  return (
    <form
      action={formAction}
      onChange={() => {
        setSujo(true);
        setConfirmando(false);
      }}
      className="mt-8 flex flex-col gap-10"
    >
      {campos.map((campo) => (
        <div key={campo.chave} className="border-b border-borda pb-8">
          {campo.tipo === "texto_rico" ? (
            <CampoTextoRico campo={campo} />
          ) : (
            <Campo campo={campo} />
          )}
          {historico[campo.chave] && historico[campo.chave].length > 0 && (
            <ReverterCampo
              chave={campo.chave}
              versoes={historico[campo.chave]}
            />
          )}
        </div>
      ))}

      <div className="flex items-center gap-4">
        {!confirmando ? (
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            disabled={pendente}
            className="border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre disabled:opacity-50"
          >
            <span className="meta text-ouro">Salvar</span>
          </button>
        ) : (
          <>
            <button
              type="submit"
              disabled={pendente}
              className="border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre disabled:opacity-50"
            >
              <span className="meta text-ouro">
                {pendente ? "Salvando…" : "Confirmar e salvar"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              disabled={pendente}
              className="meta text-chumbo-lt hover:text-ink"
            >
              Cancelar
            </button>
          </>
        )}
        {sujo && !pendente && !confirmando && (
          <p className="meta text-ouro">Alterações não salvas</p>
        )}
        {estado && (
          <p
            className={`meta ${estado.ok ? "text-chumbo" : "text-lacre"}`}
            role="status"
          >
            {estado.mensagem}
          </p>
        )}
      </div>
    </form>
  );
}
