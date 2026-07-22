import { ImageResponse } from "next/og";
import { getArtigoBySlug } from "@/lib/artigos";
import { getPeriodo } from "@/data/periodos";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function carregarFonteGoogle(familia: string, peso: number, texto: string) {
  // Sem User-Agent especial: o satori atual lida bem com woff2, que é o
  // formato padrão que o Google Fonts retorna.
  const url = `https://fonts.googleapis.com/css2?family=${familia}:wght@${peso}&text=${encodeURIComponent(texto)}`;
  const css = await fetch(url).then((r) => r.text());

  const match = css.match(/src: url\(([^)]+)\) format\('(\w+)'\)/);
  if (!match) throw new Error("Não encontrou a URL da fonte.");

  const resposta = await fetch(match[1]);
  return resposta.arrayBuffer();
}

export default async function OpenGraphArtigo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artigo = getArtigoBySlug(slug);
  const titulo = artigo?.titulo ?? "André Bueno";
  const periodoLabel = artigo ? getPeriodo(artigo.periodo).label : "";

  const textoParaFonte = `${titulo} ${periodoLabel} André Bueno História`;

  let fontePlayfair: ArrayBuffer | null = null;
  try {
    fontePlayfair = await carregarFonteGoogle(
      "Playfair+Display",
      700,
      textoParaFonte,
    );
  } catch {
    fontePlayfair = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0E1B33",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#B8902A",
            }}
          >
            André Bueno · História
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {periodoLabel && (
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 22,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#B8902A",
                marginBottom: 24,
              }}
            >
              {periodoLabel}
            </span>
          )}
          <span
            style={{
              fontFamily: fontePlayfair ? "Playfair Display" : "serif",
              fontSize: 60,
              lineHeight: 1.15,
              color: "#F7F3EC",
              maxWidth: 980,
            }}
          >
            {titulo}
          </span>
        </div>

        <div style={{ display: "flex", width: 120, height: 4, backgroundColor: "#B8902A" }} />
      </div>
    ),
    {
      ...size,
      fonts: fontePlayfair
        ? [{ name: "Playfair Display", data: fontePlayfair, weight: 700 }]
        : [],
    },
  );
}
