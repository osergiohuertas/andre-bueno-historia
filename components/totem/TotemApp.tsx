"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EstadoAtracao } from "@/components/totem/EstadoAtracao";
import { EstadoMenu } from "@/components/totem/EstadoMenu";
import { EstadoTimeline, type PeriodoComArtigos } from "@/components/totem/EstadoTimeline";
import { EstadoArtigoPreview, type ArtigoPreviewData } from "@/components/totem/EstadoArtigoPreview";
import { EstadoAcervo, type PeriodoComAcervo } from "@/components/totem/EstadoAcervo";
import { EstadoAcervoPreview, type AcervoPreviewData } from "@/components/totem/EstadoAcervoPreview";
import { EstadoMapa } from "@/components/totem/EstadoMapa";
import { EstadoMuseuPreview, type MuseuPreviewData } from "@/components/totem/EstadoMuseuPreview";
import { EstadoSobre } from "@/components/totem/EstadoSobre";
import { PonteQR } from "@/components/totem/PonteQR";
import { BotaoInicio } from "@/components/totem/BotaoInicio";
import { ResetAviso } from "@/components/totem/ResetAviso";
import { TotemErrorBoundary } from "@/components/totem/TotemErrorBoundary";
import type { FraseAtracao } from "@/lib/totem";
import type { PontoArtigo, PontoMuseu } from "@/lib/atlas";

type Estado =
  | { tipo: "atracao" }
  | { tipo: "menu" }
  | { tipo: "timeline" }
  | { tipo: "artigo-preview"; artigo: ArtigoPreviewData; voltarPara: "timeline" | "mapa" }
  | { tipo: "acervo" }
  | { tipo: "acervo-preview"; documento: AcervoPreviewData }
  | { tipo: "mapa" }
  | { tipo: "museu-preview"; museu: MuseuPreviewData }
  | { tipo: "sobre" }
  | { tipo: "qr"; titulo: string; url: string };

const SEGUNDOS_AVISO = 10;

function construirUrlComUtm(siteUrl: string, caminho: string, utmCampaign: string) {
  const url = new URL(caminho, siteUrl);
  url.searchParams.set("utm_source", "totem");
  url.searchParams.set("utm_medium", "qr");
  url.searchParams.set("utm_campaign", utmCampaign);
  return url.toString();
}

// Chave da error boundary: precisa mudar mesmo entre dois QRs diferentes
// (ambos tipo "qr"), senão a boundary não remonta e fica travada em
// "com erro" se o segundo QR quebrar — ver TotemErrorBoundary.
function chaveEstado(estado: Estado): string {
  return estado.tipo === "qr" ? `qr:${estado.url}` : estado.tipo;
}

