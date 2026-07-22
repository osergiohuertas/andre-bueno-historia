"use client";

import { useState } from "react";
import Image from "next/image";
import { parseVideoUrl } from "@/lib/video";

export function VideoEmbed({ url, titulo }: { url: string; titulo: string }) {
  const [carregado, setCarregado] = useState(false);
  const info = parseVideoUrl(url);

  if (!info) return null;

  if (carregado) {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-ink">
        <iframe
          src={info.embedUrl}
          title={titulo}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
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
  );
}
