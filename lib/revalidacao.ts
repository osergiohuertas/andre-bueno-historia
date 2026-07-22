import { revalidatePath } from "next/cache";
import { getArtigosConectadosAoLivro } from "@/lib/artigos";

/**
 * Cada grupo do site_config afeta rotas específicas. Chamar depois de
 * qualquer escrita bem-sucedida — é o que faz o André ver a mudança no ar
 * em segundos, sem deploy.
 */
export function revalidarPorGrupo(grupo: string) {
  switch (grupo) {
    case "home":
      revalidatePath("/");
      return;
    case "livro":
      revalidatePath("/livro");
      // CardConexaoLivro mostra livro.titulo dentro do artigo.
      for (const artigo of getArtigosConectadosAoLivro()) {
        revalidatePath(artigo.url);
      }
      return;
    case "sobre":
      revalidatePath("/sobre");
      return;
    case "identidade":
    case "rodape":
    case "seo":
      // Aparecem no chrome global (header/footer/metadata) de todo o site.
      revalidatePath("/", "layout");
      return;
    default:
      revalidatePath("/");
  }
}
