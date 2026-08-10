import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getArtigosPublicados } from "@/lib/artigos";
import { getOpinioesPublicadas } from "@/lib/opinioes";
import { getAcervoPublicado } from "@/lib/acervo";
import { getDestinos } from "@/lib/destinos";
import { getEventosFuturos, getEventosArquivo } from "@/lib/eventos";
import { getPublicacoes } from "@/lib/obra";

const ROTAS_ESTATICAS = [
  "/",
  "/sobre",
  "/livro",
  "/linha-do-tempo",
  "/artigos",
  "/opiniao",
  "/destinos",
  "/eventos",
  "/acervo",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinos, eventosFuturos, eventosArquivo, publicacoes] = await Promise.all([
    getDestinos(),
    getEventosFuturos(),
    getEventosArquivo(),
    getPublicacoes(["livro", "artigo_academico", "capitulo", "ensaio"]),
  ]);

  const estaticas: MetadataRoute.Sitemap = ROTAS_ESTATICAS.map((rota) => ({
    url: `${SITE_URL}${rota}`,
  }));

  const artigos: MetadataRoute.Sitemap = getArtigosPublicados().map((a) => ({
    url: `${SITE_URL}${a.url}`,
    lastModified: a.data,
  }));

  const opinioes: MetadataRoute.Sitemap = getOpinioesPublicadas().map((o) => ({
    url: `${SITE_URL}${o.url}`,
    lastModified: o.data,
  }));

  const trabalhosTecnicos: MetadataRoute.Sitemap = getAcervoPublicado().map((d) => ({
    url: `${SITE_URL}${d.url}`,
    lastModified: d.data,
  }));

  const destinosSitemap: MetadataRoute.Sitemap = destinos.map((d) => ({
    url: `${SITE_URL}/destinos/${d.slug}`,
  }));

  const eventosSitemap: MetadataRoute.Sitemap = [...eventosFuturos, ...eventosArquivo].map(
    (e) => ({
      url: `${SITE_URL}/eventos/${e.slug}`,
    }),
  );

  const publicacoesSitemap: MetadataRoute.Sitemap = publicacoes.map((p) => ({
    url: `${SITE_URL}/acervo/publicacoes/${p.slug}`,
  }));

  return [
    ...estaticas,
    ...artigos,
    ...opinioes,
    ...trabalhosTecnicos,
    ...destinosSitemap,
    ...eventosSitemap,
    ...publicacoesSitemap,
  ];
}
