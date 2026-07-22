import { AtlasMapa } from "@/components/atlas/AtlasMapa";
import type { PontoArtigo, PontoMuseu } from "@/lib/atlas";

export function AtlasSection({
  pontosArtigos,
  pontosMuseus,
}: {
  pontosArtigos: PontoArtigo[];
  pontosMuseus: PontoMuseu[];
}) {
  return (
    <section className="py-10 md:py-14">
      <div className="mb-10">
        <p className="meta text-lacre">Mapa</p>
        <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
          Atlas
        </h2>
        <p className="mt-4 max-w-prose font-serif text-chumbo">
          O episódio que você acabou de ler pode ter acervo visitável a
          poucos quilômetros de onde aconteceu. Alterne as camadas e
          descubra.
        </p>
      </div>

      <AtlasMapa pontosArtigos={pontosArtigos} pontosMuseus={pontosMuseus} />
    </section>
  );
}
