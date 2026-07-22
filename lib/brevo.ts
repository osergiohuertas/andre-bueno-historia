import "server-only";

function configuracaoRemetente() {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderNome = process.env.BREVO_SENDER_NOME || "André Bueno";

  if (!apiKey || !senderEmail) return null;
  return { apiKey, senderEmail, senderNome };
}

/**
 * Notifica quem segue uma série que saiu uma parte nova. Envia um e-mail
 * por destinatário (nunca todos no mesmo "to") — ninguém vê o e-mail de
 * outro seguidor.
 */
export async function enviarEmailNotificacaoSerie(params: {
  destinatarios: { email: string; nome: string }[];
  serieNome: string;
  artigoTitulo: string;
  artigoUrl: string;
}): Promise<{ ok: true; enviados: number } | { ok: false; erro: string }> {
  const config = configuracaoRemetente();
  if (!config) {
    return {
      ok: false,
      erro: "Notificação por e-mail não está configurada neste ambiente.",
    };
  }

  if (params.destinatarios.length === 0) return { ok: true, enviados: 0 };

  const envios = await Promise.allSettled(
    params.destinatarios.map((destinatario) =>
      fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": config.apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: { email: config.senderEmail, name: config.senderNome },
          to: [{ email: destinatario.email, name: destinatario.nome }],
          subject: `Nova parte de "${params.serieNome}" no ar`,
          htmlContent: `<p>Olá, ${destinatario.nome}.</p><p>Saiu uma parte nova da série que você segue — <strong>${params.serieNome}</strong>:</p><p><a href="${params.artigoUrl}">${params.artigoTitulo}</a></p>`,
        }),
      }),
    ),
  );

  const enviados = envios.filter(
    (r) => r.status === "fulfilled" && r.value.ok,
  ).length;

  return { ok: true, enviados };
}

function configuracaoBrevo() {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;
  const templateId = process.env.BREVO_TEMPLATE_ID;
  const redirectionUrl = process.env.BREVO_REDIRECT_URL;

  if (!apiKey || !listId || !templateId || !redirectionUrl) return null;
  return {
    apiKey,
    listId: Number(listId),
    templateId: Number(templateId),
    redirectionUrl,
  };
}

/**
 * Inscrição com double opt-in (exigência de LGPD): o contato só entra na
 * lista depois de confirmar pelo e-mail que a Brevo envia via o
 * doubleOptinConfirmation endpoint — nunca inscrevemos direto.
 */
export async function inscreverNewsletter(
  email: string,
): Promise<{ ok: true } | { ok: false; erro: string }> {
  const config = configuracaoBrevo();
  if (!config) {
    return { ok: false, erro: "Newsletter não está configurada neste ambiente." };
  }

  try {
    const resposta = await fetch(
      "https://api.brevo.com/v3/contacts/doubleOptinConfirmation",
      {
        method: "POST",
        headers: {
          "api-key": config.apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          includeListIds: [config.listId],
          templateId: config.templateId,
          redirectionUrl: config.redirectionUrl,
        }),
      },
    );

    if (resposta.status === 204 || resposta.status === 201) {
      return { ok: true };
    }

    const dados = await resposta.json().catch(() => null);

    // Brevo trata "já inscrito" como erro de duplicidade — do ponto de
    // vista do leitor, isso não é uma falha.
    if (dados?.code === "duplicate_parameter") {
      return { ok: true };
    }

    return {
      ok: false,
      erro: dados?.message ?? "Erro ao inscrever na newsletter.",
    };
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : "Erro desconhecido.";
    return { ok: false, erro: `Erro ao contatar a Brevo: ${mensagem}` };
  }
}
