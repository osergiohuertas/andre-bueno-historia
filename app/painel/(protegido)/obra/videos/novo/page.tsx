import Link from "next/link";
import { FormularioMidia } from "@/components/painel/FormularioMidia";
import { criarMidia } from "@/app/painel/(protegido)/obra/midia-actions";

export default function NovoVideoPage() {
  return (
    <div>
      <Link
        href="/painel/obra/videos"
        className="meta text-chumbo hover:text-lacre"
      >
        ← Vídeos
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">Novo vídeo</h1>

      <FormularioMidia tipo="video" action={criarMidia.bind(null, "video")} />
    </div>
  );
}
