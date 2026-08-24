import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Destino do link de convite enviado por inviteUserByEmail (ver
 * app/painel/(protegido)/colaboradores/actions.ts). Troca o código do
 * e-mail por uma sessão de verdade — só depois disso o colaborador pode
 * definir a própria senha em /painel/convite/senha. A linha em
 * `colaboradores` já existe desde o convite, então o middleware já
 * reconhece o papel assim que a sessão é criada.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}/painel/convite/senha`);
    }
  }

  return NextResponse.redirect(`${origin}/painel/login`);
}
