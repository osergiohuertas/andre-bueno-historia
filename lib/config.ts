import { createPublicClient } from "@/lib/supabase/public";

/**
 * Todas as chaves de um grupo do site_config, cru (chave completa -> valor).
 * Se a tabela não existir ainda (Supabase não provisionado) ou a query
 * falhar, retorna vazio — quem chama sempre cai nos defaults de código. O
 * banco enriquece; nunca é ponto único de falha.
 */
export async function getConfigGrupo(
  grupo: string,
): Promise<Record<string, string>> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_config")
      .select("chave, valor")
      .eq("grupo", grupo);

    if (error || !data) return {};

    return Object.fromEntries(data.map(({ chave, valor }) => [chave, valor]));
  } catch {
    return {};
  }
}
