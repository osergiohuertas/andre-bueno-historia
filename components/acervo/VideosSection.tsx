import Link from "next/link";
import { VideoEmbed } from "@/components/obra/VideoEmbed";
import { formatarData } from "@/lib/format";
import type { CategoriaVideo, Midia } from "@/lib/obra";

const CATEGORIAS: { id: CategoriaVideo; label: string }[] = [
  { id: "entrevista", label: "Entrevista" },
  { id: "congresso", label: "Congresso" },
  { id: "simposio", label: "Simpósio" },
  { id: "seminario", label: "Seminário" },
];

export function VideosSection({
  videos,
  categoria,
}: {
  videos: Midia[];
  categoria?: CategoriaVideo;
}) {
  return (
    <section className="py-10 md:py-14">
      <div className="mb-10">
        <p className="meta text-lacre">Catálogo</p>
        <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
          Vídeos
        </h2>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/acervo?secao=videos"
          className={`meta border px-3 py-1.5 ${
            !categoria
              ? "border-lacre bg-lacre text-ouro"
              : "border-borda text-chumbo hover:border-lacre"
          }`}
        >
          Todos
        </Link>
        {CATEGORIAS.map((c) => (
          <Link
            key={c.id}
            href={`/acervo?secao=videos&categoria=${c.id}`}
            className={`meta border px-3 py-1.5 ${
              categoria === c.id
                ? "border-lacre bg-lacre text-ouro"
                : "border-borda text-chumbo hover:border-lacre"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {videos.length === 0 ? (
        <p className="meta text-chumbo-lt">Nenhum vídeo cadastrado ainda.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {videos.map((video) => (
            <div key={video.id}>
              <VideoEmbed url={video.url} titulo={video.titulo} />
              <h3 className="mt-3 font-display text-lg text-ink">
                {video.titulo}
              </h3>
              {video.descricao && (
                <p className="mt-1 font-serif text-sm text-chumbo">
                  {video.descricao}
                </p>
              )}
              {video.data && (
                <p className="meta mt-2 text-chumbo-lt">
                  {formatarData(video.data)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
