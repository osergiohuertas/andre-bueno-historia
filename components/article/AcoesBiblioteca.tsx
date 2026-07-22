"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  alternarSalvo,
  alternarLido,
  buscarEstadoBiblioteca,
} from "@/lib/biblioteca-actions";

export function AcoesBiblioteca({ artigoSlug }: { artigoSlug: string }) {
  const [carregado, setCarregado] = useState(false);
  const [logado, setLogado] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [lido, setLido] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [, iniciarTransicao] = useTransition();

  useEffect(() => {
    let cancelado = false;
    buscarEstadoBiblioteca(artigoSlug).then((estado) => {
      if (cancelado) return;
      setLogado(estado.logado);
      setSalvo(estado.salvo);
      setLido(estado.lido);
      setCarregado(true);
    });
    return () => {
      cancelado = true;
    };
  }, [artigoSlug]);

  // Evita "pulo" de layout: nada é renderizado até saber se há sessão.
  if (!carregado) return null;

  if (!logado) {
    return (
      <p className="meta text-chumbo-lt">
        <Link href="/conta/entrar" className="text-lacre underline">
          Entre na sua conta
        </Link>{" "}
        para salvar este artigo ou marcar como lido.
      </p>
    );
  }

  function aoClicarSalvar() {
    const proximo = !salvo;
    setSalvo(proximo);
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await alternarSalvo(artigoSlug, proximo);
      if (!resultado.ok) {
        setSalvo(!proximo);
        setErro(resultado.erro);
      }
    });
  }

  function aoClicarLido() {
    const proximo = !lido;
    setLido(proximo);
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await alternarLido(artigoSlug, proximo);
      if (!resultado.ok) {
        setLido(!proximo);
        setErro(resultado.erro);
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={aoClicarSalvar}
        aria-pressed={salvo}
        className={`meta border px-4 py-2 ${
          salvo
            ? "border-lacre bg-lacre text-ouro"
            : "border-borda text-chumbo hover:border-lacre"
        }`}
      >
        {salvo ? "Salvo na biblioteca" : "Salvar artigo"}
      </button>
      <button
        type="button"
        onClick={aoClicarLido}
        aria-pressed={lido}
        className={`meta border px-4 py-2 ${
          lido
            ? "border-ink bg-ink text-ouro"
            : "border-borda text-chumbo hover:border-lacre"
        }`}
      >
        {lido ? "Marcado como lido" : "Marcar como lido"}
      </button>
      {erro && <p className="font-serif text-xs text-lacre">{erro}</p>}
    </div>
  );
}
