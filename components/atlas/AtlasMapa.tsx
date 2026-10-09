"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { periodosOrdenados, type PeriodoId } from "@/data/periodos";
import type { PontoAtlas, TipoPonto } from "@/lib/atlas";

// MapLibre é open-source e não pede conta/token pra funcionar — o estilo
// vem de um provedor de tiles livre por padrão (OpenFreeMap), mas dá pra
// trocar por outro (MapTiler, Stadia, self-host) via env, sem mexer em código.
const ESTILO_PADRAO = "https://tiles.openfreemap.org/styles/liberty";
const ESTILO_MAPA = process.env.NEXT_PUBLIC_MAP_STYLE_URL || ESTILO_PADRAO;

const CAMADAS: { tipo: TipoPonto; rotulo: string; cor: string; texto: string; borda: string }[] = [
  { tipo: "destino", rotulo: "Destinos", cor: "#B8902A", texto: "#0E1B33", borda: "#0E1B33" },
  { tipo: "artigo", rotulo: "Artigos", cor: "#1B3B8F", texto: "#F7F3EC", borda: "#F7F3EC" },
  { tipo: "evento", rotulo: "Agenda", cor: "#2E6B4F", texto: "#F7F3EC", borda: "#F7F3EC" },
  { tipo: "trabalho", rotulo: "Trabalhos técnicos", cor: "#5B4A8A", texto: "#F7F3EC", borda: "#F7F3EC" },
  { tipo: "foto", rotulo: "Fotos", cor: "#8A2E2E", texto: "#F7F3EC", borda: "#F7F3EC" },
];
const ROTULO_SINGULAR: Record<TipoPonto, string> = {
  destino: "Destino",
  artigo: "Artigo",
  evento: "Agenda",
  trabalho: "Trabalho técnico",
  foto: "Foto",
};

const CENTRO_INICIAL: [number, number] = [-47, -15];
const ZOOM_INICIAL = 3.2;

const escapar = (t: string) =>
  t.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function geojson(pontos: PontoAtlas[]) {
  return {
    type: "FeatureCollection" as const,
    features: pontos.map((p) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
      properties: {
        id: p.id,
        titulo: p.titulo,
        subtitulo: p.subtitulo ?? "",
        url: p.url,
        imagem: p.imagem ?? "",
        periodo: p.periodo ?? "",
      },
    })),
  };
}

function htmlPopup(tipo: TipoPonto, props: Record<string, string>, quiosque: boolean) {
  const camada = CAMADAS.find((c) => c.tipo === tipo)!;
  const imagem = props.imagem
    ? `<img src="${escapar(props.imagem)}" alt="" onerror="this.remove()" style="display:block;width:100%;height:120px;object-fit:cover;margin-bottom:10px;" />`
    : "";
  const link = quiosque
    ? ""
    : `<a href="${escapar(props.url)}" style="display:inline-block;margin-top:10px;font:600 10px/1 Inter,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:${camada.cor};">${tipo === "foto" ? "Ver fotos" : "Abrir"} →</a>`;
  return `<div style="width:220px;font-family:Inter,sans-serif;">${imagem}
    <p style="margin:0;font:600 9px/1 Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:${camada.cor};">${ROTULO_SINGULAR[tipo]}</p>
    <p style="margin:6px 0 0;font:600 15px/1.3 'Playfair Display',serif;color:#0E1B33;">${escapar(props.titulo)}</p>
    ${props.subtitulo ? `<p style="margin:4px 0 0;font-size:12px;line-height:1.4;color:#5a5a5a;">${escapar(props.subtitulo)}</p>` : ""}
    ${link}</div>`;
}

