import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import { rehypeGlossario, type TermoGlossario } from "./lib/rehypeGlossario";
import { PERIODOS, type PeriodoId } from "./data/periodos";

// Preserva os literais de PeriodoId (em vez de alargar para `string`) para
// que o tipo gerado por s.enum(...) case exatamente com PeriodoId.
const PERIODO_IDS = PERIODOS.map((p) => p.id) as unknown as [
  PeriodoId,
  ...PeriodoId[],
];

// Lido diretamente do disco (não via coleção Velite) porque o plugin rehype
// precisa da lista de termos ANTES do próprio Velite processar os artigos —
// as duas coisas acontecem na mesma passada.
function carregarTermosGlossario(): TermoGlossario[] {
  const dir = join(process.cwd(), "content/glossario");
  let arquivos: string[] = [];
  try {
    arquivos = readdirSync(dir).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  return arquivos.map((arquivo) =>
    JSON.parse(readFileSync(join(dir, arquivo), "utf-8")),
  );
}

const artigos = defineCollection({
  name: "Artigo",
  pattern: "artigos/**/*.mdx",
  schema: s
    .object({
      titulo: s.string(),
      subtitulo: s.string().optional(),
      slug: s.slug("artigos"),
      periodo: s.enum(PERIODO_IDS),
      periodosSecundarios: s.array(s.enum(PERIODO_IDS)).optional(),
      anoInicio: s.number(),
      anoFim: s.number().optional(),
      regiao: s.string().optional(),
      coordenadas: s
        .object({ lat: s.number(), lng: s.number() })
        .optional(),
      excerpt: s.string(),
      leituraMinutos: s.number(),
      tags: s.array(s.string()).default([]),
      // Fase 1D: valor é o `slug` de uma linha em series (Supabase), não um
      // nome livre — numero/nome/descrição da série vivem lá.
      serie: s.string().optional(),
      serieOrdem: s.number().optional(),
      imagemCapa: s.string().optional(),
      // Fase 1C: presença deste campo aciona o CardConexaoLivro no artigo.
      // O texto é a nota editorial exibida — nunca genérico, sempre escrito
      // pelo André para aquele artigo específico.
      conexaoLivro: s.string().optional(),
      publicado: s.boolean().default(false),
      data: s.isodate(),
      body: s.mdx(),
      toc: s.toc({ maxDepth: 3 }),
    })
    .transform((data) => ({ ...data, url: `/artigos/${data.slug}` })),
});

// Fase 4: peça editorial do acervo documental. "Declara período, como o
// artigo" — mesmo esqueleto temporal, sem coordenadas (o Atlas só tem as
// camadas Artigos e Museus, não Acervo).
const acervoDocumentos = defineCollection({
  name: "AcervoDocumento",
  pattern: "acervo-documentos/**/*.mdx",
  schema: s
    .object({
      titulo: s.string(),
      slug: s.slug("acervoDocumentos"),
      periodo: s.enum(PERIODO_IDS),
      periodosSecundarios: s.array(s.enum(PERIODO_IDS)).optional(),
      anoInicio: s.number(),
      anoFim: s.number().optional(),
      regiao: s.string().optional(),
      excerpt: s.string(),
      // Fonte/proveniência do documento (arquivo, acervo físico, etc.).
      fonte: s.string().optional(),
      pdfUrl: s.string(),
      imagemCapa: s.string().optional(),
      tags: s.array(s.string()).default([]),
      publicado: s.boolean().default(false),
      data: s.isodate(),
      body: s.mdx(),
      toc: s.toc({ maxDepth: 3 }),
    })
    .transform((data) => ({ ...data, url: `/acervo/${data.slug}` })),
});

// Opinião: a voz editorial do André — argumento sobre o presente com
// contexto histórico. Coleção SEPARADA do artigo de propósito: não tem eixo
// temporal obrigatório (período/ano), não entra na timeline nem no atlas. O
// que é fato documentado (artigo) e o que é análise (opinião) ficam
// estruturalmente distintos, não só visualmente.
const opinioes = defineCollection({
  name: "Opiniao",
  pattern: "opinioes/**/*.mdx",
  schema: s
    .object({
      titulo: s.string(),
      subtitulo: s.string().optional(),
      slug: s.slug("opinioes"),
      excerpt: s.string(),
      leituraMinutos: s.number(),
      tags: s.array(s.string()).default([]),
      // Períodos com que a peça dialoga — contexto/cor, NÃO organização.
      // Diferente do artigo, aqui o período é opcional e secundário.
      periodosRelacionados: s.array(s.enum(PERIODO_IDS)).optional(),
      // Slugs de artigos históricos publicados que ancoram a opinião em
      // fatos — viram o bloco "Base histórica" na página. É o que dá o
      // "contexto histórico com lógica": a análise aponta pra exposição.
      artigosRelacionados: s.array(s.string()).optional(),
      imagemCapa: s.string().optional(),
      // Peça em evidência no topo de /opiniao. Sem nenhuma marcada, a mais
      // recente assume o destaque (ver getOpiniaoDestaque em lib/opinioes).
      destaque: s.boolean().default(false),
      publicado: s.boolean().default(false),
      data: s.isodate(),
      body: s.mdx(),
      toc: s.toc({ maxDepth: 3 }),
    })
    .transform((data) => ({ ...data, url: `/opiniao/${data.slug}` })),
});

// Fase 4: um arquivo JSON por termo. Vira tooltip inline nos artigos e no
// acervo via rehypeGlossario — ver lib/rehypeGlossario.ts.
const glossario = defineCollection({
  name: "TermoGlossario",
  pattern: "glossario/**/*.json",
  schema: s.object({
    slug: s.string(),
    termo: s.string(),
    definicao: s.string(),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { artigos, acervoDocumentos, glossario, opinioes },
  mdx: {
    rehypePlugins: [rehypeSlug, rehypeGlossario(carregarTermosGlossario())],
  },
});
