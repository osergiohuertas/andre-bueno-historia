import { AtlasMapa } from "@/components/atlas/AtlasMapa";
import type { PontoAtlas } from "@/lib/atlas";

export function AtlasSection({ pontos }: { pontos: PontoAtlas[] }) {
  return (
    <section className="py-10 md:py-14">
      <div className="mb-10">
        <p className="meta text-lacre">Mapa</p>
        <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
          Atlas
        </h2>
        <p className="mt-4 max-w-prose font-serif text-chumbo">
          Onde cada história acontece: destinos para visitar, artigos e
          trabalhos técnicos no lugar que estudam, a agenda de eventos e os
          registros fotográficos. Alterne as camadas e explore.
        </p>
      </div>

      <AtlasMapa pontos={pontos} />
    </section>
  );
}
