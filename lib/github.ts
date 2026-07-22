import "server-only";

function configuracaoGithub() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !owner || !repo) return null;
  return { token, owner, repo, branch };
}

/**
 * Publica um MDX direto no repositório via Contents API do GitHub — cria o
 * commit sem precisar de git local. A Vercel já observa o repo, então o
 * deploy acontece sozinho depois do push.
 */
async function commitMdx(
  caminho: string,
  conteudoMdx: string,
  descricao: string,
): Promise<{ ok: true; url: string } | { ok: false; erro: string }> {
  const config = configuracaoGithub();
  if (!config) {
    return { ok: false, erro: "GitHub não está configurado neste ambiente." };
  }

  const { token, owner, repo, branch } = config;
  const base =
    `https://api.github.com/repos/${owner}/${repo}/contents/${caminho}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  try {
    // Existe já? Precisa do sha atual pra atualizar em vez de criar.
    let sha: string | undefined;
    const respostaAtual = await fetch(`${base}?ref=${branch}`, { headers });
    if (respostaAtual.ok) {
      const atual = await respostaAtual.json();
      sha = atual.sha;
    } else if (respostaAtual.status !== 404) {
      const erro = await respostaAtual.json().catch(() => null);
      return {
        ok: false,
        erro: erro?.message ?? "Erro ao consultar o arquivo no GitHub.",
      };
    }

    const resposta = await fetch(base, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: sha ? `Atualiza ${descricao}` : `Publica ${descricao}`,
        content: Buffer.from(conteudoMdx, "utf-8").toString("base64"),
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      return {
        ok: false,
        erro: dados?.message ?? "Erro ao publicar no GitHub.",
      };
    }

    return { ok: true, url: dados.content?.html_url ?? "" };
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : "Erro desconhecido.";
    return { ok: false, erro: `Erro ao publicar no GitHub: ${mensagem}` };
  }
}

export async function commitArtigoMdx(
  slug: string,
  conteudoMdx: string,
): Promise<{ ok: true; url: string } | { ok: false; erro: string }> {
  return commitMdx(`content/artigos/${slug}.mdx`, conteudoMdx, `artigo: ${slug}`);
}

export async function commitAcervoDocumentoMdx(
  slug: string,
  conteudoMdx: string,
): Promise<{ ok: true; url: string } | { ok: false; erro: string }> {
  return commitMdx(
    `content/acervo-documentos/${slug}.mdx`,
    conteudoMdx,
    `item de acervo: ${slug}`,
  );
}

export async function commitOpiniaoMdx(
  slug: string,
  conteudoMdx: string,
): Promise<{ ok: true; url: string } | { ok: false; erro: string }> {
  return commitMdx(
    `content/opinioes/${slug}.mdx`,
    conteudoMdx,
    `opinião: ${slug}`,
  );
}
