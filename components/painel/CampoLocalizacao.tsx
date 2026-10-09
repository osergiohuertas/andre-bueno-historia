"use client";

import { useState } from "react";
import { SeletorCoordenadas } from "@/components/painel/SeletorCoordenadas";

// Bloco opcional "aparecer no Atlas" para qualquer formulário do painel.
// Marcado, envia `lat`/`lng` no form; desmarcado, não envia nada (a action
// grava sem localização).
export function CampoLocalizacao({
  inicial,
  ajuda = "Marcando, este conteúdo aparece como ponto no Atlas do site.",
}: {
  inicial?: { lat: number; lng: number } | null;
  ajuda?: string;
}) {
  const temInicial = !!inicial && (inicial.lat !== 0 || inicial.lng !== 0);
  const [ativo, setAtivo] = useState(temInicial);
  const [lat, setLat] = useState(temInicial ? inicial!.lat : 0);
  const [lng, setLng] = useState(temInicial ? inicial!.lng : 0);

  return (
    <div>
      {ativo && (
        <>
          <input type="hidden" name="lat" value={lat} />
          <input type="hidden" name="lng" value={lng} />
        </>
      )}
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={ativo}
          onChange={(e) => setAtivo(e.target.checked)}
          className="h-5 w-5 border border-borda"
        />
        <span className="text-ink">Marcar local no mapa (Atlas)</span>
      </label>
      <p className="mt-1 font-serif text-xs text-chumbo-lt">{ajuda}</p>
      {ativo && (
        <div className="mt-3">
          <SeletorCoordenadas
            lat={lat}
            lng={lng}
            onMudar={(novaLat, novaLng) => {
              setLat(novaLat);
              setLng(novaLng);
            }}
          />
        </div>
      )}
    </div>
  );
}