export function AtlasMapa({
  pontos,
  modoQuiosque = false,
  onSelecionarPonto,
  mensagemIndisponivel,
}: {
  pontos: PontoAtlas[];
  /** Desabilita gestos de mouse/multitoque (rotação, inclinação) e troca o chrome por controles maiores — para o totem (Fase 6). */
  modoQuiosque?: boolean;
  /** Se definido, tocar num artigo/destino chama isto em vez de abrir o popup — o totem decide se mostra a ficha do destino ou a prévia do artigo. */
  onSelecionarPonto?: (info: {
    tipo: "artigo" | "destino";
    slug: string;
    titulo: string;
    url: string;
  }) => void;
  /** Mensagem editorial pro totem quando o mapa está indisponível — sem isso, cai na mensagem técnica padrão. */
  mensagemIndisponivel?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [visiveis, setVisiveis] = useState<Record<TipoPonto, boolean>>({
    destino: true,
    artigo: true,
    evento: true,
    trabalho: true,
    foto: true,
  });
  const [periodoFiltro, setPeriodoFiltro] = useState<PeriodoId | null>(null);
  // Diferente do Mapbox, não há token pra checar de antemão — a
  // indisponibilidade só aparece se o carregamento do estilo/tiles falhar
  // de verdade (rede fora do ar, provedor indisponível etc).
  const [indisponivel, setIndisponivel] = useState(false);

  const porTipo = useMemo(() => {
    const grupos = {} as Record<TipoPonto, PontoAtlas[]>;
    for (const c of CAMADAS) grupos[c.tipo] = pontos.filter((p) => p.tipo === c.tipo);
    return grupos;
  }, [pontos]);
  const camadasComPontos = CAMADAS.filter((c) => porTipo[c.tipo].length > 0);
  const temPeriodo = pontos.some((p) => p.periodo);

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
      // multitoque desorientam um visitante sem querer.
      map.scrollZoom.disable();
      map.doubleClickZoom.disable();
      map.dragRotate.disable();
      map.touchPitch.disable();
    }

    map.on("load", () => {
      for (const c of CAMADAS) {
        const fonte = `src-${c.tipo}`;
        map.addSource(fonte, {
          type: "geojson",
          data: geojson(porTipo[c.tipo]),
          cluster: true,
          clusterRadius: 40,
        });
        map.addLayer({
          id: `${c.tipo}-cluster`,
          type: "circle",
          source: fonte,
          filter: ["has", "point_count"],
          paint: { "circle-color": c.cor, "circle-radius": 16, "circle-opacity": 0.85 },
        });
        map.addLayer({
          id: `${c.tipo}-cluster-count`,
          type: "symbol",
          source: fonte,
          filter: ["has", "point_count"],
          layout: { "text-field": "{point_count_abbreviated}", "text-size": 12, "text-font": ["Noto Sans Bold"] },
          paint: { "text-color": c.texto },
        });
        map.addLayer({
          id: `${c.tipo}-ponto`,
          type: "circle",
          source: fonte,
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": c.cor,
            "circle-radius": 7,
            "circle-stroke-width": 2,
            "circle-stroke-color": c.borda,
          },
        });

        map.on("click", `${c.tipo}-ponto`, (e) => {
          const feature = e.features?.[0];
          if (!feature || feature.geometry.type !== "Point") return;
          const coords = feature.geometry.coordinates.slice(0, 2) as [number, number];
          const props = (feature.properties ?? {}) as Record<string, string>;

          // Totem: nunca navega direto — artigo/destino abrem a ficha rápida.
          if (onSelecionarPonto && (c.tipo === "artigo" || c.tipo === "destino")) {
            onSelecionarPonto({ tipo: c.tipo, slug: props.id, titulo: props.titulo, url: props.url });
            return;
          }

          new maplibregl.Popup({ closeButton: true, offset: 12, maxWidth: "260px" })
            .setLngLat(coords)
            .setHTML(htmlPopup(c.tipo, props, modoQuiosque))
            .addTo(map);
        });

        map.on("click", `${c.tipo}-cluster`, (e) => {
          const feature = e.features?.[0];
          if (!feature || feature.geometry.type !== "Point") return;
          const source = map.getSource(fonte) as maplibregl.GeoJSONSource;
          source
            .getClusterExpansionZoom(feature.properties?.cluster_id)
            .then((zoom) =>
              map.easeTo({ center: feature.geometry.type === "Point" ? (feature.geometry.coordinates as [number, number]) : CENTRO_INICIAL, zoom }),
            )
            .catch(() => {});
        });

        for (const id of [`${c.tipo}-ponto`, `${c.tipo}-cluster`]) {
          map.on("mouseenter", id, () => (map.getCanvas().style.cursor = "pointer"));
          map.on("mouseleave", id, () => (map.getCanvas().style.cursor = ""));
        }
      }

      // Enquadra tudo que existe, em vez de abrir sempre no Brasil inteiro.
      if (pontos.length > 0) {
        const limites = new maplibregl.LngLatBounds();
        for (const p of pontos) limites.extend([p.lng, p.lat]);
        map.fitBounds(limites, { padding: 60, maxZoom: 12, duration: 0 });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Visibilidade das camadas.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    for (const c of CAMADAS) {
      const v = visiveis[c.tipo] ? "visible" : "none";
      for (const id of [`${c.tipo}-cluster`, `${c.tipo}-cluster-count`, `${c.tipo}-ponto`]) {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", v);
      }
    }
  }, [visiveis]);

  // Filtro de período: refaz os dados das camadas que têm período (artigos
  // e trabalhos técnicos) — cluster precisa ser recalculado com o subconjunto.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    for (const tipo of ["artigo", "trabalho"] as const) {
      const fonte = map.getSource(`src-${tipo}`) as maplibregl.GeoJSONSource | undefined;
      const lista = periodoFiltro
        ? porTipo[tipo].filter((p) => p.periodo === periodoFiltro)
        : porTipo[tipo];
      fonte?.setData(geojson(lista));
    }
  }, [periodoFiltro, porTipo]);

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

  const alternar = (tipo: TipoPonto) => setVisiveis((v) => ({ ...v, [tipo]: !v[tipo] }));

  if (modoQuiosque) {
    return (
      <div className="flex h-full flex-col">
        <div className="mb-3 flex shrink-0 gap-3">
          {camadasComPontos.map((c) => (
            <button
              key={c.tipo}
              type="button"
              onClick={() => alternar(c.tipo)}
              aria-pressed={visiveis[c.tipo]}
              className="meta flex flex-1 items-center justify-center gap-2 border px-4 py-3 transition-transform active:scale-[0.97]"
              style={
                visiveis[c.tipo]
                  ? { backgroundColor: c.cor, borderColor: c.cor, color: c.texto }
                  : undefined
              }
            >
              <span className="inline-block h-3 w-3 rounded-full bg-current" aria-hidden />
              {c.rotulo}
            </button>
          ))}
        </div>

        <div className="relative min-h-0 flex-1">
          <div ref={containerRef} className="atlas-mapa totem-mapa h-full w-full" />
          <button
            type="button"
            onClick={() => mapRef.current?.easeTo({ center: CENTRO_INICIAL, zoom: ZOOM_INICIAL })}
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
      {camadasComPontos.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          {camadasComPontos.map((c) => (
            <label key={c.tipo} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={visiveis[c.tipo]}
                onChange={() => alternar(c.tipo)}
                className="h-4 w-4"
              />
              <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: c.cor }} aria-hidden />
              <span className="meta text-chumbo">
                {c.rotulo} <span className="text-chumbo-lt">({porTipo[c.tipo].length})</span>
              </span>
            </label>
          ))}
        </div>
      )}

      {temPeriodo && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPeriodoFiltro(null)}
            aria-pressed={periodoFiltro === null}
            className={`meta border px-3 py-1.5 ${
              periodoFiltro === null ? "border-lacre bg-lacre text-ouro" : "border-borda text-chumbo hover:border-lacre"
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
                periodoFiltro === p.id ? "border-lacre bg-lacre text-ouro" : "border-borda text-chumbo hover:border-lacre"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <div ref={containerRef} className="atlas-mapa aspect-[4/3] w-full border border-borda md:aspect-video" />
        {pontos.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="meta max-w-xs bg-paper/90 px-5 py-4 text-center text-chumbo">
              Nenhum lugar marcado ainda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
