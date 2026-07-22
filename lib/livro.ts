import { getConfigGrupo } from "@/lib/config";
import { LIVRO_DEFAULTS } from "@/data/livro.defaults";

export async function getLivroConfig() {
  const cfg = await getConfigGrupo("livro");
  const pega = (chave: string, fallback: string) => cfg[chave] ?? fallback;

  return {
    titulo: pega("livro.titulo", LIVRO_DEFAULTS.titulo),
    subtitulo: pega("livro.subtitulo", LIVRO_DEFAULTS.subtitulo),
    argumento: pega("livro.argumento", LIVRO_DEFAULTS.argumento),
    sobre: pega("livro.sobre", LIVRO_DEFAULTS.sobre),
    capaUrl: cfg["livro.capa_url"] ?? LIVRO_DEFAULTS.capaUrl,
    amazonUrlFisico: pega(
      "livro.amazon.url_fisico",
      LIVRO_DEFAULTS.amazonUrlFisico,
    ),
    amazonUrlKindle: pega(
      "livro.amazon.url_kindle",
      LIVRO_DEFAULTS.amazonUrlKindle,
    ),
    amazonTagAfiliado: pega(
      "livro.amazon.tag_afiliado",
      LIVRO_DEFAULTS.amazonTagAfiliado,
    ),
    amostraPdfUrl: cfg["livro.amostra_pdf_url"] ?? LIVRO_DEFAULTS.amostraPdfUrl,
    revelacoes: LIVRO_DEFAULTS.revelacoes.map((padrao, i) => ({
      titulo: cfg[`livro.revelacao.${i + 1}.titulo`] ?? padrao.titulo,
      descricao: cfg[`livro.revelacao.${i + 1}.texto`] ?? padrao.descricao,
    })),
  };
}
