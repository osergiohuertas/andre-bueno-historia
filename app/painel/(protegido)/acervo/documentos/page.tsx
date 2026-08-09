import Link from "next/link";
import { getTodosAcervoDocumentos } from "@/lib/acervo";
import { getPeriodo } from "@/data/periodos";
import { ListaFiltravel } from "@/components/painel/ListaFiltravel";

export default function AcervoDocumentosPainelPage() {
  const documentos = getTodosAcervoDocumentos();

  return (
    <div>
      <Link href="/painel/acervo" className="meta text-chumbo hover:text-lacre">
        ← Acervo
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">
          Trabalhos técnicos desenvolvidos
        </h1>
        <Link
          href="/painel/acervo/documentos/novo"
          className="border border-ink bg-ink px-5 py-2.5 text-ouro hover:bg-lacre hover:border-lacre"
        >
          <span className="meta text-ouro">Novo item</span>
        </Link>
      </div>

      <p className="mt-4 font-serif text-sm text-chumbo-lt">
        Itens são arquivos MDX publicados via commit no GitHub — a Vercel
        observa o repo e o deploy acontece sozinho depois do push.
      </p>

      <div className="mt-10">
        <ListaFiltravel
          itens={documentos.map((doc) => ({
            chave: doc.slug,
            busca: doc.titulo,
            node: (
              <Link
                href={`/painel/acervo/documentos/${doc.slug}`}
                className="flex items-center justify-between border border-borda p-6 hover:border-lacre"
              >
                <div>
                  <p className="meta text-chumbo-lt">
                    {getPeriodo(doc.periodo).label}
                  </p>
                  <p className="mt-1 font-display text-xl text-ink">
                    {doc.titulo}
                  </p>
                </div>
                <span className="meta text-chumbo-lt">
                  {doc.imagemCapa ? "Com imagem" : "Sem imagem"} ·{" "}
                  {doc.publicado ? "Publicado" : "Rascunho"}
                </span>
              </Link>
            ),
          }))}
        />
      </div>
    </div>
  );
}
