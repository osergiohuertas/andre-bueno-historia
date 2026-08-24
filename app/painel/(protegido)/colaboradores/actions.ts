"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { exigirAdmin } from "@/lib/painel-auth";
import { SITE_URL } from "@/lib/site";

export type EstadoColaborador = { ok: boolean; mensagem: string } | null;

export async function convidarColaboradorAction(
  _estadoAnterior: EstadoColaborador,
  formData: FormData,
): Promise<EstadoColaborador> {
  const guarda = await exigirAdmin();
  if (!guarda.ok) return guarda;

  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!nome || !email) {
    return { ok: false, mensagem: "Preencha nome e e-mail." };
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${SITE_URL}/painel/convite/aceitar`,
    data: { nome },
  });

  if (error || !data.user) {
    return {
      ok: false,
      mensagem:
        error?.code === "email_exists"
          ? "Já existe uma conta com esse e-mail."
          : "Não foi possível enviar o convite.",
    };
  }

  const { error: erroInsercao } = await admin
    .from("colaboradores")
    .insert({ id: data.user.id, nome, email });

  if (erroInsercao) {
    return { ok: false, mensagem: "Convite enviado, mas houve um erro ao salvar o colaborador." };
  }

  revalidatePath("/painel/colaboradores");
  return { ok: true, mensagem: `Convite enviado para ${email}.` };
}

export async function alternarColaboradorAction(
  id: string,
  ativo: boolean,
): Promise<{ ok: boolean; mensagem: string }> {
  const guarda = await exigirAdmin();
  if (!guarda.ok) return guarda;

  const admin = createAdminClient();
  const { error } = await admin
    .from("colaboradores")
    .update({ ativo })
    .eq("id", id);

  if (error) {
    return { ok: false, mensagem: "Erro ao atualizar." };
  }

  revalidatePath("/painel/colaboradores");
  return { ok: true, mensagem: ativo ? "Reativado." : "Desativado." };
}
