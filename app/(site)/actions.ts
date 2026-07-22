"use server";

import { inscreverNewsletter } from "@/lib/brevo";

export type EstadoNewsletter =
  | { status: "idle" }
  | { status: "erro"; mensagem: string }
  | { status: "ok" };

export async function inscreverNewsletterAction(
  _estadoAnterior: EstadoNewsletter,
  formData: FormData,
): Promise<EstadoNewsletter> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !email.includes("@")) {
    return { status: "erro", mensagem: "Digite um e-mail válido." };
  }

  const resultado = await inscreverNewsletter(email);

  if (!resultado.ok) {
    return { status: "erro", mensagem: resultado.erro };
  }

  return { status: "ok" };
}
