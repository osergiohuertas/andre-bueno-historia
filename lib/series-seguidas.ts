import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getSeriesSeguidasPeloMembro(
  membroId: string,
): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("seguidores_serie")
    .select("serie_slug")
    .eq("membro_id", membroId);

  if (error || !data) return [];
  return data.map((d) => d.serie_slug);
}

export async function estaSeguindo(
  membroId: string,
  serieSlug: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("seguidores_serie")
    .select("id")
    .eq("membro_id", membroId)
    .eq("serie_slug", serieSlug)
    .maybeSingle();

  return !!data;
}

/**
 * Lista de e-mails dos seguidores de uma série, pra disparo de
 * notificação. Usa o client admin (service role): quem publica é o
 * André, que não tem acesso via RLS às linhas de outros membros.
 */
export async function getSeguidoresDaSerie(
  serieSlug: string,
): Promise<{ email: string; nome: string }[]> {
  const admin = createAdminClient();

  const { data: seguidores, error } = await admin
    .from("seguidores_serie")
    .select("membro_id")
    .eq("serie_slug", serieSlug);

  if (error || !seguidores || seguidores.length === 0) return [];

  const { data: membros } = await admin
    .from("membros")
    .select("id, nome")
    .in(
      "id",
      seguidores.map((s) => s.membro_id),
    );

  if (!membros) return [];

  const comEmail = await Promise.all(
    membros.map(async (m) => {
      const { data } = await admin.auth.admin.getUserById(m.id);
      return { nome: m.nome, email: data.user?.email ?? null };
    }),
  );

  return comEmail.filter(
    (m): m is { nome: string; email: string } => !!m.email,
  );
}
