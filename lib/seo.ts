import { getConfigGrupo } from "@/lib/config";

const PADRAO_TITULO = "André Bueno — História";
const PADRAO_DESCRICAO =
  "Plataforma editorial do historiador André Bueno: artigos, acervo documental e ferramentas de pesquisa sobre a história do Brasil.";

// Liga o grupo "seo" do site_config (editável em Configurações → SEO no
// painel) ao metadata raiz — antes esses 3 campos existiam no banco desde
// o seed inicial, mas nenhum código lia getConfigGrupo("seo").
export async function getSeoConfig() {
  const cfg = await getConfigGrupo("seo");
  const pega = (chave: string, fallback: string) => cfg[chave] || fallback;

  return {
    tituloPadrao: pega("seo.titulo_padrao", PADRAO_TITULO),
    descricaoPadrao: pega("seo.descricao_padrao", PADRAO_DESCRICAO),
  };
}
