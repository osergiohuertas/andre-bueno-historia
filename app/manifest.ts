import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "André Bueno — História",
    short_name: "André Bueno",
    description:
      "Pesquisa, escrita e acervo sobre a história do Brasil, do historiador André Bueno.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F3EC", // token `paper`
    theme_color: "#0E1B33", // token `ink`
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