export function TotemApp({
  nomeSite,
  siteUrl,
  utmCampaign,
  resetSegundos,
  frases,
  periodos,
  periodosAcervo,
  pontosArtigos,
  pontosMuseus,
  museus,
  sobre,
}: {
  nomeSite: string;
  siteUrl: string;
  utmCampaign: string;
  resetSegundos: number;
  frases: FraseAtracao[];
  periodos: PeriodoComArtigos[];
  periodosAcervo: PeriodoComAcervo[];
  pontosArtigos: PontoArtigo[];
  pontosMuseus: PontoMuseu[];
  museus: MuseuPreviewData[];
  sobre: { manifesto: string; trajetoria: string; fotoUrl: string };
}) {
  const [estado, setEstado] = useState<Estado>({ tipo: "atracao" });
  const [avisoAtivo, setAvisoAtivo] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(SEGUNDOS_AVISO);

  // Lookups pro toque num pino do mapa: o ponto no GeoJSON só carrega
  // slug/título/url — a ficha rica (foto, horário, corpo do artigo) vem
  // daqui, sem duplicar os dados na camada do MapLibre.
  const artigosPorSlug = useMemo(() => {
    const mapa = new Map<string, ArtigoPreviewData>();
    for (const p of periodos) for (const a of p.artigos) mapa.set(a.slug, a);
    return mapa;
  }, [periodos]);

  const museusPorSlug = useMemo(
    () => new Map(museus.map((m) => [m.slug, m])),
    [museus],
  );

  const estadoRef = useRef(estado);
  const lastInteracaoRef = useRef(0);

  useEffect(() => {
    estadoRef.current = estado;
  }, [estado]);

  function irPara(novoEstado: Estado) {
    lastInteracaoRef.current = Date.now();
    setAvisoAtivo(false);
    setEstado(novoEstado);
  }

  function abrirPonteQR(info: { titulo: string; url: string }) {
    irPara({ tipo: "qr", titulo: info.titulo, url: construirUrlComUtm(siteUrl, info.url, utmCampaign) });
  }

  function aoSelecionarPontoNoMapa(info: {
    tipo: "artigo" | "museu";
    slug: string;
    titulo: string;
    url: string;
  }) {
    if (info.tipo === "museu") {
      const museu = museusPorSlug.get(info.slug);
      if (museu) {
        irPara({ tipo: "museu-preview", museu });
        return;
      }
    } else {
      const artigo = artigosPorSlug.get(info.slug);
      if (artigo) {
        irPara({ tipo: "artigo-preview", artigo, voltarPara: "mapa" });
        return;
      }
    }
    // Não deveria acontecer (todo pino vem de uma lista já carregada), mas
    // se o lookup falhar, ainda oferece o QR em vez de travar o toque.
    abrirPonteQR({ titulo: info.titulo, url: info.url });
  }

  // Timer único de ociosidade — sobrevive a todas as trocas de estado sem
  // recriar listener/interval (só depende de resetSegundos, que não muda
  // durante a sessão). Ver critério de aceite: 200 trocas de estado não
  // podem acumular listeners.
  useEffect(() => {
    function registrarInteracao() {
      lastInteracaoRef.current = Date.now();
      setAvisoAtivo(false);
    }

    lastInteracaoRef.current = Date.now();
    window.addEventListener("pointerdown", registrarInteracao);

    const id = setInterval(() => {
      if (estadoRef.current.tipo === "atracao") return;

      const decorridos = (Date.now() - lastInteracaoRef.current) / 1000;
      const restantes = resetSegundos - decorridos;

      if (restantes <= 0) {
        setAvisoAtivo(false);
        setEstado({ tipo: "atracao" });
      } else if (restantes <= SEGUNDOS_AVISO) {
        setAvisoAtivo(true);
        setSegundosRestantes(Math.ceil(restantes));
      } else {
        setAvisoAtivo(false);
      }
    }, 1000);

    return () => {
      window.removeEventListener("pointerdown", registrarInteracao);
      clearInterval(id);
    };
  }, [resetSegundos]);

  // Wake lock: totem roda por horas sem ninguém tocar — sem isso, o SO pode
  // deixar a tela dormir no meio do attract loop. Opcional por natureza
  // (nem todo navegador/contexto suporta), degrada em silêncio se recusar.
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;

    async function pedirWakeLock() {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
        }
      } catch {
        // Sem HTTPS, sem suporte, ou aba em segundo plano — segue o jogo.
      }
    }

    pedirWakeLock();

    function aoVisibilidadeMudar() {
      if (document.visibilityState === "visible") pedirWakeLock();
    }
    document.addEventListener("visibilitychange", aoVisibilidadeMudar);

    return () => {
      document.removeEventListener("visibilitychange", aoVisibilidadeMudar);
      wakeLock?.release().catch(() => {});
    };
  }, []);

  return (
    <div className="totem-shell relative h-full w-full">
      <TotemErrorBoundary key={chaveEstado(estado)} onErro={() => irPara({ tipo: "atracao" })}>
        {estado.tipo === "atracao" && (
          <EstadoAtracao frases={frases} onTocar={() => irPara({ tipo: "menu" })} />
        )}

        {estado.tipo === "menu" && (
          <EstadoMenu nomeSite={nomeSite} onEscolher={(destino) => irPara({ tipo: destino })} />
        )}

        {estado.tipo === "timeline" && (
          <EstadoTimeline
            periodos={periodos}
            onAbrirPreviaArtigo={(artigo) =>
              irPara({ tipo: "artigo-preview", artigo, voltarPara: "timeline" })
            }
          />
        )}

        {estado.tipo === "artigo-preview" && (
          <EstadoArtigoPreview
            artigo={estado.artigo}
            onContinuarNoCelular={() =>
              abrirPonteQR({ titulo: estado.artigo.titulo, url: estado.artigo.url })
            }
            onVoltar={() => irPara({ tipo: estado.voltarPara })}
          />
        )}

        {estado.tipo === "acervo" && (
          <EstadoAcervo
            periodos={periodosAcervo}
            onAbrirPreviaDocumento={(documento) => irPara({ tipo: "acervo-preview", documento })}
          />
        )}

        {estado.tipo === "acervo-preview" && (
          <EstadoAcervoPreview
            documento={estado.documento}
            onContinuarNoCelular={() =>
              abrirPonteQR({ titulo: estado.documento.titulo, url: estado.documento.pdfUrl })
            }
            onVoltar={() => irPara({ tipo: "acervo" })}
          />
        )}

        {estado.tipo === "mapa" && (
          <EstadoMapa
            pontosArtigos={pontosArtigos}
            pontosMuseus={pontosMuseus}
            onSelecionarPonto={aoSelecionarPontoNoMapa}
          />
        )}

        {estado.tipo === "museu-preview" && (
          <EstadoMuseuPreview
            museu={estado.museu}
            onContinuarNoCelular={() =>
              abrirPonteQR({ titulo: estado.museu.nome, url: estado.museu.url })
            }
            onVoltar={() => irPara({ tipo: "mapa" })}
          />
        )}

        {estado.tipo === "sobre" && (
          <EstadoSobre
            nomeSite={nomeSite}
            manifesto={sobre.manifesto}
            trajetoria={sobre.trajetoria}
            fotoUrl={sobre.fotoUrl}
            onConhecerObra={() =>
              abrirPonteQR({ titulo: "O Livro", url: "/livro" })
            }
          />
        )}

        {estado.tipo === "qr" && (
          <PonteQR
            titulo={estado.titulo}
            url={estado.url}
            onExplorarMais={() => irPara({ tipo: "menu" })}
          />
        )}
      </TotemErrorBoundary>

      {estado.tipo !== "atracao" && (
        <BotaoInicio
          onTocar={() =>
            // Na própria tela de menu, "Início" já está no início — tocar
            // de novo devolve pro modo de espera (attract loop), não fica
            // parado sem reação. Nas demais telas continua voltando pro
            // menu, como antes.
            irPara(estado.tipo === "menu" ? { tipo: "atracao" } : { tipo: "menu" })
          }
        />
      )}

      {avisoAtivo && (
        <ResetAviso
          segundosRestantes={segundosRestantes}
          onContinuar={() => {
            lastInteracaoRef.current = Date.now();
            setAvisoAtivo(false);
          }}
        />
      )}
    </div>
  );
}
