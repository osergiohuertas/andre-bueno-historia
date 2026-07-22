import Image from "next/image";
import { ZonaAlcance } from "@/components/totem/ZonaAlcance";

export type MuseuPreviewData = {
  slug: string;
  nome: string;
  tipologia: string;
  cidade: string;
  endereco: string;
  horario: string;
  ingresso: string;
  textoAutoral: string | null;
  foto: string | null;
  url: string;
};

export function EstadoMuseuPreview({
  museu,
  onContinuarNoCelular,
  onVoltar,
}: {
  museu: MuseuPreviewData;
  onContinuarNoCelular: () => void;
  onVoltar: () => void;
}) {
  return (
    <>
      <div
        className="absolute inset-x-0 top-0 flex flex-col items-center justify-end px-10 text-center"
        style={{ height: "20vh" }}
      >
        <p className="meta text-ouro">{museu.tipologia}</p>
        <h1 className="mt-2 line-clamp-2 font-display text-xl text-paper">
          {museu.nome}
        </h1>
      </div>

      <ZonaAlcance className="gap-3 px-6">
        <button type="button" onClick={onVoltar} className="meta self-start text-ouro">
          ← Voltar
        </button>

        {museu.foto && (
          <div className="relative h-28 w-full shrink-0 overflow-hidden bg-paper-mid">
            <Image src={museu.foto} alt="" fill sizes="405px" className="object-cover" />
          </div>
        )}

        <dl className="shrink-0 space-y-2 font-serif text-sm text-paper/85">
          <div>
            <dt className="meta text-paper/40">Endereço</dt>
            <dd>
              {museu.endereco}, {museu.cidade}
            </dd>
          </div>
          <div>
            <dt className="meta text-paper/40">Horário</dt>
            <dd>{museu.horario}</dd>
          </div>
          <div>
            <dt className="meta text-paper/40">Ingresso</dt>
            <dd>{museu.ingresso}</dd>
          </div>
        </dl>

        {museu.textoAutoral && (
          <p className="shrink-0 font-serif text-sm leading-relaxed text-paper/70">
            {museu.textoAutoral}
          </p>
        )}

        <button
          type="button"
          onClick={onContinuarNoCelular}
          className="mt-2 flex shrink-0 items-center gap-3 border border-ouro bg-ouro/10 px-6 text-ouro transition-transform active:scale-[0.98] active:bg-ouro/25"
          style={{ minHeight: "58px" }}
        >
          Ver rota e mais detalhes no celular →
        </button>
      </ZonaAlcance>
    </>
  );
}
