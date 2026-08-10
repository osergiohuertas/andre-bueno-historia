import { getAcervoPorSlug } from "@/lib/acervo";
import { getPeriodo } from "@/data/periodos";
import { gerarImagemOg, size, contentType } from "@/lib/ogImage";

export { size, contentType };

export default async function OpenGraphAcervoDocumento({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getAcervoPorSlug(slug);

  return gerarImagemOg({
    titulo: item?.titulo ?? "André Bueno",
    eyebrow: item ? getPeriodo(item.periodo).label : undefined,
  });
}
