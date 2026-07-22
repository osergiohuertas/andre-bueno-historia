"use server";

import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site";
import { inscreverNewsletter } from "@/lib/brevo";

export type EstadoCadastro =
  | { status: "idle" }
  | { status: "erro"; mensagem: string }
  | { status: "ok" };

export async function cadastrar(
  _estadoAnterior: EstadoCadastro,
  formData: FormData,
): Promise<EstadoCadastro> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      status: "erro",
      mensagem: "Cadastro ainda não está configurado neste ambiente.",
    };
  }

  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");

  if (!nome || !email || senha.length < 8) {
    return {
      status: "erro",
      mensagem: "Preencha nome, e-mail e uma senha com pelo menos 8 caracteres.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: { nome },
      emailRedirectTo: `${SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return {
      status: "erro",
      mensagem:
        error.code === "user_already_exists"
          ? "Já existe uma conta com esse e-mail."
          : "Não foi possível criar a conta.",
    };
  }

  // "Assinar carta" cadastra na comunidade E na newsletter ao mesmo tempo
  // — de propósito. A conta em si tem seu próprio double opt-in (só vira
  // membro depois de confirmar o e-mail, em auth/callback/route.ts); a
  // Brevo tem o dela, independente. Se a newsletter falhar (Brevo fora do
  // ar, não configurada), a conta já foi criada com sucesso — não
  // travamos o cadastro por causa disso, só deixamos de inscrever.
  await inscreverNewsletter(email);

  return { status: "ok" };
}
