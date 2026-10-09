"use client";

import { useState } from "react";
import Image from "next/image";

// Capa em largura de leitura ampliada. Se o arquivo não carregar, some o
// bloco inteiro (não só a imagem) para não deixar uma faixa vazia.
export function CapaArtigo({ src, alt }: { src: string; alt: string }) {
  const [falhou, setFalhou] = useState(false);
  if (falhou) return null;

  return (
    <figure className="relative mb-12 aspect-[16/9] w-full overflow-hidden bg-paper-mid">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(min-width: 1024px) 768px, 100vw"
        className="object-cover"
        onError={() => setFalhou(true)}
      />
    </figure>
  );
}
