import type { Artigo, Opiniao } from "@/.velite";
import type { Evento } from "@/lib/eventos";
import type { Museu } from "@/lib/museus";
import { SITE_URL } from "@/lib/site";

const NOME_AUTOR = "André Bueno";

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: NOME_AUTOR,
    jobTitle: "Historiador",
    description:
      "Pesquisa, escrita e acervo sobre a história do Brasil — da colônia à ditadura.",
    url: SITE_URL,
  };
}

export function articleSchema(artigo: Artigo) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: artigo.titulo,
    description: artigo.excerpt,
    datePublished: artigo.data,
    author: { "@type": "Person", name: NOME_AUTOR },
    url: `${SITE_URL}${artigo.url}`,
    ...(artigo.imagemCapa ? { image: artigo.imagemCapa } : {}),
  };
}

// OpinionNewsArticle (não Article): sinaliza ao Google que é análise do
// autor, não reportagem factual — importante pra não confundir opinião com
// exposição histórica documentada.
export function opinionSchema(opiniao: Opiniao) {
  return {
    "@context": "https://schema.org",
    "@type": "OpinionNewsArticle",
    headline: opiniao.titulo,
    description: opiniao.excerpt,
    datePublished: opiniao.data,
    author: { "@type": "Person", name: NOME_AUTOR },
    url: `${SITE_URL}${opiniao.url}`,
    ...(opiniao.imagemCapa ? { image: opiniao.imagemCapa } : {}),
  };
}

export function bookSchema(livro: {
  titulo: string;
  subtitulo: string;
  capaUrl?: string;
  amazonUrlFisico: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: livro.titulo,
    description: livro.subtitulo,
    author: { "@type": "Person", name: NOME_AUTOR },
    url: `${SITE_URL}/livro`,
    ...(livro.capaUrl ? { image: livro.capaUrl } : {}),
    offers: { "@type": "Offer", url: livro.amazonUrlFisico },
  };
}

export function eventSchema(evento: Evento) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: evento.titulo,
    description: evento.descricao,
    startDate: evento.dataInicio,
    endDate: evento.dataFim,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: evento.local,
      address: { "@type": "PostalAddress", addressLocality: evento.cidade },
    },
    organizer: { "@type": "Organization", name: evento.organizador },
    url: `${SITE_URL}/eventos/${evento.slug}`,
    ...(evento.imagemCapa ? { image: evento.imagemCapa } : {}),
  };
}

export function museumSchema(museu: Museu) {
  return {
    "@context": "https://schema.org",
    "@type": "Museum",
    name: museu.nome,
    address: {
      "@type": "PostalAddress",
      streetAddress: museu.endereco,
      addressLocality: museu.cidade,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: museu.coordenadas.lat,
      longitude: museu.coordenadas.lng,
    },
    url: `${SITE_URL}/museus/${museu.slug}`,
    ...(museu.telefone ? { telephone: museu.telefone } : {}),
    ...(museu.site ? { sameAs: museu.site } : {}),
    ...(museu.foto ? { image: museu.foto } : {}),
  };
}
