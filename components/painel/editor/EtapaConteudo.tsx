"use client";

import { useRef, useState } from "react";
import { uploadImagemAction } from "@/app/painel/(protegido)/novo-artigo/actions";
import type { EstadoArtigo } from "@/components/painel/editor/NovoArtigoWizard";

export function EtapaConteudo({
  estado,
  atualizar,
  onVoltar,
  onAvancar,
}: {
  estado: EstadoArtigo;
  atualizar: (parcial: Partial<EstadoArtigo>) => void;
  onVoltar: () => void;
  onAvancar: () => void;
}) {
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

    atualizar({
      imagens: [...estado.imagens, { url: resultado.url, legenda: "" }],
    });
  }

  const podeAvancar = estado.corpoMdx.trim() !== "";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <label htmlFor="corpoMdx" className="meta mb-2 block text-chumbo-lt">
          Corpo do artigo (MDX)
        </label>
        <p className="mb-2 font-serif text-xs text-chumbo-lt">
          Parágrafos separados por linha em branco. Subtítulos com ##.
        </p>
        <textarea
          id="corpoMdx"
          value={estado.corpoMdx}
          onChange={(e) => atualizar({ corpoMdx: e.target.value })}
          rows={18}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <p className="meta mb-2 text-chumbo-lt">Imagens</p>
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
        <button
          type="button"
          onClick={() => inputArquivoRef.current?.click()}
          disabled={enviandoImagem}
          className="border border-borda px-4 py-2 text-ink hover:border-lacre disabled:opacity-50"
        >
          <span className="meta">
            {enviandoImagem ? "Enviando…" : "Enviar imagem"}
          </span>
        </button>
        {erroImagem && (
          <p className="mt-2 font-serif text-xs text-lacre">{erroImagem}</p>
        )}

        {estado.imagens.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {estado.imagens.map((img, i) => (
              <div key={img.url} className="flex flex-col gap-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt=""
                  className="aspect-video w-full border border-borda object-cover"
                />
                <input
                  value={img.legenda}
                  onChange={(e) => {
                    const imagens = [...estado.imagens];
                    imagens[i] = { ...imagens[i], legenda: e.target.value };
                    atualizar({ imagens });
                  }}
                  placeholder="Legenda / crédito"
                  className="border border-borda bg-paper px-2 py-1 text-xs text-ink focus:border-lacre focus:outline-none"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onVoltar}
          className="border border-borda px-6 py-3 text-chumbo hover:border-lacre"
        >
          <span className="meta">← Básico</span>
        </button>
        <button
          type="button"
          onClick={onAvancar}
          disabled={!podeAvancar}
          className="border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="meta text-ouro">Próximo — Revisão</span>
        </button>
      </div>
    </div>
  );
}
