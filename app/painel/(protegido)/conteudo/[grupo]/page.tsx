import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FormularioGrupo } from "@/components/painel/FormularioGrupo";

const NOMES_GRUPO: Record<string, string> = {
  identidade: "Identidade",
  home: "Home",
  sobre: "Sobre",
  livro: "Livro",
  rodape: "Rodapé",
  seo: "SEO",
};

export default async function GrupoPage({
  params,
}: {
  params: Promise<{ grupo: string }>;
}) {
  const { grupo } = await params;
  if (!(grupo in NOMES_GRUPO)) notFound();

  const supabase = await createClient();

  const { data: campos } = await supabase
    .from("site_config")
    .select("*")
    .eq("grupo", grupo)
    .order("chave");

  if (!campos || campos.length === 0) {
    return (
      <div>
        <Link href="/painel/conteudo" className="meta text-chumbo hover:text-lacre">
          ← Conteúdo
        </Link>
        <p className="meta mt-6 text-chumbo-lt">
          Nenhum campo neste grupo ainda. Rode o seed
          (supabase/seed.sql) no Supabase.
        </p>
      </div>
    );
  }

  const { data: historicoBruto } = await supabase
    .from("site_config_history")
    .select("chave, valor_anterior, alterado_em")
    .in(
      "chave",
      campos.map((c) => c.chave),
    )
    .order("alterado_em", { ascending: false });

  // Até 5 versões anteriores por campo — a query já vem ordenada por mais
  // recente primeiro (`alterado_em desc`), então só limitar o tamanho.
  const historico: Record<string, { valor: string; alteradoEm: string }[]> = {};
  for (const linha of historicoBruto ?? []) {
    const lista = historico[linha.chave] ?? [];
    if (lista.length < 5) {
      lista.push({ valor: linha.valor_anterior, alteradoEm: linha.alterado_em });
      historico[linha.chave] = lista;
    }
  }

  return (
    <div>
      <Link href="/painel/conteudo" className="meta text-chumbo hover:text-lacre">
        ← Conteúdo
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">
        {NOMES_GRUPO[grupo]}
      </h1>

      <FormularioGrupo grupo={grupo} campos={campos} historico={historico} />
    </div>
  );
}
