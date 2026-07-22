import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function VideosPainelPage() {
  const supabase = await createClient();
  const { data: videos } = await supabase
    .from("acervo_midia")
    .select("*")
    .eq("tipo", "video")
    .order("data", { ascending: false });

  return (
    <div>
      <Link href="/painel/obra" className="meta text-chumbo hover:text-lacre">
        ← Obra
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Vídeos</h1>
        <Link
          href="/painel/obra/videos/novo"
          className="border border-ink bg-ink px-5 py-2.5 text-ouro hover:bg-lacre hover:border-lacre"
        >
          <span className="meta text-ouro">Novo vídeo</span>
        </Link>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        {(videos ?? []).length === 0 && (
          <p className="meta text-chumbo-lt">Nenhum vídeo ainda.</p>
        )}
        {(videos ?? []).map((video) => (
          <Link
            key={video.id}
            href={`/painel/obra/videos/${video.id}`}
            className="flex items-center justify-between border border-borda p-6 hover:border-lacre"
          >
            <div>
              <p className="meta text-chumbo-lt">{video.categoria ?? "—"}</p>
              <p className="mt-1 font-display text-xl text-ink">
                {video.titulo}
              </p>
            </div>
            <span className="meta text-chumbo-lt">
              {video.publicado ? "Publicado" : "Rascunho"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
