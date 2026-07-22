import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ObraPainelPage() {
  const supabase = await createClient();
  const [{ count: publicacoes }, { count: videos }, { count: fotos }] =
    await Promise.all([
      supabase
        .from("publicacoes")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("acervo_midia")
        .select("*", { count: "exact", head: true })
        .eq("tipo", "video"),
      supabase
        .from("acervo_midia")
        .select("*", { count: "exact", head: true })
        .eq("tipo", "foto"),
    ]);

  const SECOES = [
    {
      href: "/painel/obra/publicacoes",
      titulo: "Publicações",
      descricao: "Livros, artigos acadêmicos, capítulos e ensaios.",
      contagem: publicacoes ?? 0,
    },
    {
      href: "/painel/obra/videos",
      titulo: "Vídeos",
      descricao: "Entrevistas, congressos, simpósios e seminários.",
      contagem: videos ?? 0,
    },
    {
      href: "/painel/obra/fotos",
      titulo: "Fotos",
      descricao: "Galeria pública.",
      contagem: fotos ?? 0,
    },
  ];

  return (
    <div>
      <p className="meta text-lacre">Painel</p>
      <h1 className="mt-3 font-display text-3xl text-ink">Obra</h1>

      <div className="mt-10 grid gap-px border border-borda bg-borda sm:grid-cols-3">
        {SECOES.map((secao) => (
          <Link
            key={secao.href}
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
