"use client";

import { useEffect } from "react";

/**
 * Registra um `beforeunload` enquanto `sujo` for true — avisa antes de
 * fechar a aba/atualizar a página com alterações não salvas. Não cobre
 * navegação interna via next/link (Next não expõe um hook de bloqueio de
 * rota no App Router), só fechar/recarregar a aba.
 */
export function useAvisoSairSemSalvar(sujo: boolean) {
  useEffect(() => {
    if (!sujo) return;

    function lidar(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }

    window.addEventListener("beforeunload", lidar);
    return () => window.removeEventListener("beforeunload", lidar);
  }, [sujo]);
}
