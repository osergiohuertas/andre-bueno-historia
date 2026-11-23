import { createClient } from "@/lib/supabase/client";
import { prepararEnvioAction } from "@/app/painel/(protegido)/upload-actions";

export type ResultadoEnvio = { ok: true; url: string } | { ok: false; erro: string };

/**
 * Envia um arquivo do painel direto do navegador pro Supabase Storage. O
 * servidor só autoriza (prepararEnvioAction); os bytes vão do navegador
 * para o Storage, sem limite de tamanho do servidor do site no caminho.
 */
export async function enviarArquivo(
  arquivo: File,
  opcoes: { somentePdf?: boolean } = {},
): Promise<ResultadoEnvio> {
  try {
    const preparo = await prepararEnvioAction(arquivo.name, arquivo.size, opcoes.somentePdf);
    if (!preparo.ok) return preparo;

    // Com File/Blob, o Storage usa o tipo do próprio arquivo (a opção
    // contentType é ignorada) — e alguns chegam sem tipo (.jfif, arquivos do
    // WhatsApp), o que o bucket recusa. Reembrulha com o tipo certo.
    const comTipo = new File([arquivo], arquivo.name, { type: preparo.tipo });
    const { error } = await createClient()
      .storage.from("uploads")
      .uploadToSignedUrl(preparo.caminho, preparo.token, comTipo, {
        contentType: preparo.tipo,
      });
    if (error) return { ok: false, erro: `Falha no envio: ${error.message}` };

    return { ok: true, url: preparo.url };
  } catch {
    return { ok: false, erro: "Falha de conexão no envio — tente de novo." };
  }
}
