"use client";

import { useActionState, useState } from "react";
import type { EstadoMidia } from "@/app/painel/(protegido)/obra/midia-actions";
import type { Database } from "@/types/supabase";
import type { CategoriaVideo } from "@/lib/obra";
import { FORMATOS_IMAGEM_ACEITOS, TAMANHO_MAXIMO_MB } from "@/lib/uploadConfig";
import { SeletorCoordenadas } from "@/components/painel/SeletorCoordenadas";
import { enviarArquivo } from "@/lib/enviarArquivo";

type Midia = Database["public"]["Tables"]["acervo_midia"]["Row"];

const CATEGORIAS: CategoriaVideo[] = [
  "entrevista",
  "congresso",
  "simposio",
  "seminario",
  "documentario",
  "reportagem",
];

export function FormularioMidia({
  tipo,
  midia,
  action,
}: {
  tipo: "video" | "foto";
  midia?: Midia;
  action: (estado: EstadoMidia, formData: FormData) => Promise<EstadoMidia>;
}) {
  const [estado, formAction, pendente] = useActionState(action, null);

  const [temLocal, setTemLocal] = useState(
    midia?.lat != null && midia?.lng != null,
  );
  const [lat, setLat] = useState(midia?.lat ?? 0);
  const [lng, setLng] = useState(midia?.lng ?? 0);
  // Foto sobe direto do navegador pro Storage ao ser escolhida; o form só
  // manda a URL — arquivo grande não passa pelo servidor do site.
  const [fotoUrl, setFotoUrl] = useState(tipo === "foto" ? (midia?.url ?? "") : "");
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [erroFoto, setErroFoto] = useState<string | null>(null);

  async function aoEscolherFoto(arquivo: File) {
    setEnviandoFoto(true);
    setErroFoto(null);
    const resultado = await enviarArquivo(arquivo);
    setEnviandoFoto(false);
    if (!resultado.ok) {
      setErroFoto(resultado.erro);
      return;
    }
    setFotoUrl(resultado.url);
  }

  return (
    <form
      action={formAction}
      encType={tipo === "foto" ? "multipart/form-data" : undefined}
      className="mt-8 flex flex-col gap-6"
    >
      {temLocal && (
        <>
          <input type="hidden" name="lat" value={lat} />
          <input type="hidden" name="lng" value={lng} />
        </>
      )}

      <div>
        <label htmlFor="titulo" className="meta mb-1 block text-chumbo-lt">
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          defaultValue={midia?.titulo}
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="descricao" className="meta mb-1 block text-chumbo-lt">
          Descrição (opcional)
        </label>
        <textarea
          id="descricao"
          name="descricao"
          defaultValue={midia?.descricao ?? ""}
          rows={2}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      {tipo === "video" ? (
        <>
          <div>
            <label htmlFor="url" className="meta mb-1 block text-chumbo-lt">
              URL do vídeo (YouTube ou Vimeo)
            </label>
            <input
              id="url"
              name="url"
              type="url"
              defaultValue={midia?.url}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
            />
          </div>

          <div>
            <p className="meta mb-2 text-chumbo-lt">Categoria</p>
            <div className="flex flex-wrap gap-4">
              {CATEGORIAS.map((c) => (
                <label key={c} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="categoria"
                    value={c}
                    defaultChecked={midia?.categoria === c}
                  />
                  <span className="text-ink capitalize">{c}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <label htmlFor="arquivo" className="meta mb-1 block text-chumbo-lt">
              {midia ? "Substituir foto (opcional)" : "Foto"}
            </label>
            <p className="mb-2 font-serif text-xs text-chumbo-lt">
              Aceita {FORMATOS_IMAGEM_ACEITOS} — até {TAMANHO_MAXIMO_MB}MB.
            </p>
            <input type="hidden" name="url" value={fotoUrl} />
            <input
              id="arquivo"
              type="file"
              accept="image/*"
              disabled={enviandoFoto}
              onChange={(e) => {
                const arquivo = e.target.files?.[0];
                if (arquivo) aoEscolherFoto(arquivo);
              }}
              className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
            />
            {enviandoFoto && <p className="meta mt-2 text-chumbo">Enviando foto…</p>}
            {erroFoto && <p className="mt-2 font-serif text-xs text-lacre">{erroFoto}</p>}
            {fotoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fotoUrl}
                alt=""
                className="mt-3 aspect-video w-full max-w-xs border border-borda object-cover"
              />
            )}
          </div>

          <div>
            <label htmlFor="credito" className="meta mb-1 block text-chumbo-lt">
              Crédito
            </label>
            <p className="mb-2 font-serif text-xs text-chumbo-lt">
              Obrigatório para foto de terceiro. Sempre exibido publicamente.
            </p>
            <input
              id="credito"
              name="credito"
              defaultValue={midia?.credito ?? ""}
              className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={temLocal}
                onChange={(e) => setTemLocal(e.target.checked)}
                className="h-5 w-5 border border-borda"
              />
              <span className="text-ink">
                Registrar local no mapa (opcional)
              </span>
            </label>
            <p className="mt-1 font-serif text-xs text-chumbo-lt">
              Onde a foto foi registrada — marcando, ela aparece como ponto
              no Atlas junto de artigos e destinos.
            </p>

            {temLocal && (
              <div className="mt-3">
                <SeletorCoordenadas
                  lat={lat}
                  lng={lng}
                  onMudar={(novaLat, novaLng) => {
                    setLat(novaLat);
                    setLng(novaLng);
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}

      <div>
        <label htmlFor="data" className="meta mb-1 block text-chumbo-lt">
          Data (opcional)
        </label>
        <input
          id="data"
          name="data"
          type="date"
          defaultValue={midia?.data ?? ""}
          className="border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={midia?.publicado ?? false}
          className="h-5 w-5 border border-borda"
        />
        <span className="text-ink">Publicado (aparece no site)</span>
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pendente || enviandoFoto}
          className="border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre disabled:opacity-50"
        >
          <span className="meta text-ouro">{pendente ? "Salvando…" : "Salvar"}</span>
        </button>
        {estado && (
          <p className={`meta ${estado.ok ? "text-chumbo" : "text-lacre"}`}>
            {estado.mensagem}
          </p>
        )}
      </div>
    </form>
  );
}
