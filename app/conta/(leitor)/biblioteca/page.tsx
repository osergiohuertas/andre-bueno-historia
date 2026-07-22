import Link from "next/link";
import { redirect } from "next/navigation";
import { getLeitorAtual } from "@/lib/leitor";
import { getBibliotecaDoMembro } from "@/lib/biblioteca";
import { getArtigoBySlug } from "@/lib/artigos";
import { formatarData } from "@/lib/format";

export default async function BibliotecaPage() {
  const leitor = await getLeitorAtual();
  if (!leitor) redirect("/conta/entrar");

  const itens = await getBibliotecaDoMembro(leitor.id);
  const comArtigo = itens
    .map((item) => ({ item, artigo: getArtigoBySlug(item.artigoSlug) }))
    .filter((x): x is { item: (typeof itens)[number]; artigo: NonNullable<ReturnType<typeof getArtigoBySlug>> } => !!x.artigo);

  return (
    <div>
      <p className="meta text-lacre">Comunidade</p>
      <h1 className="mt-3 font-display text-3xl text-ink">Biblioteca</h1>

      {comArtigo.length === 0 ? (
        <p className="mt-10 meta text-chumbo-lt">
          Nenhum artigo salvo ainda.{" "}
          <Link href="/artigos" className="text-lacre underline">
            Explorar artigos
          </Link>
        </p>
      ) : (
        <div className="mt-10 flex flex-col gap-3">
          {comArtigo.map(({ item, artigo }) => (
            <Link
              key={item.artigoSlug}
              href={artigo.url}
              className="flex items-center justify-between border border-borda p-6 hover:border-lacre"
            >
              <div>
                <p className="meta text-chumbo-lt">
                  {formatarData(artigo.data)}
                </p>
                <p className="mt-1 font-display text-xl text-ink">
                  {artigo.titulo}
                </p>
              </div>
              <div className="flex gap-2">
                {item.salvo && (
                  <span className="meta border border-lacre px-2 py-1 text-lacre">
                    Salvo
                  </span>
                )}
                {item.lido && (
                  <span className="meta border border-ink px-2 py-1 text-ink">
                    Lido
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
