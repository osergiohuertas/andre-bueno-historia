"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function definirSenhaAction(
  _estadoAnterior: string | null,
  formData: FormData,
) {
  const senha = String(formData.get("senha") ?? "");
  const confirmacao = String(formData.get("confirmacao") ?? "");

  if (senha.length < 8) {
    return "A senha precisa ter pelo menos 8 caracteres.";
  }
  if (senha !== confirmacao) {
    return "As senhas não são iguais.";
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return "Sessão de convite expirada — peça um novo convite.";
  }

  const { error } = await supabase.auth.updateUser({ password: senha });
  if (error) {
    return "Não foi possível definir a senha.";
  }

  redirect("/painel/artigos");
}
