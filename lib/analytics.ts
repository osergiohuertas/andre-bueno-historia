import { createAdminClient } from "@/lib/supabase/admin";
import { getArtigosPublicados } from "@/lib/artigos";
import { periodosOrdenados, type PeriodoId } from "@/data/periodos";

export type LeiturasPorPeriodo = {
  periodoId: PeriodoId;
  label: string;
  leituras: number;
};

export type ArtigoMaisLido = {
  slug: string;
  titulo: string;
  leituras: number;
};

function supabaseConfigurado(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * "Quem lê o quê" é derivado só do que a própria plataforma sabe
 * (biblioteca_pessoal.lido) — não há integração com stats do Umami
 * (exigiria token de API que não está configurado neste ambiente).
 */
export async function getTotalMembros(): Promise<number> {
  if (!supabaseConfigurado()) return 0;

  const admin = createAdminClient();
  const { count } = await admin
    .from("membros")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

async function getContagemLeiturasPorArtigo(): Promise<Map<string, number>> {
  const contagem = new Map<string, number>();
  if (!supabaseConfigurado()) return contagem;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("biblioteca_pessoal")
    .select("artigo_slug")
    .eq("lido", true);

  if (error || !data) return contagem;

  for (const row of data) {
    contagem.set(row.artigo_slug, (contagem.get(row.artigo_slug) ?? 0) + 1);
  }
  return contagem;
}

export async function getLeiturasPorPeriodo(): Promise<LeiturasPorPeriodo[]> {
  const contagemPorArtigo = await getContagemLeiturasPorArtigo();
  const artigos = getArtigosPublicados();

  const contagemPorPeriodo = new Map<PeriodoId, number>();
  for (const artigo of artigos) {
    const leituras = contagemPorArtigo.get(artigo.slug) ?? 0;
    contagemPorPeriodo.set(
      artigo.periodo,
      (contagemPorPeriodo.get(artigo.periodo) ?? 0) + leituras,
    );
  }

  return periodosOrdenados().map((p) => ({
    periodoId: p.id,
    label: p.label,
    leituras: contagemPorPeriodo.get(p.id) ?? 0,
  }));
}

export async function getArtigosMaisLidos(
  limite = 10,
): Promise<ArtigoMaisLido[]> {
  const contagemPorArtigo = await getContagemLeiturasPorArtigo();
  const artigos = getArtigosPublicados();

  return artigos
    .map((a) => ({
      slug: a.slug,
      titulo: a.titulo,
      leituras: contagemPorArtigo.get(a.slug) ?? 0,
    }))
    .filter((a) => a.leituras > 0)
    .sort((a, b) => b.leituras - a.leituras)
    .slice(0, limite);
}

export async function getTotalLeituras(): Promise<number> {
  if (!supabaseConfigurado()) return 0;

  const admin = createAdminClient();
  const { count } = await admin
    .from("biblioteca_pessoal")
    .select("*", { count: "exact", head: true })
    .eq("lido", true);
  return count ?? 0;
}
