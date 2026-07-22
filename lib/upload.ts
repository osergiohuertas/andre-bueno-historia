import "server-only";
import { randomUUID } from "node:crypto";

const BUCKET = "uploads";

/**
 * Upload de imagens do painel — bucket público no Supabase Storage
 * (mesmo projeto que já hospeda o banco, sem depender de uma conta
 * externa como a Cloudinary). Escrita sempre via service role key,
 * nunca exposta ao cliente; o bucket é público só para LEITURA.
 */
export async function uploadImagem(
  arquivo: Buffer,
  nomeArquivo: string,
): Promise<{ ok: true; url: string } | { ok: false; erro: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return { ok: false, erro: "Supabase não está configurado neste ambiente." };
  }

  const extensao = nomeArquivo.includes(".")
    ? nomeArquivo.slice(nomeArquivo.lastIndexOf("."))
    : "";
  const caminho = `andre-bueno/${randomUUID()}${extensao}`;
  const tipoConteudo = tipoMimePorExtensao(extensao);

  try {
    const resposta = await fetch(
      `${supabaseUrl}/storage/v1/object/${BUCKET}/${caminho}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          "Content-Type": tipoConteudo,
        },
        body: new Uint8Array(arquivo),
      },
    );

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);
      return {
        ok: false,
        erro: erro?.message ?? "Erro ao enviar imagem para o Supabase.",
      };
    }

    return {
      ok: true,
      url: `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${caminho}`,
    };
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : "Erro desconhecido.";
    return { ok: false, erro: `Erro ao enviar imagem: ${mensagem}` };
  }
}

function tipoMimePorExtensao(extensao: string): string {
  switch (extensao.toLowerCase()) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".jpg":
    case ".jpeg":
    default:
      return "image/jpeg";
  }
}
