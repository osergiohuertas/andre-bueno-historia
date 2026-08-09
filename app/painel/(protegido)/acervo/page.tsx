import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTodosAcervoDocumentos } from "@/lib/acervo";

export default async function AcervoPainelPage() {
  const supabase = await createClient();
  const [
    { count: livros },
    { count: publicacoes },
    { count: videos },
    { count: fotos },
  ] = await Promise.all([
    supabase
      .from("publicacoes")
      .select("*", { count: "exact", head: true })
      .eq("tipo", "livro"),
    supabase
      .from("publicacoes")
      .select("*", { count: "exact", head: true })
      .neq("tipo", "livro"),
    supabase
      .from("acervo_midia")
      .select("*", { count: "exact", head: true })
      .eq("tipo", "video"),
    supabase
      .from("acervo_midia")
      .select("*", { count: "exact", head: true })
      .eq("tipo", "foto"),
  ]);

  const documentos = getTodosAcervoDocumentos().length;

  const SECOES = [
    {
      href: "/painel/acervo/documentos",
      titulo: "Trabalhos técnicos",
      descricao: "Dados de cada trabalho e link para download.",
      contagem: documentos,
    },
    {
      href: "/painel/obra/publicacoes?tipo=livro",
      titulo: "Livros",
      descricao: "Catálogo completo de livros.",
      contagem: livros ?? 0,
    },
    {
      href: "/painel/obra/publicacoes?tipo=nao-livro",
      titulo: "Publicações",
      descricao: "Artigos acadêmicos, capítulos e ensaios.",
      contagem: publicacoes ?? 0,
    },
    {
      href: "/painel/obra/videos",
      titulo: "Vídeos",
      descricao: "Entrevistas, congressos e seminários.",
      contagem: videos ?? 0,
    },
    {
      href: "/painel/obra/fotos",
      titulo: "Fotos",
      descricao: "Galeria de registros públicos.",
      contagem: fotos ?? 0,
    },
  ];

  return (
    <div>
      <p className="meta text-lacre">Painel</p>
      <h1 className="mt-3 font-display text-3xl text-ink">Acervo</h1>
      <p className="mt-4 max-w-prose font-serif text-sm text-chumbo-lt">
        Tudo que aparece em /acervo no site: documentos originais, livros,
        publicações, vídeos e fotos. O Atlas não tem cadastro próprio — os
        pontos vêm de Artigos e Destinos.
      </p>

      <div className="mt-10 grid gap-px border border-borda bg-borda sm:grid-cols-2 lg:grid-cols-3">
        {SECOES.map((secao) => (
          <Link
            key={secao.titulo}
            href={secao.href}
            className="flex flex-col gap-2 bg-paper p-8 hover:bg-paper-mid"
          >
            <p className="meta text-chumbo-lt">{secao.contagem} itens</p>
            <h2 className="font-display text-xl text-ink">{secao.titulo}</h2>
            <p className="font-serif text-sm text-chumbo">
              {secao.descricao}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
