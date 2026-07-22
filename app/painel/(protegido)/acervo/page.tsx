import Link from "next/link";
import { getTodosAcervoDocumentos } from "@/lib/acervo";
import { getPeriodo } from "@/data/periodos";

export default function AcervoPainelPage() {
  const documentos = getTodosAcervoDocumentos();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="meta text-lacre">Painel</p>
          <h1 className="mt-3 font-display text-3xl text-ink">
            Acervo documental
          </h1>
        </div>
        <Link
          href="/painel/acervo/novo"
          className="border border-ink bg-ink px-5 py-2.5 text-ouro hover:bg-lacre hover:border-lacre"
        >
          <span className="meta text-ouro">Novo item</span>
        </Link>
      </div>

      <p className="mt-4 font-serif text-sm text-chumbo-lt">
        Itens são arquivos MDX publicados via commit no GitHub — a Vercel
        observa o repo e o deploy acontece sozinho depois do push.
      </p>

      <div className="mt-10 flex flex-col gap-3">
        {documentos.length === 0 && (
          <p className="meta text-chumbo-lt">Nenhum documento ainda.</p>
        )}
        {documentos.map((doc) => (
          <Link
            key={doc.slug}
            href={`/painel/acervo/${doc.slug}`}
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
        ))}
      </div>
    </div>
  );
}
