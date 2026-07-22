"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { periodosOrdenados, type PeriodoId } from "@/data/periodos";
import type { PontoArtigo, PontoMuseu } from "@/lib/atlas";

// MapLibre é open-source e não pede conta/token pra funcionar — o estilo
// vem de um provedor de tiles livre por padrão (OpenFreeMap), mas dá pra
// trocar por outro (MapTiler, Stadia, self-host) via env, sem mexer em código.
const ESTILO_PADRAO = "https://tiles.openfreemap.org/styles/liberty";
const ESTILO_MAPA = process.env.NEXT_PUBLIC_MAP_STYLE_URL || ESTILO_PADRAO;

function artigosParaGeoJSON(pontos: PontoArtigo[]) {
  return {
    type: "FeatureCollection" as const,
    features: pontos.map((p) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
      properties: {
        slug: p.slug,
        titulo: p.titulo,
        periodo: p.periodo,
        anoInicio: p.anoInicio,
        url: p.url,
      },
    })),
  };
}

function museusParaGeoJSON(pontos: PontoMuseu[]) {
  return {
    type: "FeatureCollection" as const,
    features: pontos.map((p) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
      properties: {
        slug: p.slug,
        titulo: p.titulo,
        tipologia: p.tipologia,
        url: p.url,
      },
    })),
  };
}

const CAMADAS_ARTIGOS = ["artigos-cluster", "artigos-cluster-count", "artigos-ponto"];
const CAMADAS_MUSEUS = ["museus-cluster", "museus-cluster-count", "museus-ponto"];

const CENTRO_INICIAL: [number, number] = [-47, -15];
const ZOOM_INICIAL = 3.2;

