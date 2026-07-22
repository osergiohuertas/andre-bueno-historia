import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AcervoTiles } from "@/components/acervo/AcervoTiles";
import { DocumentosSection } from "@/components/acervo/DocumentosSection";
import { AtlasSection } from "@/components/acervo/AtlasSection";
import { LivrosSection } from "@/components/acervo/LivrosSection";
import { PublicacoesSection } from "@/components/acervo/PublicacoesSection";
import { VideosSection } from "@/components/acervo/VideosSection";
import { FotosSection } from "@/components/acervo/FotosSection";
import { getAcervoPublicado, getPeriodosComAcervo } from "@/lib/acervo";
import { getPontosArtigos, getPontosMuseus, type PontoMuseu } from "@/lib/atlas";
import { getPublicacoes, getAcervoMidia, type CategoriaVideo } from "@/lib/obra";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Acervo — André Bueno",
  description:
    "Tudo que preservo e produzo sobre a história do Brasil: documentos, atlas, livros, publicações, vídeos e fotos.",
};

type Secao =
  | "documentos"
  | "atlas"
  | "livros"
  | "publicacoes"
  | "videos"
  | "fotos";

const SECOES_VALIDAS: Secao[] = [
  "documentos",
  "atlas",
  "livros",
  "publicacoes",
  "videos",
  "fotos",
];

const CATEGORIAS_VIDEO: CategoriaVideo[] = [
  "entrevista",
  "congresso",
  "simposio",
  "seminario",
];

export default async function AcervoPage({
  searchParams,
}: {
  searchParams: Promise<{
    secao?: string;
    periodo?: string;
    categoria?: string;
  }>;
}) {
  const { secao: secaoParam, periodo, categoria } = await searchParams;
  const secao: Secao = SECOES_VALIDAS.includes(secaoParam as Secao)
    ? (secaoParam as Secao)
    : "documentos";
  const categoriaValida = CATEGORIAS_VIDEO.find((c) => c === categoria);

  const todosDocumentos = getAcervoPublicado();
  const comConteudo = getPeriodosComAcervo();
  const pontosArtigos = getPontosArtigos();

  const [livros, publicacoes, videosTodos, fotos, pontosMuseus] =
    await Promise.all([
      getPublicacoes(["livro"]),
      getPublicacoes(["artigo_academico", "capitulo", "ensaio"]),
      getAcervoMidia("video"),
      getAcervoMidia("foto"),
      secao === "atlas"
        ? getPontosMuseus()
        : Promise.resolve([] as PontoMuseu[]),
    ]);

  const videos =
    secao === "videos" && categoriaValida
      ? await getAcervoMidia("video", categoriaValida)
      : videosTodos;

  const documentosFiltrados = periodo
    ? todosDocumentos.filter((a) => a.periodo === periodo)
    : todosDocumentos;

  const tiles = [
    {
      id: "documentos",
      label: "Documentos",
      descricao: "Peças originais com anotação autoral.",
      contagem: todosDocumentos.length,
    },
    {
      id: "atlas",
      label: "Atlas",
      descricao: "Onde a história aconteceu, no mapa.",
    },
    {
      id: "livros",
      label: "Livros",
      descricao: "Catálogo completo de livros.",
      contagem: livros.length,
    },
    {
      id: "publicacoes",
      label: "Publicações",
      descricao: "Artigos acadêmicos, capítulos e ensaios.",
      contagem: publicacoes.length,
    },
    {
      id: "videos",
      label: "Vídeos",
      descricao: "Entrevistas, congressos e seminários.",
      contagem: videosTodos.length,
    },
    {
      id: "fotos",
      label: "Fotos",
      descricao: "Galeria de registros públicos.",
      contagem: fotos.length,
    },
  ] as const;

  return (
    <Container className="py-16 md:py-24">
      <p className="meta text-lacre">Autoridade</p>
      <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
        Acervo
      </h1>
      <p className="mt-4 max-w-prose font-serif text-chumbo">
        Tudo que preservo e produzo sobre a história do Brasil, reunido num
        só lugar: documentos originais, o mapa de onde a história
        aconteceu, e o catálogo completo de livros, publicações, vídeos e
        fotos.
      </p>

      <div className="mt-10">
        <AcervoTiles tiles={tiles} ativa={secao} />
      </div>

      {secao === "documentos" && (
        <DocumentosSection
          itens={documentosFiltrados}
          comConteudo={comConteudo}
          periodo={periodo}
        />
      )}
      {secao === "atlas" && (
        <AtlasSection pontosArtigos={pontosArtigos} pontosMuseus={pontosMuseus} />
      )}
      {secao === "livros" && <LivrosSection livros={livros} />}
      {secao === "publicacoes" && (
        <PublicacoesSection publicacoes={publicacoes} />
      )}
      {secao === "videos" && (
        <VideosSection videos={videos} categoria={categoriaValida} />
      )}
      {secao === "fotos" && <FotosSection fotos={fotos} />}
    </Container>
  );
}
