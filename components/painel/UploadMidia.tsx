"use client";

import { useActionState, useRef, useState } from "react";
import { enviarArquivosAction } from "@/app/painel/(protegido)/midia/actions";
import { FORMATOS_IMAGEM_ACEITOS, TAMANHO_MAXIMO_MB, TAMANHO_MAXIMO_PDF_MB } from "@/lib/uploadConfig";

export function UploadMidia() {
  const [estado, formAction, pendente] = useActionState(enviarArquivosAction, null);
  const [arrastando, setArrastando] = useState(false);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  function aoEscolher(lista: FileList | null) {
    setSelecionados(lista ? Array.from(lista).map((f) => f.name) : []);
    if (lista && lista.length > 0) formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action={formAction}>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          if (inputRef.current && e.dataTransfer.files.length) {
            inputRef.current.files = e.dataTransfer.files;
            aoEscolher(e.dataTransfer.files);
          }
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed px-6 py-10 text-center transition-colors ${
          arrastando ? "border-lacre bg-paper-mid" : "border-borda hover:border-lacre"
        }`}
      >
        <span className="font-display text-xl text-ink">
          {pendente ? "Enviando…" : "Arraste fotos ou PDFs aqui, ou clique para escolher"}
        </span>
        <span className="font-serif text-sm text-chumbo">
          Pode enviar vários de uma vez. {FORMATOS_IMAGEM_ACEITOS} até {TAMANHO_MAXIMO_MB}MB; PDF até{" "}
          {TAMANHO_MAXIMO_PDF_MB}MB.
        </span>
        {pendente && selecionados.length > 0 && (
          <span className="meta text-chumbo-lt">{selecionados.length} arquivo(s)</span>
        )}
        <input
          ref={inputRef}
          type="file"
          name="arquivos"
          multiple
          accept="image/*,application/pdf"
          className="sr-only"
          onChange={(e) => aoEscolher(e.target.files)}
        />
      </label>

      {estado && (
        <div className="mt-4 flex flex-col gap-1">
          {estado.enviados.length > 0 && (
            <p className="meta text-chumbo">{estado.enviados.length} arquivo(s) enviado(s).</p>
          )}
          {estado.erros.map((e) => (
            <p key={e.nome} className="font-serif text-sm text-lacre">
              {e.nome}: {e.erro}
            </p>
          ))}
        </div>
      )}
    </form>
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
