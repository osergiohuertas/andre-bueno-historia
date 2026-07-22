import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ContaDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: membro } = user
    ? await supabase.from("membros").select("nome").eq("id", user.id).single()
    : { data: null };

  return (
    <div>
      <p className="meta text-lacre">Comunidade</p>
      <h1 className="mt-3 font-display text-3xl text-ink">
        Olá, {membro?.nome ?? "leitor"}
      </h1>

      <div className="mt-10 grid gap-px border border-borda bg-borda sm:grid-cols-2">
        <Link
          href="/conta/biblioteca"
          className="flex flex-col gap-2 bg-paper p-8 hover:bg-paper-mid"
        >
          <h2 className="font-display text-xl text-ink">Biblioteca</h2>
          <p className="font-serif text-sm text-chumbo">
            Artigos salvos e marcados como lidos.
          </p>
        </Link>
        <Link
          href="/conta/configuracoes"
          className="flex flex-col gap-2 bg-paper p-8 hover:bg-paper-mid"
        >
          <h2 className="font-display text-xl text-ink">Configurações</h2>
          <p className="font-serif text-sm text-chumbo">
            Exportar seus dados ou excluir a conta.
          </p>
        </Link>
      </div>
    </div>
  );
}
