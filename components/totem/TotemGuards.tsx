"use client";

import { useEffect } from "react";

/**
 * Higiene de quiosque que só existe em JS: bloqueia menu de contexto e
 * arraste de imagem/texto no shell inteiro do totem. Sem isso, um toque
 * longo abre o menu nativo do navegador — inaceitável num totem físico.
 */
export function TotemGuards() {
  useEffect(() => {
    function bloquear(e: Event) {
      e.preventDefault();
    }

    window.addEventListener("contextmenu", bloquear);
    window.addEventListener("dragstart", bloquear);

    return () => {
      window.removeEventListener("contextmenu", bloquear);
      window.removeEventListener("dragstart", bloquear);
    };
  }, []);

  return null;
}