export function AtlasMapa({
  pontosArtigos,
  pontosMuseus,
  modoQuiosque = false,
  onSelecionarPonto,
  mensagemIndisponivel,
}: {
  pontosArtigos: PontoArtigo[];
  pontosMuseus: PontoMuseu[];
  /** Desabilita gestos de mouse/multitoque (rotação, inclinação) e troca o chrome por controles maiores — para o totem (Fase 6). */
  modoQuiosque?: boolean;
  /** Se definido, tocar num ponto chama isto em vez de abrir o popup com link — o totem decide se mostra a ficha do museu ou a prévia do artigo. */
  onSelecionarPonto?: (info: {
    tipo: "artigo" | "museu";
    slug: string;
    titulo: string;
    url: string;
  }) => void;
  /** Mensagem editorial pro totem quando o mapa está indisponível — sem isso, cai na mensagem técnica padrão. */
  mensagemIndisponivel?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [camadaArtigos, setCamadaArtigos] = useState(true);
  const [camadaMuseus, setCamadaMuseus] = useState(true);
  const [periodoFiltro, setPeriodoFiltro] = useState<PeriodoId | null>(null);
  // Diferente do Mapbox, não há token pra checar de antemão — a
  // indisponibilidade só aparece se o carregamento do estilo/tiles falhar
  // de verdade (rede fora do ar, provedor indisponível etc).
  const [indisponivel, setIndisponivel] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = new maplibregl.Map({
      container,
      // "Papel envelhecido": base clara + filtro CSS (sépia/contraste) no
      // canvas — ver globals.css .atlas-mapa.
      style: ESTILO_MAPA,
      center: CENTRO_INICIAL,
      zoom: ZOOM_INICIAL,
    });
    mapRef.current = map;

    map.on("error", () => setIndisponivel(true));

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    if (modoQuiosque) {
      // Só pan + pinça-pra-zoom sobrevivem — rotação e inclinação por
      // multitoque desorientam um visitante de museu sem querer, e não têm
      // como "desfazer" fácil num quiosque sem mouse.
      map.scrollZoom.disable();
      map.doubleClickZoom.disable();
      map.dragRotate.disable();
      map.touchPitch.disable();
    }

    map.on("load", () => {
      map.addSource("artigos", {
        type: "geojson",
        data: artigosParaGeoJSON(pontosArtigos),
        cluster: true,
        clusterRadius: 40,
      });
      map.addSource("museus", {
        type: "geojson",
        data: museusParaGeoJSON(pontosMuseus),
        cluster: true,
        clusterRadius: 40,
      });

      map.addLayer({
        id: "artigos-cluster",
        type: "circle",
        source: "artigos",
        filter: ["has", "point_count"],
        paint: { "circle-color": "#1B3B8F", "circle-radius": 16, "circle-opacity": 0.85 },
      });
      map.addLayer({
        id: "artigos-cluster-count",
        type: "symbol",
        source: "artigos",
        filter: ["has", "point_count"],
        layout: { "text-field": "{point_count_abbreviated}", "text-size": 12, "text-font": ["DIN Pro Bold"] },
        paint: { "text-color": "#F7F3EC" },
      });
      map.addLayer({
        id: "artigos-ponto",
        type: "circle",
        source: "artigos",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#1B3B8F",
          "circle-radius": 7,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#F7F3EC",
        },
      });

      map.addLayer({
        id: "museus-cluster",
        type: "circle",
        source: "museus",
        filter: ["has", "point_count"],
        paint: { "circle-color": "#B8902A", "circle-radius": 16, "circle-opacity": 0.85 },
      });
      map.addLayer({
        id: "museus-cluster-count",
        type: "symbol",
        source: "museus",
        filter: ["has", "point_count"],
        layout: { "text-field": "{point_count_abbreviated}", "text-size": 12, "text-font": ["DIN Pro Bold"] },
        paint: { "text-color": "#0E1B33" },
      });
      map.addLayer({
        id: "museus-ponto",
        type: "circle",
        source: "museus",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#B8902A",
          "circle-radius": 7,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#0E1B33",
        },
      });

      for (const layerId of ["artigos-ponto", "museus-ponto"] as const) {
        map.on("click", layerId, (e) => {
          const feature = e.features?.[0];
          if (!feature || feature.geometry.type !== "Point") return;
          const coords = feature.geometry.coordinates.slice(0, 2) as [number, number];
          const titulo = String(feature.properties?.titulo ?? "");
          const url = String(feature.properties?.url ?? "#");
          const slug = String(feature.properties?.slug ?? "");
          const tipo = layerId === "artigos-ponto" ? "artigo" : "museu";

          // Totem: nunca navega direto, um toque num ponto abre a ficha
          // rápida (museu) ou a prévia do artigo — nunca a ponte QR direto.
          if (onSelecionarPonto) {
            onSelecionarPonto({ tipo, slug, titulo, url });
            return;
          }

          new maplibregl.Popup({ closeButton: true, offset: 12 })
            .setLngLat(coords)
            .setHTML(
              `<a href="${url}" style="font-family: Inter, sans-serif; font-size: 13px; color: #0E1B33; text-decoration: underline;">${titulo}</a>`,
            )
            .addTo(map);
        });

        map.on("mouseenter", layerId, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layerId, () => {
          map.getCanvas().style.cursor = "";
        });
      }

      for (const [layerId, sourceId] of [
        ["artigos-cluster", "artigos"],
        ["museus-cluster", "museus"],
      ] as const) {
        map.on("click", layerId, (e) => {
          const feature = e.features?.[0];
          if (!feature || feature.geometry.type !== "Point") return;
          const clusterId = feature.properties?.cluster_id;
          const coordinates = feature.geometry.coordinates as [number, number];
          const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;

          source
            .getClusterExpansionZoom(clusterId)
            .then((zoom) => map.easeTo({ center: coordinates, zoom }))
            .catch(() => {});
        });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const visibilidade = camadaArtigos ? "visible" : "none";
    for (const id of CAMADAS_ARTIGOS) {
      if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", visibilidade);
    }
  }, [camadaArtigos]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const visibilidade = camadaMuseus ? "visible" : "none";
    for (const id of CAMADAS_MUSEUS) {
      if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", visibilidade);
    }
  }, [camadaMuseus]);

  // Filtro temporal só afeta a camada de artigos — museus não têm `periodo`
  // (são atemporais: o museu existe hoje, independente do período do acervo).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const condicaoPeriodo: maplibregl.ExpressionSpecification = [
      "==",
      ["get", "periodo"],
      periodoFiltro,
    ];

    const filtroCluster: maplibregl.ExpressionSpecification = periodoFiltro
      ? ["all", ["has", "point_count"], condicaoPeriodo]
      : ["has", "point_count"];
    const filtroPonto: maplibregl.ExpressionSpecification = periodoFiltro
      ? ["all", ["!", ["has", "point_count"]], condicaoPeriodo]
      : ["!", ["has", "point_count"]];

    if (map.getLayer("artigos-cluster")) map.setFilter("artigos-cluster", filtroCluster);
    if (map.getLayer("artigos-cluster-count"))
      map.setFilter("artigos-cluster-count", filtroCluster);
    if (map.getLayer("artigos-ponto")) map.setFilter("artigos-ponto", filtroPonto);
  }, [periodoFiltro]);

  if (indisponivel) {
    return (
      <div
        className={`flex w-full items-center justify-center border border-borda bg-paper-mid ${
          modoQuiosque ? "h-full" : "aspect-[4/3] md:aspect-video"
        }`}
      >
        <p className="meta max-w-xs text-center text-chumbo-lt">
          {mensagemIndisponivel ?? "Mapa indisponível no momento — tente novamente em instantes."}
        </p>
      </div>
    );
  }

  if (modoQuiosque) {
    return (
      <div className="flex h-full flex-col">
        <div className="mb-3 flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setCamadaArtigos((v) => !v)}
            aria-pressed={camadaArtigos}
            className={`meta flex flex-1 items-center justify-center gap-2 border px-4 py-3 transition-transform active:scale-[0.97] ${
              camadaArtigos
                ? "border-lacre bg-lacre text-paper"
                : "border-borda text-chumbo-lt"
            }`}
          >
            <span className="inline-block h-3 w-3 rounded-full bg-current" aria-hidden />
            Artigos
          </button>
          <button
            type="button"
            onClick={() => setCamadaMuseus((v) => !v)}
            aria-pressed={camadaMuseus}
            className={`meta flex flex-1 items-center justify-center gap-2 border px-4 py-3 transition-transform active:scale-[0.97] ${
              camadaMuseus
                ? "border-ouro bg-ouro text-ink"
                : "border-borda text-chumbo-lt"
            }`}
          >
            <span className="inline-block h-3 w-3 rounded-full bg-current" aria-hidden />
            Museus
          </button>
        </div>

        <div className="relative min-h-0 flex-1">
          <div ref={containerRef} className="atlas-mapa totem-mapa h-full w-full" />
          <button
            type="button"
            onClick={() =>
              mapRef.current?.easeTo({ center: CENTRO_INICIAL, zoom: ZOOM_INICIAL })
            }
            aria-label="Recentralizar mapa"
            className="meta absolute bottom-3 left-3 flex h-11 items-center gap-2 border border-borda bg-paper px-4 text-chumbo shadow-sm transition-transform active:scale-[0.97] active:bg-paper-mid"
          >
            <span aria-hidden>⟲</span> Recentralizar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={camadaArtigos}
            onChange={(e) => setCamadaArtigos(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="inline-block h-3 w-3 rounded-full bg-lacre" aria-hidden />
          <span className="meta text-chumbo">Artigos</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={camadaMuseus}
            onChange={(e) => setCamadaMuseus(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="inline-block h-3 w-3 rounded-full bg-ouro" aria-hidden />
          <span className="meta text-chumbo">Museus</span>
        </label>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPeriodoFiltro(null)}
          aria-pressed={periodoFiltro === null}
          className={`meta border px-3 py-1.5 ${
            periodoFiltro === null
              ? "border-lacre bg-lacre text-ouro"
              : "border-borda text-chumbo hover:border-lacre"
          }`}
        >
          Todos os períodos
        </button>
        {periodosOrdenados().map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPeriodoFiltro(p.id)}
            aria-pressed={periodoFiltro === p.id}
            className={`meta border px-3 py-1.5 ${
              periodoFiltro === p.id
                ? "border-lacre bg-lacre text-ouro"
                : "border-borda text-chumbo hover:border-lacre"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        className="atlas-mapa aspect-[4/3] w-full border border-borda md:aspect-video"
      />
    </div>
  );
}
