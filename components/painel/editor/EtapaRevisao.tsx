"use client";

import { useMemo, useState, useTransition } from "react";
import { publicarArtigoAction } from "@/app/painel/(protegido)/novo-artigo/actions";
import { gerarSlug } from "@/lib/slug";
import { PERIODOS, type PeriodoId } from "@/data/periodos";
import type { EstadoArtigo } from "@/components/painel/editor/NovoArtigoWizard";

function labelPeriodo(id: PeriodoId | null): string {
  if (!id) return "—";
  return PERIODOS.find((p) => p.id === id)?.label ?? id;
}

function renderizarMdxSimples(mdx: string) {
  const blocos = mdx.trim().split(/\n{2,}/);
  return blocos.map((bloco, i) => {
    if (bloco.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-8 mb-3 font-display text-2xl text-ink">
          {bloco.replace(/^##\s+/, "")}
        </h2>
      );
    }
    return (
      <p key={i} className="mb-4 font-serif text-ink leading-relaxed">
        {bloco}
      </p>
    );
  });
}

export function EtapaRevisao({
  estado,
  atualizar,
  onVoltar,
}: {
  estado: EstadoArtigo;
  atualizar: (parcial: Partial<EstadoArtigo>) => void;
  onVoltar: () => void;
}) {
  const [tagsTexto, setTagsTexto] = useState(estado.tags.join(", "));
  const [publicando, iniciarPublicacao] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<{ url: string; slug: string } | null>(
    null,
  );

  const slugPreview = useMemo(
    () => gerarSlug(estado.titulo),
    [estado.titulo],
  );

  function publicar() {
    if (!estado.periodo) {
      setErro("Confirme o período antes de publicar.");
      return;
    }
    setErro(null);
    iniciarPublicacao(async () => {
      const tags = tagsTexto
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const resultado = await publicarArtigoAction({
        titulo: estado.titulo,
        periodo: estado.periodo!,
        periodosSecundarios: estado.periodosSecundarios,
        anoInicio: Number(estado.anoInicio),
        anoFim: estado.anoFim ? Number(estado.anoFim) : undefined,
        regiao: estado.regiao || undefined,
        serie: estado.serie || undefined,
        excerpt: estado.excerpt,
        tags,
        imagemCapa: estado.imagens[0]?.url,
        corpoMdx: estado.corpoMdx,
      });

      if (resultado.status !== "ok") {
        setErro(
          resultado.status === "erro"
            ? resultado.mensagem
            : "Falha inesperada ao publicar o artigo.",
        );
        return;
      }

      setSucesso({ url: resultado.url, slug: resultado.slug });
    });
  }

  if (sucesso) {
    return (
      <div className="border border-ink bg-paper-mid p-6">
        <p className="meta text-lacre">Publicado</p>
        <h2 className="mt-2 font-display text-xl text-ink">
          {estado.titulo}
        </h2>
        <p className="mt-2 font-serif text-sm text-chumbo">
          Commit enviado para o GitHub.{" "}
          <a
            href={sucesso.url}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-lacre"
          >
            Ver commit
          </a>
        </p>
        <p className="mt-1 font-serif text-xs text-chumbo-lt">
          Slug: {sucesso.slug}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <label htmlFor="titulo-rev" className="meta mb-2 block text-chumbo-lt">
          Título
        </label>
        <input
          id="titulo-rev"
          value={estado.titulo}
          onChange={(e) => atualizar({ titulo: e.target.value })}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
        <p className="mt-1 font-serif text-xs text-chumbo-lt">
          Slug: /{slugPreview}
        </p>
      </div>

      <div>
        <label htmlFor="excerpt" className="meta mb-2 block text-chumbo-lt">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={estado.excerpt}
          onChange={(e) => atualizar({ excerpt: e.target.value })}
          rows={2}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="metaDescription"
          className="meta mb-2 block text-chumbo-lt"
        >
          Meta description
        </label>
        <textarea
          id="metaDescription"
          value={estado.metaDescription}
          onChange={(e) => atualizar({ metaDescription: e.target.value })}
          rows={2}
          maxLength={160}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="tags" className="meta mb-2 block text-chumbo-lt">
          Tags (separadas por vírgula)
        </label>
        <input
          id="tags"
          value={tagsTexto}
          onChange={(e) => setTagsTexto(e.target.value)}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div className="border border-borda bg-paper-mid p-4">
        <p className="meta mb-3 text-chumbo-lt">Período</p>
        <p className="font-serif text-sm text-chumbo">
          <strong>{labelPeriodo(estado.periodo)}</strong>
        </p>
      </div>

      <div>
        <p className="meta mb-3 text-chumbo-lt">Prévia</p>
        <div className="prose-artigo border border-borda bg-paper p-6">
          {renderizarMdxSimples(estado.corpoMdx)}
        </div>
      </div>

      {erro && <p className="font-serif text-sm text-lacre">{erro}</p>}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onVoltar}
          className="border border-borda px-6 py-3 text-chumbo hover:border-lacre"
        >
          <span className="meta">← Conteúdo</span>
        </button>
        <button
          type="button"
          onClick={publicar}
          disabled={publicando}
          className="border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="meta text-ouro">
            {publicando ? "Publicando…" : "Publicar"}
          </span>
        </button>
      </div>
    </div>
  );
}
