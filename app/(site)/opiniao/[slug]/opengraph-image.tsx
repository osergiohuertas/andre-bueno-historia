import { ImageResponse } from "next/og";
import { getOpiniaoBySlug } from "@/lib/opinioes";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function carregarFonteGoogle(familia: string, peso: number, texto: string) {
  const url = `https://fonts.googleapis.com/css2?family=${familia}:wght@${peso}&text=${encodeURIComponent(texto)}`;
  const css = await fetch(url).then((r) => r.text());

  const match = css.match(/src: url\(([^)]+)\) format\('(\w+)'\)/);
  if (!match) throw new Error("Não encontrou a URL da fonte.");

  const resposta = await fetch(match[1]);
  return resposta.arrayBuffer();
}

export default async function OpenGraphOpiniao({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opiniao = getOpiniaoBySlug(slug);
  const titulo = opiniao?.titulo ?? "André Bueno";

  const textoParaFonte = `${titulo} Opinião André Bueno História`;

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
          <span
            style={{
              display: "flex",
              alignSelf: "flex-start",
              fontFamily: "Inter, sans-serif",
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#0E1B33",
              backgroundColor: "#B8902A",
              padding: "6px 16px",
              marginBottom: 24,
            }}
          >
            Opinião
          </span>
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
