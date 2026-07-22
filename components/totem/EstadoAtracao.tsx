"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getPeriodo } from "@/data/periodos";
import { DotsProgresso } from "@/components/totem/DotsProgresso";
import type { FraseAtracao } from "@/lib/totem";

const DURACAO_MIN_MS = 4000;
const DURACAO_MAX_MS = 9000;
const MS_POR_PALAVRA = 150;

// Frases curadas cabem em 4s; o fallback usa excertos de artigo, bem mais
// longos — sem isso, o visitante não termina de ler antes da troca.
function duracaoDaFrase(frase: FraseAtracao): number {
  const palavras = frase.texto.split(/\s+/).length;
  return Math.min(DURACAO_MAX_MS, Math.max(DURACAO_MIN_MS, DURACAO_MIN_MS + palavras * MS_POR_PALAVRA));
}

export function EstadoAtracao({
  frases,
  onTocar,
}: {
  frases: FraseAtracao[];
  onTocar: () => void;
}) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (frases.length <= 1) return;
    const id = setTimeout(() => {
      setIndice((i) => (i + 1) % frases.length);
    }, duracaoDaFrase(frases[indice]));
    return () => clearTimeout(id);
  }, [indice, frases]);

  return (
    <button
      type="button"
      onClick={onTocar}
      className="absolute inset-0 block h-full w-full text-left"
      aria-label="Toque para explorar"
    >
      {frases.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink">
          <span className="meta text-ouro">Toque para explorar</span>
        </div>
      )}

      {/* Fundo: imagem + gradiente crossfadam entre si — funciona bem pra
          fotos, cada camada some/aparece sobreposta sem prejudicar leitura
          (não há texto aqui). */}
      {frases.map((frase, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === indice ? 1 : 0 }}
          aria-hidden={i !== indice}
        >
          {frase.imagemUrl && (
            <Image
              src={frase.imagemUrl}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-40"
              priority={i === 0}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        </div>
      ))}

      {/* Texto: nunca crossfada — a frase anterior desmonta e a nova entra
          sozinha (key troca por índice), sem as duas nunca ficarem
          sobrepostas e ilegíveis ao mesmo tempo. */}
      {frases[indice] && (
        <div
          key={indice}
          className="totem-fade-in absolute inset-x-0 px-10"
          style={{ bottom: "30vh" }}
        >
          {frases[indice].periodo && (
            <p className="meta mb-3 text-ouro">
              {getPeriodo(frases[indice].periodo!).label}
            </p>
          )}
          <p
            className="line-clamp-5 font-display leading-tight text-paper"
            style={{ fontSize: "clamp(1.2rem, 2.7vh, 2.2rem)" }}
          >
            {frases[indice].texto}
          </p>
        </div>
      )}

      <div className="absolute inset-x-0" style={{ bottom: "20vh" }}>
        <DotsProgresso total={frases.length} ativo={indice} />
      </div>

      <div className="absolute inset-x-0 flex justify-center" style={{ bottom: "10vh" }}>
        <span className="meta animate-pulse border border-ouro/60 bg-ink/40 px-6 py-3 text-ouro backdrop-blur-sm">
          Toque para explorar
        </span>
      </div>
    </button>
  );
}
