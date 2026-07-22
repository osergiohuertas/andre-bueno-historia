import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Mesmo esquema de carregamento de fonte do opengraph-image.tsx — o satori
// (motor por trás do ImageResponse) só aceita fontes carregadas via bytes,
// não @font-face nem link de stylesheet.
async function carregarFonteGoogle(familia: string, peso: number, texto: string) {
  const url = `https://fonts.googleapis.com/css2?family=${familia}:wght@${peso}&text=${encodeURIComponent(texto)}`;
  const css = await fetch(url).then((r) => r.text());

  const match = css.match(/src: url\(([^)]+)\) format\('(\w+)'\)/);
  if (!match) throw new Error("Não encontrou a URL da fonte.");

  const resposta = await fetch(match[1]);
  return resposta.arrayBuffer();
}

export default async function Icon() {
  let fontePlayfair: ArrayBuffer | null = null;
  try {
    fontePlayfair = await carregarFonteGoogle("Playfair+Display", 700, "A");
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
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0E1B33",
          borderRadius: "50%",
        }}
      >
        <span
          style={{
            fontFamily: fontePlayfair ? "Playfair Display" : "serif",
            fontWeight: 700,
            fontSize: 22,
            color: "#B8902A",
            lineHeight: 1,
          }}
        >
          A
        </span>
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
