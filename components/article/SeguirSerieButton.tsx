"use client";

import { useEffect, useState, useTransition } from "react";
import {
  alternarSeguirSerie,
  buscarEstadoSerie,
} from "@/lib/series-seguidas-actions";

export function SeguirSerieButton({ serieSlug }: { serieSlug: string }) {
  const [carregado, setCarregado] = useState(false);
  const [logado, setLogado] = useState(false);
  const [seguindo, setSeguindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [, iniciarTransicao] = useTransition();

  useEffect(() => {
    let cancelado = false;
    buscarEstadoSerie(serieSlug).then((estado) => {
      if (cancelado) return;
      setLogado(estado.logado);
      setSeguindo(estado.seguindo);
      setCarregado(true);
    });
    return () => {
      cancelado = true;
    };
  }, [serieSlug]);

  if (!carregado || !logado) return null;

  function aoClicar() {
    const proximo = !seguindo;
    setSeguindo(proximo);
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await alternarSeguirSerie(serieSlug, proximo);
      if (!resultado.ok) {
        setSeguindo(!proximo);
        setErro(resultado.erro);
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={aoClicar}
        aria-pressed={seguindo}
        className={`meta border px-4 py-2 ${
          seguindo
            ? "border-lacre bg-lacre text-ouro"
            : "border-borda text-chumbo hover:border-lacre"
        }`}
      >
        {seguindo ? "Seguindo a série" : "Seguir série"}
      </button>
      {erro && <p className="mt-1 font-serif text-xs text-lacre">{erro}</p>}
    </div>
  );
}
