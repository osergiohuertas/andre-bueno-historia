import type { Artigo, Opiniao, AcervoDocumento } from "@/.velite";
import type { Evento } from "@/lib/eventos";
import type { Destino } from "@/lib/destinos";
import type { Publicacao } from "@/lib/obra";
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

// WebSite — ajuda o Google a entender a identidade do site como um todo,
// separado do Person (autor). Sem SearchAction: o site não tem uma página
// de resultados de busca navegável por URL (a busca é client-side via
// Pagefind/Cmd+K), então não haveria alvo válido pra declarar.
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "André Bueno — História",
    url: SITE_URL,
  };
}

// BreadcrumbList genérico — cada página de detalhe monta a própria trilha
// (ex.: Início → Trabalhos técnicos → título do documento) e passa aqui.
export function breadcrumbSchema(itens: { nome: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: itens.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.nome,
      item: `${SITE_URL}${item.url}`,
    })),
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

export function destinoSchema(destino: Destino) {
  return {
    "@context": "https://schema.org",
    "@type": destino.tipologia === "Museus" ? "Museum" : "TouristAttraction",
    name: destino.nome,
    address: {
      "@type": "PostalAddress",
      streetAddress: destino.endereco,
      addressLocality: destino.cidade,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: destino.coordenadas.lat,
      longitude: destino.coordenadas.lng,
    },
    url: `${SITE_URL}/destinos/${destino.slug}`,
    ...(destino.telefone ? { telephone: destino.telefone } : {}),
    ...(destino.site ? { sameAs: destino.site } : {}),
    ...(destino.foto ? { image: destino.foto } : {}),
  };
}

export function acervoDocumentoSchema(documento: AcervoDocumento) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: documento.titulo,
    description: documento.excerpt,
    url: `${SITE_URL}${documento.url}`,
    ...(documento.fonte ? { creditText: documento.fonte } : {}),
    ...(documento.imagemCapa ? { image: documento.imagemCapa } : {}),
    ...(documento.anoInicio
      ? { temporalCoverage: String(documento.anoInicio) }
      : {}),
  };
}

const LABEL_TIPO_PUBLICACAO: Record<Publicacao["tipo"], string> = {
  livro: "Book",
  artigo_academico: "ScholarlyArticle",
  capitulo: "Chapter",
  ensaio: "CreativeWork",
};

export function publicacaoSchema(publicacao: Publicacao) {
  return {
    "@context": "https://schema.org",
    "@type": LABEL_TIPO_PUBLICACAO[publicacao.tipo],
    name: publicacao.titulo,
    author: { "@type": "Person", name: NOME_AUTOR },
    datePublished: String(publicacao.ano),
    isPartOf: { "@type": "CreativeWork", name: publicacao.veiculo },
    url: `${SITE_URL}/acervo/publicacoes/${publicacao.slug}`,
    ...(publicacao.resumo ? { description: publicacao.resumo } : {}),
    ...(publicacao.capa ? { image: publicacao.capa } : {}),
    ...(publicacao.coautores
      ? {
          contributor: publicacao.coautores
            .split(",")
            .map((nome) => ({ "@type": "Person", name: nome.trim() })),
        }
      : {}),
  };
}
