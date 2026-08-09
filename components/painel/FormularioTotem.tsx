"use client";

import { useActionState, useRef, useState } from "react";
import { periodosOrdenados, type PeriodoId } from "@/data/periodos";
import { uploadImagemAction } from "@/app/painel/(protegido)/novo-artigo/actions";
import { FORMATOS_IMAGEM_ACEITOS, TAMANHO_MAXIMO_MB } from "@/lib/uploadConfig";
import type { EstadoTotem } from "@/app/painel/(protegido)/totem/actions";

type Frase = { periodo: PeriodoId | ""; texto: string; imagem_url: string };

type TotemExistente = {
  nome_local: string;
  reset_segundos: number;
  utm_campaign: string | null;
  ativo: boolean;
  frases: { periodo: string; texto: string; imagem_url: string }[];
};

export function FormularioTotem({
  totem,
  action,
}: {
  totem?: TotemExistente;
  action: (estado: EstadoTotem, formData: FormData) => Promise<EstadoTotem>;
}) {
  const [estado, formAction, pendente] = useActionState(action, null);
  const [frases, setFrases] = useState<Frase[]>(
    (totem?.frases ?? []).map((f) => ({
      periodo: (f.periodo as PeriodoId) || "",
      texto: f.texto,
      imagem_url: f.imagem_url,
    })),
  );
  const [enviandoImagem, setEnviandoImagem] = useState<Record<number, boolean>>({});
  const [erroImagem, setErroImagem] = useState<Record<number, string>>({});
  const inputsArquivoRef = useRef<Record<number, HTMLInputElement | null>>({});

  function adicionarFrase() {
    setFrases((atual) => [...atual, { periodo: "", texto: "", imagem_url: "" }]);
  }

  function atualizarFrase(i: number, parcial: Partial<Frase>) {
    setFrases((atual) => atual.map((f, idx) => (idx === i ? { ...f, ...parcial } : f)));
  }

  function removerFrase(i: number) {
    setFrases((atual) => atual.filter((_, idx) => idx !== i));
  }

  async function lidarComUploadFrase(i: number, arquivo: File) {
    setEnviandoImagem((atual) => ({ ...atual, [i]: true }));
    setErroImagem((atual) => ({ ...atual, [i]: "" }));
    const formData = new FormData();
    formData.append("arquivo", arquivo);
    const resultado = await uploadImagemAction(formData);
    setEnviandoImagem((atual) => ({ ...atual, [i]: false }));

    if (!resultado.ok) {
      setErroImagem((atual) => ({ ...atual, [i]: resultado.erro }));
      return;
    }
    atualizarFrase(i, { imagem_url: resultado.url });
  }

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-6">
      <input type="hidden" name="frases" value={JSON.stringify(frases)} />

      <div className="flex gap-6">
        <div className="flex-1">
          <label htmlFor="nome_local" className="meta mb-1 block text-chumbo-lt">
            Nome do local
          </label>
          <p className="mb-2 font-serif text-xs text-chumbo-lt">
            Identifica este totem no UTM do QR — útil se houver mais de um.
          </p>
          <input
            id="nome_local"
            name="nome_local"
            defaultValue={totem?.nome_local ?? "Totem"}
            required
            className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="reset_segundos" className="meta mb-1 block text-chumbo-lt">
            Reset por ociosidade (s)
          </label>
          <input
            id="reset_segundos"
            name="reset_segundos"
            type="number"
            min={10}
            defaultValue={totem?.reset_segundos ?? 45}
            required
            className="w-40 border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="utm_campaign" className="meta mb-1 block text-chumbo-lt">
          UTM campaign (opcional)
        </label>
        <p className="mb-2 font-serif text-xs text-chumbo-lt">
          Se vazio, usa o nome do local.
        </p>
        <input
          id="utm_campaign"
          name="utm_campaign"
          defaultValue={totem?.utm_campaign ?? ""}
          className="w-full max-w-sm border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="ativo"
          defaultChecked={totem?.ativo ?? true}
          className="h-5 w-5 border border-borda"
        />
        <span className="text-ink">Ativo (o /modototem lê esta configuração)</span>
      </label>

      <div className="border-t border-borda pt-6">
        <p className="meta mb-1 text-lacre">Attract loop</p>
        <h2 className="font-display text-xl text-ink">Frases da tela de atração</h2>
        <p className="mt-2 mb-6 font-serif text-sm text-chumbo-lt">
          Se a lista ficar vazia, o totem usa os artigos publicados mais recentes como
          fallback — nunca fica em branco.
        </p>

        <div className="flex flex-col gap-6">
          {frases.map((frase, i) => (
            <div key={i} className="border border-borda bg-paper-mid p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="meta mb-1 block text-chumbo-lt">Período</label>
                  <select
                    value={frase.periodo}
                    onChange={(e) => atualizarFrase(i, { periodo: e.target.value as PeriodoId })}
                    className="w-full border border-borda bg-paper px-3 py-2 text-ink focus:border-lacre focus:outline-none"
                  >
                    <option value="">— nenhum —</option>
                    {periodosOrdenados().map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-[2]">
                  <label className="meta mb-1 block text-chumbo-lt">
                    Imagem (opcional)
                  </label>
                  <p className="mb-2 font-serif text-xs text-chumbo-lt">
                    Aceita {FORMATOS_IMAGEM_ACEITOS} — até {TAMANHO_MAXIMO_MB}MB.
                  </p>

                  <input
                    ref={(el) => {
                      inputsArquivoRef.current[i] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const arquivo = e.target.files?.[0];
                      if (arquivo) lidarComUploadFrase(i, arquivo);
                      e.target.value = "";
                    }}
                  />

                  {frase.imagem_url && (
                    <div className="mb-2 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={frase.imagem_url}
                        alt=""
                        className="h-14 w-24 border border-borda object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => atualizarFrase(i, { imagem_url: "" })}
                        className="meta text-chumbo hover:text-lacre"
                      >
                        Remover
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => inputsArquivoRef.current[i]?.click()}
                    disabled={enviandoImagem[i]}
                    className="border border-borda px-3 py-1.5 text-ink hover:border-lacre disabled:opacity-50"
                  >
                    <span className="meta">
                      {enviandoImagem[i]
                        ? "Enviando…"
                        : frase.imagem_url
                          ? "Trocar imagem"
                          : "Escolher imagem"}
                    </span>
                  </button>
                  {erroImagem[i] && (
                    <p className="mt-1 font-serif text-xs text-lacre">
                      {erroImagem[i]}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="meta mb-1 block text-chumbo-lt">Texto</label>
                <textarea
                  value={frase.texto}
                  onChange={(e) => atualizarFrase(i, { texto: e.target.value })}
                  rows={2}
                  className="w-full border border-borda bg-paper px-3 py-2 text-ink focus:border-lacre focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => removerFrase(i)}
                className="meta mt-3 text-chumbo hover:text-lacre"
              >
                Remover frase
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={adicionarFrase}
          className="mt-4 border border-borda px-4 py-2 text-ink hover:border-lacre"
        >
          <span className="meta">+ Adicionar frase</span>
        </button>
      </div>

      <div className="flex items-center gap-4 border-t border-borda pt-6">
        <button
          type="submit"
          disabled={pendente}
          className="border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre disabled:opacity-50"
        >
          <span className="meta text-ouro">{pendente ? "Salvando…" : "Salvar"}</span>
        </button>

        <a
          href="/modototem"
          target="_blank"
          rel="noreferrer"
          className="border border-borda px-6 py-3 text-ink hover:border-lacre"
        >
          <span className="meta">Pré-visualizar →</span>
        </a>

        {estado && (
          <p className={`meta ${estado.ok ? "text-chumbo" : "text-lacre"}`}>
            {estado.mensagem}
          </p>
        )}
      </div>
    </form>
  );
}
