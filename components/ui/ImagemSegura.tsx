"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

// Imagem que some (em vez de mostrar o alt quebrado) quando o arquivo não
// carrega — o container em volta continua com seu fundo, então o layout
// fica limpo até a foto ser reenviada pelo painel.
export function ImagemSegura(props: ImageProps) {
  const [falhou, setFalhou] = useState(false);
  if (falhou) return null;
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...props} onError={() => setFalhou(true)} />;
}
