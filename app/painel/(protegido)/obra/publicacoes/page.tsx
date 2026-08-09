import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ListaFiltravel } from "@/components/painel/ListaFiltravel";

const TIPOS_VALIDOS = [
  "livro",
  "artigo_academico",
  "capitulo",
  "ensaio",
] as const;

type Tipo = (typeof TIPOS_VALIDOS)[number];

const LABEL_TIPO: Record<Tipo, string> = {
  livro: "Livro",
  artigo_academico: "Artigo acadêmico",
  capitulo: "Capítulo",
  ensaio: "Ensaio",
};

export default async function PublicacoesPainelPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo: tipoParam } = await searchParams;
  const tipo = TIPOS_VALIDOS.find((t) => t === tipoParam);
  const naoLivro = tipoParam === "nao-livro";

  const supabase = await createClient();
  let query = supabase.from("publicacoes").select("*").order("ano", { ascending: false });
  if (tipo) query = query.eq("tipo", tipo);
  if (naoLivro) query = query.neq("tipo", "livro");
  const { data: publicacoes } = await query;

  return (
    <div>
      <Link href="/painel/acervo" className="meta text-chumbo hover:text-lacre">
        ← Acervo
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Publicações</h1>
        <Link
          href="/painel/obra/publicacoes/nova"
          className="border border-ink bg-ink px-5 py-2.5 text-ouro hover:bg-lacre hover:border-lacre"
        >
          <span className="meta text-ouro">Nova publicação</span>
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/painel/obra/publicacoes"
          className={`meta border px-3 py-1.5 ${
            !tipo && !naoLivro
              ? "border-lacre bg-lacre text-ouro"
              : "border-borda text-chumbo hover:border-lacre"
          }`}
        >
          Todos
        </Link>
        {TIPOS_VALIDOS.map((t) => (
          <Link
            key={t}
            href={`/painel/obra/publicacoes?tipo=${t}`}
            className={`meta border px-3 py-1.5 ${
              tipo === t
                ? "border-lacre bg-lacre text-ouro"
                : "border-borda text-chumbo hover:border-lacre"
            }`}
          >
            {LABEL_TIPO[t]}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <ListaFiltravel
          mensagemVazia={
            tipo
              ? `Nenhuma publicação do tipo "${LABEL_TIPO[tipo]}" com essa busca.`
              : naoLivro
                ? "Nenhuma publicação (fora livros) com essa busca."
                : "Nada encontrado com essa busca."
          }
          itens={(publicacoes ?? []).map((publicacao) => ({
            chave: publicacao.id,
            busca: publicacao.titulo,
            node: (
              <Link
                href={`/painel/obra/publicacoes/${publicacao.id}`}
                className="flex items-center justify-between border border-borda p-6 hover:border-lacre"
              >
                <div>
                  <p className="meta text-chumbo-lt">
                    {LABEL_TIPO[publicacao.tipo as Tipo] ?? publicacao.tipo} ·{" "}
                    {publicacao.ano}
                  </p>
                  <p className="mt-1 font-display text-xl text-ink">
                    {publicacao.titulo}
                  </p>
                </div>
                <span className="meta text-chumbo-lt">
                  {publicacao.capa ? "Com capa" : "Sem capa"} ·{" "}
                  {publicacao.link ? "Com link" : "Sem link"} ·{" "}
                  {publicacao.publicado ? "Publicada" : "Rascunho"}
                </span>
              </Link>
            ),
          }))}
        />
      </div>
    </div>
  );
}
