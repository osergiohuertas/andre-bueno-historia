"use client";

import { useRef, useState } from "react";
import type { Database } from "@/types/supabase";
import { uploadImagemCampoAction } from "@/app/painel/(protegido)/conteudo/actions";

type LinhaConfig = Database["public"]["Tables"]["site_config"]["Row"];

export function Campo({ campo }: { campo: LinhaConfig }) {
  const [valor, setValor] = useState(campo.valor);

  if (campo.tipo === "imagem") {
    return <CampoImagem campo={campo} valor={valor} onMudar={setValor} />;
  }

  if (campo.tipo === "booleano") {
    return (
      <div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name={campo.chave}
            defaultChecked={campo.valor === "true"}
            className="h-5 w-5 border border-borda"
          />
          <span className="text-ink">{campo.rotulo}</span>
        </label>
        {campo.ajuda && (
          <p className="mt-1 font-serif text-xs text-chumbo-lt">
            {campo.ajuda}
          </p>
        )}
      </div>
    );
  }

  const ehLonga = campo.tipo === "texto_longo";
  const tipoInput =
    campo.tipo === "url" ? "url" : campo.tipo === "numero" ? "number" : "text";

  return (
    <div>
      <label htmlFor={campo.chave} className="meta mb-1 block text-chumbo-lt">
        {campo.rotulo}
      </label>
      {campo.ajuda && (
        <p className="mb-2 font-serif text-xs text-chumbo-lt">
          {campo.ajuda}
        </p>
      )}

      {ehLonga ? (
        <textarea
          id={campo.chave}
          name={campo.chave}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          maxLength={campo.max_chars ?? undefined}
          rows={4}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      ) : (
        <input
          id={campo.chave}
          type={tipoInput}
          name={campo.chave}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          maxLength={campo.max_chars ?? undefined}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      )}

      <div className="mt-2 flex items-center justify-between gap-4">
        <span />
        {campo.max_chars && (
          <span className="meta text-chumbo-lt">
            {valor.length}/{campo.max_chars}
          </span>
        )}
      </div>
    </div>
  );
}

function CampoImagem({
  campo,
  valor,
  onMudar,
}: {
  campo: LinhaConfig;
  valor: string;
  onMudar: (valor: string) => void;
}) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const inputArquivoRef = useRef<HTMLInputElement | null>(null);

  async function lidarComUpload(arquivo: File) {
    setEnviando(true);
    setErro(null);
    const formData = new FormData();
    formData.append("arquivo", arquivo);
    const resultado = await uploadImagemCampoAction(formData);
    setEnviando(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }
    onMudar(resultado.url);
  }

  return (
    <div>
      <label className="meta mb-1 block text-chumbo-lt">{campo.rotulo}</label>
      {campo.ajuda && (
        <p className="mb-2 font-serif text-xs text-chumbo-lt">{campo.ajuda}</p>
      )}

      <input type="hidden" name={campo.chave} value={valor} />
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

      {valor && (
        <div className="mb-3 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={valor}
            alt=""
            className="h-24 w-24 border border-borda object-cover"
          />
          <button
            type="button"
            onClick={() => onMudar("")}
            className="meta text-chumbo hover:text-lacre"
          >
            Remover
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => inputArquivoRef.current?.click()}
        disabled={enviando}
        className="border border-borda px-4 py-2 text-ink hover:border-lacre disabled:opacity-50"
      >
        <span className="meta">
          {enviando ? "Enviando…" : valor ? "Trocar imagem" : "Escolher imagem"}
        </span>
      </button>
      {erro && <p className="mt-2 font-serif text-xs text-lacre">{erro}</p>}
    </div>
  );
}
