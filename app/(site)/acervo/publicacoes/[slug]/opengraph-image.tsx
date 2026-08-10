import { getPublicacaoPorSlug } from "@/lib/obra";
import { gerarImagemOg, size, contentType } from "@/lib/ogImage";

export { size, contentType };

export default async function OpenGraphPublicacao({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const publicacao = await getPublicacaoPorSlug(slug);

  return gerarImagemOg({
    titulo: publicacao?.titulo ?? "André Bueno",
    eyebrow: publicacao ? `${publicacao.veiculo} · ${publicacao.ano}` : undefined,
  });
}
