import { getEventoPorSlug } from "@/lib/eventos";
import { gerarImagemOg, size, contentType } from "@/lib/ogImage";

export { size, contentType };

export default async function OpenGraphEvento({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const evento = await getEventoPorSlug(slug);

  return gerarImagemOg({
    titulo: evento?.titulo ?? "André Bueno",
    eyebrow: evento ? `${evento.local} · ${evento.cidade}` : undefined,
  });
}
