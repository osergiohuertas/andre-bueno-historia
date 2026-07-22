import Image from "next/image";
import { ZonaAlcance } from "@/components/totem/ZonaAlcance";

export type AcervoPreviewData = {
  slug: string;
  titulo: string;
  excerpt: string;
  pdfUrl: string;
  fonte: string | null;
  imagemCapa: string | null;
  previaTexto: string | null;
  periodoLabel: string;
};

export function EstadoAcervoPreview({
  documento,
  onContinuarNoCelular,
  onVoltar,
}: {
  documento: AcervoPreviewData;
  onContinuarNoCelular: () => void;
  onVoltar: () => void;
}) {
  return (
    <>
      <div
        className="absolute inset-x-0 top-0 flex flex-col items-center justify-end px-10 text-center"
        style={{ height: "20vh" }}
      >
        <p className="meta text-ouro">{documento.periodoLabel}</p>
        <h1 className="mt-2 line-clamp-2 font-display text-xl text-paper">
          {documento.titulo}
        </h1>
      </div>

      <ZonaAlcance className="gap-4 px-6">
        <button type="button" onClick={onVoltar} className="meta self-start text-ouro">
          ← Voltar
        </button>

        <div className="relative flex h-32 w-full shrink-0 items-center justify-center overflow-hidden bg-paper-mid">
          {documento.imagemCapa ? (
            <Image
              src={documento.imagemCapa}
              alt=""
              fill
              sizes="405px"
              className="object-cover"
            />
          ) : (
            <span className="meta text-borda">PDF</span>
          )}
        </div>

        {documento.fonte && (
          <p className="meta shrink-0 text-paper/40">Fonte: {documento.fonte}</p>
        )}

        <p className="shrink-0 font-serif text-base leading-relaxed text-paper/90">
          {documento.previaTexto ?? documento.excerpt}
        </p>

        <button
          type="button"
          onClick={onContinuarNoCelular}
          className="mt-2 flex shrink-0 items-center gap-3 border border-ouro bg-ouro/10 px-6 text-ouro transition-transform active:scale-[0.98] active:bg-ouro/25"
          style={{ minHeight: "58px" }}
        >
          Ver documento completo no celular →
        </button>
      </ZonaAlcance>
    </>
  );
}
