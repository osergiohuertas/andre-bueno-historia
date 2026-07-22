"use client";

import { useActionState, useRef, useState } from "react";
import {
  uploadImagemCapaAction,
  publicarOpiniaoAction,
} from "@/app/painel/(protegido)/nova-opiniao/actions";
import type { PeriodoId } from "@/data/periodos";

export function FormularioOpiniao({
  periodos,
  artigos,
}: {
  periodos: { id: PeriodoId; label: string }[];
  artigos: { slug: string; titulo: string }[];
}) {
  const [estado, formAction, pendente] = useActionState(
    publicarOpiniaoAction,
    null,
  );
  const [periodosRel, setPeriodosRel] = useState<PeriodoId[]>([]);
  const [artigosRel, setArtigosRel] = useState<string[]>([]);
  const [imagemCapa, setImagemCapa] = useState("");
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [erroImagem, setErroImagem] = useState<string | null>(null);
  const inputArquivoRef = useRef<HTMLInputElement | null>(null);

  async function lidarComUpload(arquivo: File) {
    setEnviandoImagem(true);
    setErroImagem(null);
    const formData = new FormData();
    formData.append("arquivo", arquivo);
    const resultado = await uploadImagemCapaAction(formData);
    setEnviandoImagem(false);
    if (!resultado.ok) {
      setErroImagem(resultado.erro);
      return;
    }
    setImagemCapa(resultado.url);
  }

  function alternar<T>(lista: T[], valor: T): T[] {
    return lista.includes(valor)
      ? lista.filter((v) => v !== valor)
      : [...lista, valor];
  }

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-6">
      <input
        type="hidden"
        name="periodosRelacionados"
        value={periodosRel.join(",")}
      />
      <input
        type="hidden"
        name="artigosRelacionados"
        value={artigosRel.join(",")}
      />
      <input type="hidden" name="imagemCapa" value={imagemCapa} />

      <div>
        <label htmlFor="titulo" className="meta mb-1 block text-chumbo-lt">
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
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
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="meta mb-1 block text-chumbo-lt">
          Excerto
        </label>
        <p className="mb-2 font-serif text-xs text-chumbo-lt">
          A chamada da peça — aparece nos cards e na busca.
        </p>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="tags" className="meta mb-1 block text-chumbo-lt">
          Tags (separadas por vírgula)
        </label>
        <input
          id="tags"
          name="tags"
          placeholder="democracia, memória, patrimônio…"
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <p className="meta mb-1 text-chumbo-lt">Imagem de capa (opcional)</p>
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
        <p className="meta mb-1 text-chumbo-lt">
          Períodos de contexto (opcional)
        </p>
        <p className="mb-3 font-serif text-xs text-chumbo-lt">
          Com quais períodos históricos esta peça dialoga. Só cor e tema — não
          organiza a opinião por período.
        </p>
        <div className="flex flex-wrap gap-2">
          {periodos.map((p) => {
            const ativo = periodosRel.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriodosRel((a) => alternar(a, p.id))}
                className={`meta border px-3 py-1.5 transition-colors ${
                  ativo
                    ? "border-ouro bg-ouro/10 text-ouro"
                    : "border-borda text-chumbo hover:border-lacre"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="meta mb-1 text-chumbo-lt">Base histórica (opcional)</p>
        <p className="mb-3 font-serif text-xs text-chumbo-lt">
          Artigos publicados que embasam a análise — viram o bloco &ldquo;Base
          histórica&rdquo; no fim da peça.
        </p>
        {artigos.length === 0 ? (
          <p className="font-serif text-xs text-chumbo-lt">
            Nenhum artigo publicado para vincular ainda.
          </p>
        ) : (
          <div className="flex max-h-56 flex-col gap-1 overflow-y-auto border border-borda p-3">
            {artigos.map((a) => (
              <label
                key={a.slug}
                className="flex cursor-pointer items-center gap-2.5 py-1"
              >
                <input
                  type="checkbox"
                  checked={artigosRel.includes(a.slug)}
                  onChange={() => setArtigosRel((l) => alternar(l, a.slug))}
                  className="h-4 w-4 border border-borda"
                />
                <span className="font-serif text-sm text-ink">{a.titulo}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="corpo" className="meta mb-1 block text-chumbo-lt">
          Corpo
        </label>
        <p className="mb-2 font-serif text-xs text-chumbo-lt">
          O texto da opinião. Aceita marcação simples (## para subtítulos, &gt;
          para citações).
        </p>
        <textarea
          id="corpo"
          name="corpo"
          rows={18}
          required
          className="w-full border border-borda bg-paper px-4 py-3 font-serif text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="destaque"
          className="h-5 w-5 border border-borda"
        />
        <span className="text-ink">
          Destaque (abre em evidência no topo de /opinião)
        </span>
      </label>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked
          className="h-5 w-5 border border-borda"
        />
        <span className="text-ink">Publicado (aparece no site)</span>
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pendente}
          className="border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="meta text-ouro">
            {pendente ? "Publicando…" : "Publicar opinião"}
          </span>
        </button>
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
