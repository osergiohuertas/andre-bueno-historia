import { createAdminClient } from "@/lib/supabase/admin";
import { formatarData } from "@/lib/format";
import { FormularioConvite } from "@/components/painel/FormularioConvite";
import { BotaoAlternarColaborador } from "@/components/painel/BotaoAlternarColaborador";

export const revalidate = 0;

export default async function ColaboradoresPage() {
  const admin = createAdminClient();
  const { data: colaboradores } = await admin
    .from("colaboradores")
    .select("*")
    .order("criado_em", { ascending: false });

  return (
    <div>
      <p className="meta text-lacre">Painel</p>
      <h1 className="mt-3 font-display text-3xl text-ink">Colaboradores</h1>
      <p className="mt-4 max-w-prose font-serif text-chumbo">
        Convide outros historiadores pra escrever no site. Um colaborador só
        publica e edita os próprios artigos — nada mais do painel fica
        acessível pra ele.
      </p>

      <div className="mt-8">
        <FormularioConvite />
      </div>

      <div className="mt-10 flex flex-col gap-3">
        {(colaboradores ?? []).length === 0 && (
          <p className="meta text-chumbo-lt">Nenhum colaborador convidado ainda.</p>
        )}
        {(colaboradores ?? []).map((colaborador) => (
          <div
            key={colaborador.id}
            className="flex items-center justify-between border border-borda p-6"
          >
            <div>
              <p className="font-display text-xl text-ink">{colaborador.nome}</p>
              <p className="meta mt-1 text-chumbo-lt">
                {colaborador.email} · convidado em{" "}
                {formatarData(colaborador.criado_em)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="meta text-chumbo-lt">
                {colaborador.ativo ? "Ativo" : "Desativado"}
              </span>
              <BotaoAlternarColaborador
                id={colaborador.id}
                ativo={colaborador.ativo}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
