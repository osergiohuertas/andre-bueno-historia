import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { OpiniaoCard } from "@/components/opiniao/OpiniaoCard";
import {
  getOpinioesPublicadas,
  getOpiniaoDestaque,
} from "@/lib/opinioes";

export const metadata: Metadata = {
  title: "Opinião — André Bueno",
  description:
    "Artigos de opinião de André Bueno — análise do presente com contexto histórico. A voz do autor, sempre distinta da exposição documentada.",
};

export default function OpiniaoPage() {
  const opinioes = getOpinioesPublicadas();
  const destaque = getOpiniaoDestaque();
  const demais = opinioes.filter((o) => o.slug !== destaque?.slug);

  return (
    <Section>
      <Container>
        <div className="mb-12 max-w-2xl">
          <p className="meta text-ouro">Coluna editorial</p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            Opinião
          </h1>
          <p className="mt-5 font-serif text-lg font-light leading-relaxed text-chumbo">
            Análise do presente ancorada na história. Aqui a voz é do autor — o
            argumento e as conclusões são dele, sempre apontando para os fatos
            documentados no acervo.
          </p>
        </div>

        {opinioes.length === 0 ? (
          <p className="meta text-chumbo-lt">
            Nenhum artigo de opinião publicado ainda.
          </p>
        ) : (
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {destaque && (
              <OpiniaoCard
                key={destaque.slug}
                titulo={destaque.titulo}
                subtitulo={destaque.subtitulo}
                excerpt={destaque.excerpt}
                href={destaque.url}
                data={destaque.data}
                leituraMinutos={destaque.leituraMinutos}
                imagemCapa={destaque.imagemCapa}
                variant="highlight"
              />
            )}
            {demais.map((opiniao) => (
              <OpiniaoCard
                key={opiniao.slug}
                titulo={opiniao.titulo}
                subtitulo={opiniao.subtitulo}
                excerpt={opiniao.excerpt}
                href={opiniao.url}
                data={opiniao.data}
                leituraMinutos={opiniao.leituraMinutos}
                imagemCapa={opiniao.imagemCapa}
              />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
