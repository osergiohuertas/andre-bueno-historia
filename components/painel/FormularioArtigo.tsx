"use client";

import { useActionState, useRef, useState } from "react";
import { SeletorPeriodoVisual } from "@/components/painel/editor/SeletorPeriodoVisual";
import { uploadImagemAction } from "@/app/painel/(protegido)/novo-artigo/actions";
import type { EstadoArtigoEdicao } from "@/app/painel/(protegido)/artigos/actions";
import type { PeriodoId } from "@/data/periodos";

type ArtigoPreenchido = {
  slug: string;
  titulo: string;
  subtitulo?: string;
  periodo: PeriodoId;
  periodosSecundarios: PeriodoId[];
  anoInicio: number;
  anoFim?: number;
  regiao?: string;
  excerpt: string;
  tags: string[];
  serie?: string;
  serieOrdem?: number;
  imagemCapa?: string;
  conexaoLivro?: string;
  publicado: boolean;
  data: string;
  corpo: string;
};

export function FormularioArtigo({
  artigo,
  series,
  contagens,
  action,
}: {
  artigo?: ArtigoPreenchido;
  series: { slug: string; nome: string }[];
  contagens: Partial<Record<PeriodoId, number>>;
  action: (
    estado: EstadoArtigoEdicao,
    formData: FormData,
  ) => Promise<EstadoArtigoEdicao>;
}) {
  const [estado, formAction, pendente] = useActionState(action, null);
  const [periodo, setPeriodo] = useState<PeriodoId | null>(
    artigo?.periodo ?? null,
  );
  const [periodosSecundarios, setPeriodosSecundarios] = useState<PeriodoId[]>(
    artigo?.periodosSecundarios ?? [],
  );
  const [imagemCapa, setImagemCapa] = useState(artigo?.imagemCapa ?? "");
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [erroImagem, setErroImagem] = useState<string | null>(null);
  const inputArquivoRef = useRef<HTMLInputElement | null>(null);

  async function lidarComUpload(arquivo: File) {
    setEnviandoImagem(true);
    setErroImagem(null);
    const formData = new FormData();
    formData.append("arquivo", arquivo);
    const resultado = await uploadImagemAction(formData);
    setEnviandoImagem(false);

    if (!resultado.ok) {
      setErroImagem(resultado.erro);
      return;
    }
    setImagemCapa(resultado.url);
  }

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-6">
      <input type="hidden" name="periodo" value={periodo ?? ""} />
      <input
        type="hidden"
        name="periodosSecundarios"
        value={periodosSecundarios.join(",")}
      />
      <input type="hidden" name="imagemCapa" value={imagemCapa} />
      {artigo && (
        <>
          <input type="hidden" name="dataOriginal" value={artigo.data} />
          <input
            type="hidden"
            name="serieOriginal"
            value={artigo.serie ?? ""}
          />
          <input
            type="hidden"
            name="serieOrdemOriginal"
            value={artigo.serieOrdem ?? ""}
          />
        </>
      )}

      <div>
        <label htmlFor="titulo" className="meta mb-1 block text-chumbo-lt">
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          defaultValue={artigo?.titulo}
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="subtitulo" className="meta mb-1 block text-chumbo-lt">
          Subtítulo (opcional)
        </label>
        <input
          id="subtitulo"
          name="subtitulo"
          defaultValue={artigo?.subtitulo}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <SeletorPeriodoVisual
        periodoSelecionado={periodo}
        periodosSecundarios={periodosSecundarios}
        contagens={contagens}
        onSelecionarPrincipal={setPeriodo}
        onAlternarSecundario={(id) =>
          setPeriodosSecundarios((atual) =>
            atual.includes(id) ? atual.filter((p) => p !== id) : [...atual, id],
          )
        }
      />

      <div className="flex gap-6">
        <div>
          <label htmlFor="anoInicio" className="meta mb-1 block text-chumbo-lt">
            Ano início
          </label>
          <input
            id="anoInicio"
            name="anoInicio"
            type="number"
            defaultValue={artigo?.anoInicio}
            required
            className="w-32 border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="anoFim" className="meta mb-1 block text-chumbo-lt">
            Ano fim (opcional)
          </label>
          <input
            id="anoFim"
            name="anoFim"
            type="number"
            defaultValue={artigo?.anoFim}
            className="w-32 border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="regiao" className="meta mb-1 block text-chumbo-lt">
          Região (opcional)
        </label>
        <input
          id="regiao"
          name="regiao"
          defaultValue={artigo?.regiao}
          className="w-full max-w-sm border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="serie" className="meta mb-1 block text-chumbo-lt">
          Série (opcional)
        </label>
        <select
          id="serie"
          name="serie"
          defaultValue={artigo?.serie ?? ""}
          className="w-full max-w-sm border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        >
          <option value="">Nenhuma</option>
          {series.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="excerpt" className="meta mb-1 block text-chumbo-lt">
          Excerto
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={artigo?.excerpt}
          rows={3}
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="conexaoLivro"
          className="meta mb-1 block text-chumbo-lt"
        >
          Conexão com o livro (opcional)
        </label>
        <p className="mb-2 font-serif text-xs text-chumbo-lt">
          Preenchido, ativa o card de conexão com o livro no artigo.
        </p>
        <textarea
          id="conexaoLivro"
          name="conexaoLivro"
          defaultValue={artigo?.conexaoLivro}
          rows={2}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <p className="meta mb-1 text-chumbo-lt">Imagem de capa</p>
        <input
          ref={inputArquivoRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const arquivo = e.target.files?.[0];
            if (arquivo) lidarComUpload(arquivo);
            e.target.value = "";
          }}
        />

        {imagemCapa && (
          <div className="mb-3 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagemCapa}
              alt=""
              className="h-24 w-40 border border-borda object-cover"
            />
            <button
              type="button"
              onClick={() => setImagemCapa("")}
              className="meta text-chumbo hover:text-lacre"
            >
              Remover
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => inputArquivoRef.current?.click()}
          disabled={enviandoImagem}
          className="border border-borda px-4 py-2 text-ink hover:border-lacre disabled:opacity-50"
        >
          <span className="meta">
            {enviandoImagem
              ? "Enviando…"
              : imagemCapa
                ? "Trocar imagem"
                : "Escolher imagem de capa"}
          </span>
        </button>
        {erroImagem && (
          <p className="mt-2 font-serif text-xs text-lacre">{erroImagem}</p>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="meta mb-1 block text-chumbo-lt">
          Tags (separadas por vírgula)
        </label>
        <input
          id="tags"
          name="tags"
          defaultValue={artigo?.tags.join(", ")}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="corpo" className="meta mb-1 block text-chumbo-lt">
          Corpo (MDX)
        </label>
        <p className="mb-2 font-serif text-xs text-chumbo-lt">
          Parágrafos separados por linha em branco. Subtítulos com ##.
        </p>
        <textarea
          id="corpo"
          name="corpo"
          defaultValue={artigo?.corpo}
          rows={18}
          required
          className="w-full border border-borda bg-paper px-4 py-3 font-serif text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={artigo?.publicado ?? false}
          className="h-5 w-5 border border-borda"
        />
        <span className="text-ink">Publicado (aparece no site)</span>
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pendente || !periodo}
          className="border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="meta text-ouro">
            {pendente ? "Salvando…" : "Salvar"}
          </span>
        </button>
        {!periodo && (
          <p className="font-serif text-xs text-chumbo-lt">
            Escolha um período pra habilitar o envio.
          </p>
        )}
        {estado && (
          <p className={`meta ${estado.ok ? "text-chumbo" : "text-lacre"}`}>
            {estado.mensagem}
            {estado.ok && estado.url && (
              <>
                {" — "}
                <a
                  href={estado.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-lacre"
                >
                  ver commit
                </a>
              </>
            )}
          </p>
        )}
      </div>
    </form>
  );
}
