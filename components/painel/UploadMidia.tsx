"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { enviarArquivo } from "@/lib/enviarArquivo";
import { FORMATOS_IMAGEM_ACEITOS, TAMANHO_MAXIMO_MB, TAMANHO_MAXIMO_PDF_MB } from "@/lib/uploadConfig";

type Resultado = { enviados: number; erros: { nome: string; erro: string }[] };

export function UploadMidia() {
  const router = useRouter();
  const [arrastando, setArrastando] = useState(false);
  const [progresso, setProgresso] = useState<{ atual: number; total: number } | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function enviar(lista: FileList | null) {
    const arquivos = lista ? Array.from(lista) : [];
    if (arquivos.length === 0) return;
    const parcial: Resultado = { enviados: 0, erros: [] };
    for (const [i, arquivo] of arquivos.entries()) {
      setProgresso({ atual: i + 1, total: arquivos.length });
      const r = await enviarArquivo(arquivo);
      if (r.ok) parcial.enviados++;
      else parcial.erros.push({ nome: arquivo.name, erro: r.erro });
    }
    setProgresso(null);
    setResultado(parcial);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          if (!progresso) enviar(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed px-6 py-10 text-center transition-colors ${
          arrastando ? "border-lacre bg-paper-mid" : "border-borda hover:border-lacre"
        }`}
      >
        <span className="font-display text-xl text-ink">
          {progresso
            ? `Enviando ${progresso.atual} de ${progresso.total}…`
            : "Arraste fotos ou PDFs aqui, ou clique para escolher"}
        </span>
        <span className="font-serif text-sm text-chumbo">
          Pode enviar vários de uma vez. {FORMATOS_IMAGEM_ACEITOS} até {TAMANHO_MAXIMO_MB}MB; PDF até{" "}
          {TAMANHO_MAXIMO_PDF_MB}MB.
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          disabled={!!progresso}
          className="sr-only"
          onChange={(e) => enviar(e.target.files)}
        />
      </label>

      {resultado && (
        <div className="mt-4 flex flex-col gap-1">
          {resultado.enviados > 0 && (
            <p className="meta text-chumbo">{resultado.enviados} arquivo(s) enviado(s).</p>
          )}
          {resultado.erros.map((e) => (
            <p key={e.nome} className="font-serif text-sm text-lacre">
              {e.nome}: {e.erro}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function BotaoCopiarLink({ url }: { url: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 1800);
      }}
      className="meta text-chumbo hover:text-lacre"
    >
      {copiado ? "Copiado ✓" : "Copiar link"}
    </button>
  );
}
