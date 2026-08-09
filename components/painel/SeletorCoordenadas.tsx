"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Mesmo estilo livre (sem token) que o Atlas público usa — ver
// components/atlas/AtlasMapa.tsx.
const ESTILO_PADRAO = "https://tiles.openfreemap.org/styles/liberty";
const ESTILO_MAPA = process.env.NEXT_PUBLIC_MAP_STYLE_URL || ESTILO_PADRAO;

const CENTRO_BRASIL: [number, number] = [-47, -15];

/**
 * Substitui os dois `<input type="number">` cegos de latitude/longitude
 * por um mapa pequeno com um pino arrastável — clica ou arrasta pra
 * marcar o lugar, sem precisar achar as coordenadas em outro serviço e
 * colar. `lat`/`lng` continuam sendo a fonte da verdade (o formulário
 * ainda tem os inputs numéricos, só que ocultos e sincronizados daqui).
 */
export function SeletorCoordenadas({
  lat,
  lng,
  onMudar,
}: {
  lat: number;
  lng: number;
  onMudar: (lat: number, lng: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const marcadorRef = useRef<maplibregl.Marker | null>(null);
  const [indisponivel, setIndisponivel] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const temCoordenadas = lat !== 0 || lng !== 0;
    const centro: [number, number] = temCoordenadas ? [lng, lat] : CENTRO_BRASIL;

    const map = new maplibregl.Map({
      container,
      style: ESTILO_MAPA,
      center: centro,
      zoom: temCoordenadas ? 13 : 3.2,
    });
    mapRef.current = map;
    map.on("error", () => setIndisponivel(true));
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    const marcador = new maplibregl.Marker({ draggable: true, color: "#1B3B8F" })
      .setLngLat(centro)
      .addTo(map);
    marcadorRef.current = marcador;

    marcador.on("dragend", () => {
      const { lat: novaLat, lng: novaLng } = marcador.getLngLat();
      onMudar(Number(novaLat.toFixed(6)), Number(novaLng.toFixed(6)));
    });

    map.on("click", (e) => {
      marcador.setLngLat(e.lngLat);
      onMudar(Number(e.lngLat.lat.toFixed(6)), Number(e.lngLat.lng.toFixed(6)));
    });

    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mapa monta uma vez só — mover o pino é o próprio jeito de mudar lat/lng.

  return (
    <div>
      <div
        ref={containerRef}
        className="h-60 w-full border border-borda"
        aria-label="Mapa para marcar a localização do destino"
      />
      {indisponivel && (
        <p className="mt-2 font-serif text-xs text-lacre">
          Mapa indisponível agora — pode preencher lat/lng manualmente
          abaixo.
        </p>
      )}
      <p className="mt-2 font-serif text-xs text-chumbo-lt">
        Clique no mapa ou arraste o pino pra marcar o lugar exato.
      </p>
    </div>
  );
}
