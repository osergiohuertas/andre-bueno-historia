import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Mesmo esquema de carregamento de fonte usado nas rotas opengraph-image.tsx
// já existentes (artigos, opinião) — o satori (motor por trás do
// ImageResponse) só aceita fontes carregadas via bytes, não @font-face nem
// link de stylesheet, e sem User-Agent especial já lida bem com woff2.
async function carregarFonteGoogle(familia: string, peso: number, texto: string) {
  const url = `https://fonts.googleapis.com/css2?family=${familia}:wght@${peso}&text=${encodeURIComponent(texto)}`;
  const css = await fetch(url).then((r) => r.text());

  const match = css.match(/src: url\(([^)]+)\) format\('(\w+)'\)/);
  if (!match) throw new Error("Não encontrou a URL da fonte.");

  const resposta = await fetch(match[1]);
  return resposta.arrayBuffer();
}

/**
 * Miolo compartilhado das imagens OG do site — cada rota
 * opengraph-image.tsx busca o próprio dado e chama isto, em vez de
 * duplicar o JSX/estilo do satori em cada arquivo (como estava em
 * artigos/[slug] e opiniao/[slug] antes desta função existir).
 */
export async function gerarImagemOg({
  titulo,
  eyebrow,
}: {
  titulo: string;
  eyebrow?: string;
}) {
  const textoParaFonte = `${titulo} ${eyebrow ?? ""} André Bueno História`;

  let fontePlayfair: ArrayBuffer | null = null;
  try {
    fontePlayfair = await carregarFonteGoogle("Playfair+Display", 700, textoParaFonte);
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
          {eyebrow && (
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
              {eyebrow}
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
