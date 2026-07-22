"use client";

import { useActionState, useRef, useState } from "react";
import { SeletorPeriodoVisual } from "@/components/painel/editor/SeletorPeriodoVisual";
import {
  uploadImagemCapaAction,
  type EstadoAcervo,
} from "@/app/painel/(protegido)/acervo/actions";
import type { PeriodoId } from "@/data/periodos";

type AcervoPreenchido = {
  slug: string;
  titulo: string;
  periodo: PeriodoId;
  periodosSecundarios: PeriodoId[];
  anoInicio: number;
  anoFim?: number;
  regiao?: string;
  excerpt: string;
  fonte?: string;
  pdfUrl: string;
  imagemCapa?: string;
  tags: string[];
  publicado: boolean;
  data: string;
  corpo: string;
};

export function FormularioAcervo({
  acervo,
  contagens,
  action,
}: {
  acervo?: AcervoPreenchido;
  contagens: Partial<Record<PeriodoId, number>>;
  action: (estado: EstadoAcervo, formData: FormData) => Promise<EstadoAcervo>;
}) {
  const [estado, formAction, pendente] = useActionState(action, null);
  const [periodo, setPeriodo] = useState<PeriodoId | null>(
    acervo?.periodo ?? null,
  );
  const [periodosSecundarios, setPeriodosSecundarios] = useState<PeriodoId[]>(
    acervo?.periodosSecundarios ?? [],
  );
  const [imagemCapa, setImagemCapa] = useState(acervo?.imagemCapa ?? "");
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

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-6">
      <input type="hidden" name="periodo" value={periodo ?? ""} />
      <input
        type="hidden"
        name="periodosSecundarios"
        value={periodosSecundarios.join(",")}
      />
      <input type="hidden" name="imagemCapa" value={imagemCapa} />
      {acervo && (
        <input type="hidden" name="dataOriginal" value={acervo.data} />
      )}

      <div>
        <label htmlFor="titulo" className="meta mb-1 block text-chumbo-lt">
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          defaultValue={acervo?.titulo}
          required
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
            atual.includes(id)
              ? atual.filter((p) => p !== id)
              : [...atual, id],
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
            defaultValue={acervo?.anoInicio}
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
            defaultValue={acervo?.anoFim}
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
          defaultValue={acervo?.regiao}
          className="w-full max-w-sm border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="meta mb-1 block text-chumbo-lt">
          Excerto
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={acervo?.excerpt}
          rows={3}
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="fonte" className="meta mb-1 block text-chumbo-lt">
          Fonte / proveniência (opcional)
        </label>
        <input
          id="fonte"
          name="fonte"
          defaultValue={acervo?.fonte}
          placeholder="Arquivo Nacional, acervo físico…"
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="pdfUrl" className="meta mb-1 block text-chumbo-lt">
          Link do PDF
        </label>
        <input
          id="pdfUrl"
          name="pdfUrl"
          type="url"
          defaultValue={acervo?.pdfUrl}
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <p className="meta mb-1 text-chumbo-lt">Imagem de capa (miniatura)</p>
        <p className="mb-3 font-serif text-xs text-chumbo-lt">
          Aparece como miniatura nas listagens do acervo — pode ser uma foto
          ou o recorte do topo do documento.
        </p>

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
          defaultValue={acervo?.tags.join(", ")}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="corpo" className="meta mb-1 block text-chumbo-lt">
          Corpo
        </label>
        <p className="mb-2 font-serif text-xs text-chumbo-lt">
          Transcrição, contexto e leitura do documento. Aceita marcação
          simples (## para subtítulos).
        </p>
        <textarea
          id="corpo"
          name="corpo"
          defaultValue={acervo?.corpo}
          rows={14}
          required
          className="w-full border border-borda bg-paper px-4 py-3 font-serif text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={acervo?.publicado ?? false}
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
