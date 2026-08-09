"use client";

import { useActionState, useRef, useState } from "react";
import { uploadImagemAction } from "@/app/painel/(protegido)/novo-artigo/actions";
import type { EstadoEvento } from "@/app/painel/(protegido)/agenda/actions";
import type { Database } from "@/types/supabase";

type Evento = Database["public"]["Tables"]["eventos"]["Row"];

function paraDatetimeLocal(valor?: string | null): string {
  if (!valor) return "";
  return valor.slice(0, 16);
}

export function FormularioEvento({
  evento,
  action,
}: {
  evento?: Evento;
  action: (estado: EstadoEvento, formData: FormData) => Promise<EstadoEvento>;
}) {
  const [estado, formAction, pendente] = useActionState(action, null);

  const [imagemCapa, setImagemCapa] = useState(evento?.imagem_capa ?? "");
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [erroImagem, setErroImagem] = useState<string | null>(null);
  const inputArquivoRef = useRef<HTMLInputElement | null>(null);

  async function lidarComUpload(arquivo: File) {
    setEnviandoImagem(true);
    setErroImagem(null);
    const formData = new FormData();
    formData.append("arquivo", arquivo);
    const resultado = await uploadImagemAction(formData);
    setEnviandoImagem(false);

    if (!resultado.ok) {
      setErroImagem(resultado.erro);
      return;
    }
    setImagemCapa(resultado.url);
  }

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-6">
      <input type="hidden" name="imagem_capa" value={imagemCapa} />
      <div>
        <label htmlFor="titulo" className="meta mb-1 block text-chumbo-lt">
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          defaultValue={evento?.titulo}
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="descricao" className="meta mb-1 block text-chumbo-lt">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          defaultValue={evento?.descricao}
          required
          rows={3}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div className="flex gap-6">
        <div>
          <label htmlFor="data_inicio" className="meta mb-1 block text-chumbo-lt">
            Início
          </label>
          <input
            id="data_inicio"
            name="data_inicio"
            type="datetime-local"
            defaultValue={paraDatetimeLocal(evento?.data_inicio)}
            required
            className="border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="data_fim" className="meta mb-1 block text-chumbo-lt">
            Fim
          </label>
          <input
            id="data_fim"
            name="data_fim"
            type="datetime-local"
            defaultValue={paraDatetimeLocal(evento?.data_fim)}
            required
            className="border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-6">
        <div>
          <p className="meta mb-2 text-chumbo-lt">Natureza</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="natureza"
                value="cultural"
                defaultChecked={(evento?.natureza ?? "cultural") === "cultural"}
              />
              <span className="text-ink">Cultural</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="natureza"
                value="academico"
                defaultChecked={evento?.natureza === "academico"}
              />
              <span className="text-ink">Acadêmico</span>
            </label>
          </div>
        </div>

        <div>
          <p className="meta mb-2 text-chumbo-lt">Participação</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="participacao"
                value="curadoria"
                defaultChecked={
                  (evento?.participacao ?? "curadoria") === "curadoria"
                }
              />
              <span className="text-ink">Curadoria</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="participacao"
                value="com_andre"
                defaultChecked={evento?.participacao === "com_andre"}
              />
              <span className="text-ink">Com André</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <label htmlFor="local" className="meta mb-1 block text-chumbo-lt">
            Local
          </label>
          <input
            id="local"
            name="local"
            defaultValue={evento?.local}
            required
            className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="cidade" className="meta mb-1 block text-chumbo-lt">
            Cidade
          </label>
          <input
            id="cidade"
            name="cidade"
            defaultValue={evento?.cidade}
            required
            className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="endereco" className="meta mb-1 block text-chumbo-lt">
          Endereço (opcional)
        </label>
        <input
          id="endereco"
          name="endereco"
          defaultValue={evento?.endereco ?? ""}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="organizador" className="meta mb-1 block text-chumbo-lt">
          Organizador
        </label>
        <input
          id="organizador"
          name="organizador"
          defaultValue={evento?.organizador}
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="link_inscricao" className="meta mb-1 block text-chumbo-lt">
          Link de inscrição (opcional)
        </label>
        <p className="mb-2 font-serif text-xs text-chumbo-lt">
          A plataforma nunca processa inscrição — sempre encaminha para o
          organizador.
        </p>
        <input
          id="link_inscricao"
          name="link_inscricao"
          type="url"
          defaultValue={evento?.link_inscricao ?? ""}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <p className="meta mb-1 text-chumbo-lt">Imagem de capa (opcional)</p>

        <input
          ref={inputArquivoRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const arquivo = e.target.files?.[0];
            if (arquivo) lidarComUpload(arquivo);
            e.target.value = "";
          }}
        />

        {imagemCapa && (
          <div className="mb-3 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagemCapa}
              alt=""
              className="h-24 w-40 border border-borda object-cover"
            />
            <button
              type="button"
              onClick={() => setImagemCapa("")}
              className="meta text-chumbo hover:text-lacre"
            >
              Remover
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => inputArquivoRef.current?.click()}
          disabled={enviandoImagem}
          className="border border-borda px-4 py-2 text-ink hover:border-lacre disabled:opacity-50"
        >
          <span className="meta">
            {enviandoImagem
              ? "Enviando…"
              : imagemCapa
                ? "Trocar imagem"
                : "Escolher imagem de capa"}
          </span>
        </button>
        {erroImagem && (
          <p className="mt-2 font-serif text-xs text-lacre">{erroImagem}</p>
        )}
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={evento?.publicado ?? false}
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
