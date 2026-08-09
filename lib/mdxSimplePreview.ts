/**
 * Preview simplificado de MDX pra formulários do painel — entende só
 * parágrafos separados por linha em branco e `## ` como subtítulo. Não é
 * o pipeline real de compilação MDX (que exigiria new Function() + runtime
 * JSX), é uma prévia aproximada pra conferir estrutura antes de salvar.
 * Compartilhado entre a etapa de revisão do wizard e o formulário de
 * edição de artigo — client-safe, sem dependência de servidor.
 */
export function blocosMdxSimples(mdx: string): { tipo: "h2" | "p"; texto: string }[] {
  const blocos = mdx.trim().split(/\n{2,}/);
  return blocos
    .filter((b) => b.trim())
    .map((bloco) =>
      bloco.startsWith("## ")
        ? { tipo: "h2" as const, texto: bloco.replace(/^##\s+/, "") }
        : { tipo: "p" as const, texto: bloco },
    );
}
