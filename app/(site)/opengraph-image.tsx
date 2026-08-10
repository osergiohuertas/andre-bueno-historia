import { gerarImagemOg, size, contentType } from "@/lib/ogImage";

export { size, contentType };

// Fallback genérico — cobre a home e qualquer página sob (site) que não
// tenha o próprio opengraph-image.tsx (ex.: /sobre, /livro), por herança
// de rota (convenção de arquivo do Next).
export default async function OpenGraphSite() {
  return gerarImagemOg({
    titulo: "História do Brasil, pesquisada e contada por André Bueno",
    eyebrow: "André Bueno",
  });
}
