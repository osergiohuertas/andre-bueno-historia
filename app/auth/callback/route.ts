import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Destino do link de confirmação de e-mail (double opt-in). Só depois
 * dessa troca de código por sessão é que o leitor vira membro de
 * verdade — cria a linha em `membros` aqui, nunca no cadastro em si.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const nome =
        typeof data.user.user_metadata?.nome === "string"
          ? data.user.user_metadata.nome
          : (data.user.email ?? "Leitor");

      const admin = createAdminClient();
      await admin
        .from("membros")
        .upsert({ id: data.user.id, nome }, { onConflict: "id" });

      return NextResponse.redirect(`${origin}/conta`);
    }
  }

  return NextResponse.redirect(`${origin}/conta/entrar`);
}
