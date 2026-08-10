"use client";

import { useState } from "react";
import Image from "next/image";
import { parseVideoUrl, nomeProvedorVideo } from "@/lib/video";

export function VideoEmbed({ url, titulo }: { url: string; titulo: string }) {
  const [carregado, setCarregado] = useState(false);
  const info = parseVideoUrl(url);

  if (!info) {
    // Origem sem embed público suportado (ex.: Globoplay) — em vez de não
    // mostrar nada (o card ficava com um espaço vazio, sem aviso), deixa
    // claro que esse aqui abre no site original, diferente dos que tocam
    // direto na página.
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="flex aspect-video w-full flex-col items-center justify-center gap-3 border border-borda bg-paper-mid text-center"
        aria-label={`Assistir no ${nomeProvedorVideo(url)}: ${titulo}`}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-lacre text-lacre">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="meta text-lacre">
          Assistir no {nomeProvedorVideo(url)} ↗
        </span>
      </a>
    );
  }

  // Globoplay não tem embed público documentado — tenta tocar aqui mesmo,
  // mas sem garantia de que a Globo permite (não dá pra testar isso neste
  // ambiente). Mantém o link de origem visível sempre, pra não deixar o
  // visitante preso numa tela em branco/erro caso o iframe não carregue.
  const linkOrigemGloboplay = info.provider === "globoplay" && (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="meta mt-2 inline-block text-lacre hover:underline"
    >
      Não carregou? Assistir no Globoplay ↗
    </a>
  );

  if (carregado) {
    return (
      <div>
        <div className="relative aspect-video w-full overflow-hidden bg-ink">
          <iframe
            src={info.embedUrl}
            title={titulo}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
        {linkOrigemGloboplay}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setCarregado(true)}
        className="group relative flex aspect-video w-full items-center justify-center overflow-hidden bg-ink"
        aria-label={`Assistir: ${titulo}`}
      >
        {info.thumbnailUrl && (
          <Image
            src={info.thumbnailUrl}
            alt=""
            fill
            className="object-cover opacity-70 transition-opacity group-hover:opacity-90"
          />
        )}
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-paper bg-ink/70 text-paper transition-transform group-hover:scale-110">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
      {linkOrigemGloboplay}
    </div>
  );
}
