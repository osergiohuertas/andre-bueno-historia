import { createClient } from "@/lib/supabase/server";

export type Leitor = {
  id: string;
  nome: string;
  email: string | null;
};

/**
 * Retorna o leitor autenticado, ou null se não houver sessão OU se quem
 * está logado for o André (sem linha em `membros`) — as áreas de leitor
 * nunca tratam o André como um dos seus.
 */
export async function getLeitorAtual(): Promise<Leitor | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: membro } = await supabase
    .from("membros")
    .select("id, nome")
    .eq("id", user.id)
    .maybeSingle();

  if (!membro) return null;

  return { id: membro.id, nome: membro.nome, email: user.email ?? null };
}
