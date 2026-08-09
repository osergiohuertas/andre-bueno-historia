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
  historico: Record<string, string>;
}) {
  const [estado, formAction, pendente] = useActionState(
    salvarGrupo.bind(null, grupo),
    null,
  );
  const [sujo, setSujo] = useState(false);
  useAvisoSairSemSalvar(sujo);

  // Ajusta `sujo` durante o render (não em efeito nem ref) quando `estado`
  // muda pra sucesso — padrão do React pra "resetar estado quando algo
  // muda" sem o round-trip extra de um useEffect.
  const [estadoAnterior, setEstadoAnterior] = useState(estado);
  if (estadoAnterior !== estado) {
    setEstadoAnterior(estado);
    if (estado?.ok && sujo) setSujo(false);
  }

  return (
    <form
      action={formAction}
      onChange={() => setSujo(true)}
      onSubmit={(e) => {
        if (!window.confirm("Salvar as alterações deste grupo?")) {
          e.preventDefault();
        }
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
          {historico[campo.chave] !== undefined && (
            <ReverterCampo
              chave={campo.chave}
              valorAnterior={historico[campo.chave]}
            />
          )}
        </div>
      ))}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pendente}
          className="border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre disabled:opacity-50"
        >
          <span className="meta text-ouro">{pendente ? "Salvando…" : "Salvar"}</span>
        </button>
        {sujo && !pendente && (
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
