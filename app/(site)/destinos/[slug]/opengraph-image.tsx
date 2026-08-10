import { getDestinoPorSlug } from "@/lib/destinos";
import { gerarImagemOg, size, contentType } from "@/lib/ogImage";

export { size, contentType };

export default async function OpenGraphDestino({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destino = await getDestinoPorSlug(slug);

  return gerarImagemOg({
    titulo: destino?.nome ?? "André Bueno",
    eyebrow: destino ? `${destino.tipologia} · ${destino.cidade}` : undefined,
  });
}
