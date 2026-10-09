import { createAdminClient } from "@/lib/supabase/admin";
import { UploadMidia, BotaoCopiarLink } from "@/components/painel/UploadMidia";
import { ConfirmarExclusao } from "@/components/painel/ConfirmarExclusao";
import { apagarArquivoAction } from "@/app/painel/(protegido)/midia/actions";
import { formatarData } from "@/lib/format";

export const dynamic = "force-dynamic";

const PASTA = "andre-bueno";

function tamanhoLegivel(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function MidiaPage() {
  const admin = createAdminClient();
  const { data: arquivos } = await admin.storage.from("uploads").list(PASTA, {
    limit: 1000,
    sortBy: { column: "created_at", order: "desc" },
  });
  const lista = (arquivos ?? []).filter((a) => a.id);
  const urlPublica = (nome: string) =>
    admin.storage.from("uploads").getPublicUrl(`${PASTA}/${nome}`).data.publicUrl;

  return (
    <div className="max-w-6xl">
      <p className="meta text-lacre">Painel</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Biblioteca de mídia</h1>
      <p className="mt-2 max-w-prose font-serif text-chumbo">
        Todas as imagens e PDFs enviados para o site. Envie aqui e use &quot;Copiar
        link&quot; para colar em qualquer conteúdo, ou envie direto nos formulários.
      </p>

      <div className="mt-8">
        <UploadMidia />
      </div>

      <p className="meta mt-10 text-chumbo-lt">{lista.length} arquivo(s)</p>

      {lista.length === 0 ? (
        <p className="mt-4 font-serif text-chumbo">Nenhum arquivo enviado ainda.</p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {lista.map((arquivo) => {
            const url = urlPublica(arquivo.name);
            const ehPdf = arquivo.name.toLowerCase().endsWith(".pdf");
            return (
              <li key={arquivo.id} className="flex flex-col border border-borda bg-paper">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="relative block aspect-[4/3] overflow-hidden bg-paper-mid"
                >
                  {ehPdf ? (
                    <span className="flex h-full items-center justify-center font-display text-2xl text-chumbo-lt">
                      PDF
                    </span>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
                  )}
                </a>
                <div className="flex flex-1 flex-col gap-2 p-3">
                  <p className="meta text-chumbo-lt">
                    {arquivo.created_at ? formatarData(arquivo.created_at) : ""} · {tamanhoLegivel(arquivo.metadata?.size)}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <BotaoCopiarLink url={url} />
                    <ConfirmarExclusao
                      action={apagarArquivoAction.bind(null, `${PASTA}/${arquivo.name}`)}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
