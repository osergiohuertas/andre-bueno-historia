"use client";

import { useActionState } from "react";
import type { EstadoMidia } from "@/app/painel/(protegido)/obra/midia-actions";
import type { Database } from "@/types/supabase";
import type { CategoriaVideo } from "@/lib/obra";

type Midia = Database["public"]["Tables"]["acervo_midia"]["Row"];

const CATEGORIAS: CategoriaVideo[] = [
  "entrevista",
  "congresso",
  "simposio",
  "seminario",
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

  return (
    <form
      action={formAction}
      encType={tipo === "foto" ? "multipart/form-data" : undefined}
      className="mt-8 flex flex-col gap-6"
    >
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
            <input
              id="arquivo"
              name="arquivo"
              type="file"
              accept="image/*"
              className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
            />
            {midia?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={midia.url}
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
          disabled={pendente}
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
