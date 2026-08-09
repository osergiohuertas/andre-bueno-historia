"use client";

import { useActionState, useRef, useState } from "react";
import { uploadImagemAction } from "@/app/painel/(protegido)/novo-artigo/actions";
import type { EstadoPublicacao } from "@/app/painel/(protegido)/obra/publicacoes/actions";
import type { Database } from "@/types/supabase";

type Publicacao = Database["public"]["Tables"]["publicacoes"]["Row"];

export function FormularioPublicacao({
  publicacao,
  action,
}: {
  publicacao?: Publicacao;
  action: (
    estado: EstadoPublicacao,
    formData: FormData,
  ) => Promise<EstadoPublicacao>;
}) {
  const [estado, formAction, pendente] = useActionState(action, null);

  const [capa, setCapa] = useState(publicacao?.capa ?? "");
  const [enviandoCapa, setEnviandoCapa] = useState(false);
  const [erroCapa, setErroCapa] = useState<string | null>(null);
  const inputArquivoRef = useRef<HTMLInputElement | null>(null);

  async function lidarComUploadCapa(arquivo: File) {
    setEnviandoCapa(true);
    setErroCapa(null);
    const formData = new FormData();
    formData.append("arquivo", arquivo);
    const resultado = await uploadImagemAction(formData);
    setEnviandoCapa(false);

    if (!resultado.ok) {
      setErroCapa(resultado.erro);
      return;
    }
    setCapa(resultado.url);
  }

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-6">
      <input type="hidden" name="capa" value={capa} />
      <div>
        <label htmlFor="titulo" className="meta mb-1 block text-chumbo-lt">
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          defaultValue={publicacao?.titulo}
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <p className="meta mb-2 text-chumbo-lt">Tipo</p>
        <div className="flex flex-wrap gap-4">
          {(
            [
              { valor: "livro", label: "Livro" },
              { valor: "artigo_academico", label: "Artigo acadêmico" },
              { valor: "capitulo", label: "Capítulo" },
              { valor: "ensaio", label: "Ensaio" },
            ] as const
          ).map((opcao) => (
            <label key={opcao.valor} className="flex items-center gap-2">
              <input
                type="radio"
                name="tipo"
                value={opcao.valor}
                defaultChecked={(publicacao?.tipo ?? "livro") === opcao.valor}
              />
              <span className="text-ink">{opcao.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <label htmlFor="veiculo" className="meta mb-1 block text-chumbo-lt">
            Veículo / editora
          </label>
          <input
            id="veiculo"
            name="veiculo"
            defaultValue={publicacao?.veiculo}
            required
            className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="ano" className="meta mb-1 block text-chumbo-lt">
            Ano
          </label>
          <input
            id="ano"
            name="ano"
            type="number"
            defaultValue={publicacao?.ano}
            required
            className="w-28 border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="coautores" className="meta mb-1 block text-chumbo-lt">
          Coautores (opcional)
        </label>
        <input
          id="coautores"
          name="coautores"
          defaultValue={publicacao?.coautores ?? ""}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="resumo" className="meta mb-1 block text-chumbo-lt">
          Resumo (opcional)
        </label>
        <textarea
          id="resumo"
          name="resumo"
          defaultValue={publicacao?.resumo ?? ""}
          rows={3}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="link" className="meta mb-1 block text-chumbo-lt">
          Link (opcional)
        </label>
        <input
          id="link"
          name="link"
          type="url"
          defaultValue={publicacao?.link ?? ""}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <p className="meta mb-1 text-chumbo-lt">Imagem de capa (opcional)</p>
        <p className="mb-3 font-serif text-xs text-chumbo-lt">
          A identidade visual do seminário, congresso, evento ou da própria
          publicação.
        </p>

        <input
          ref={inputArquivoRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const arquivo = e.target.files?.[0];
            if (arquivo) lidarComUploadCapa(arquivo);
            e.target.value = "";
          }}
        />

        {capa && (
          <div className="mb-3 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={capa}
              alt=""
              className="h-24 w-40 border border-borda object-cover"
            />
            <button
              type="button"
              onClick={() => setCapa("")}
              className="meta text-chumbo hover:text-lacre"
            >
              Remover
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => inputArquivoRef.current?.click()}
          disabled={enviandoCapa}
          className="border border-borda px-4 py-2 text-ink hover:border-lacre disabled:opacity-50"
        >
          <span className="meta">
            {enviandoCapa
              ? "Enviando…"
              : capa
                ? "Trocar imagem"
                : "Escolher imagem de capa"}
          </span>
        </button>
        {erroCapa && (
          <p className="mt-2 font-serif text-xs text-lacre">{erroCapa}</p>
        )}
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={publicacao?.publicado ?? false}
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
