import Image from "next/image";
import { ZonaAlcance } from "@/components/totem/ZonaAlcance";

export type ArtigoPreviewData = {
  slug: string;
  titulo: string;
  excerpt: string;
  url: string;
  periodoLabel: string;
  imagemCapa: string | null;
  tags: string[];
  leituraMinutos: number;
  previaTexto: string | null;
  serie: {
    nome: string;
    descricao: string | null;
    parte: number;
    totalPartes: number | null;
  } | null;
};

export function EstadoArtigoPreview({
  artigo,
  onContinuarNoCelular,
  onVoltar,
}: {
  artigo: ArtigoPreviewData;
  onContinuarNoCelular: () => void;
  onVoltar: () => void;
}) {
  return (
    <>
      <div
        className="absolute inset-x-0 top-0 flex flex-col items-center justify-end px-10 text-center"
        style={{ height: "20vh" }}
      >
        <p className="meta text-ouro">{artigo.periodoLabel}</p>
        <h1 className="mt-2 line-clamp-2 font-display text-xl text-paper">
          {artigo.titulo}
        </h1>
      </div>

      <ZonaAlcance className="gap-4 px-6">
        <button type="button" onClick={onVoltar} className="meta self-start text-ouro">
          ← Voltar
        </button>

        {artigo.imagemCapa && (
          <div className="relative h-32 w-full shrink-0 overflow-hidden bg-paper-mid">
            <Image
              src={artigo.imagemCapa}
              alt=""
              fill
              sizes="405px"
              className="object-cover"
            />
          </div>
        )}

        {artigo.serie && (
          <p className="meta shrink-0 border-l-2 border-ouro py-1 pl-3 text-paper/70">
            Parte {artigo.serie.parte}
            {artigo.serie.totalPartes ? ` de ${artigo.serie.totalPartes}` : ""} da série{" "}
            <span className="text-ouro">{artigo.serie.nome}</span>
          </p>
        )}

        <p className="shrink-0 font-serif text-base leading-relaxed text-paper/90">
          {artigo.previaTexto ?? artigo.excerpt}
        </p>

        <p className="meta shrink-0 text-paper/40">{artigo.leituraMinutos} min de leitura</p>

        <button
          type="button"
          onClick={onContinuarNoCelular}
          className="mt-2 flex shrink-0 items-center gap-3 border border-ouro bg-ouro/10 px-6 text-ouro transition-transform active:scale-[0.98] active:bg-ouro/25"
          style={{ minHeight: "58px" }}
        >
          Continuar lendo no celular →
        </button>
      </ZonaAlcance>
    </>
  );
}
