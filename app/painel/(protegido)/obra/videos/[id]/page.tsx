import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormularioMidia } from "@/components/painel/FormularioMidia";
import { atualizarMidia } from "@/app/painel/(protegido)/obra/midia-actions";

export default async function EditarVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: video } = await supabase
    .from("acervo_midia")
    .select("*")
    .eq("id", id)
    .eq("tipo", "video")
    .single();

  if (!video) notFound();

  return (
    <div>
      <Link
        href="/painel/obra/videos"
        className="meta text-chumbo hover:text-lacre"
      >
        ← Vídeos
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">{video.titulo}</h1>

      <FormularioMidia
        tipo="video"
        midia={video}
        action={atualizarMidia.bind(null, id, "video")}
      />
    </div>
  );
}
