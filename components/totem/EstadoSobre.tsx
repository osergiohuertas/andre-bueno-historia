import Image from "next/image";
import { ZonaAlcance } from "@/components/totem/ZonaAlcance";

export function EstadoSobre({
  nomeSite,
  manifesto,
  trajetoria,
  fotoUrl,
  onConhecerObra,
}: {
  nomeSite: string;
  manifesto: string;
  trajetoria: string;
  fotoUrl: string;
  onConhecerObra: () => void;
}) {
  return (
    <>
      <div
        className="absolute inset-x-0 top-0 flex flex-col items-center justify-end px-10 text-center"
        style={{ height: "20vh" }}
      >
        <p className="meta text-ouro">O Historiador</p>
        <h1 className="mt-3 font-display text-2xl text-paper">{nomeSite}</h1>
      </div>

      <ZonaAlcance className="gap-5 overflow-y-auto px-8">
        {fotoUrl && (
          <div className="relative mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-ouro/60">
            <Image src={fotoUrl} alt={nomeSite} fill sizes="128px" className="object-cover" />
          </div>
        )}

        <p className="text-center font-serif text-lg leading-relaxed text-paper/85">
          {manifesto}
        </p>

        {trajetoria && (
          <p className="text-center font-serif text-sm leading-relaxed text-paper/60">
            {trajetoria}
          </p>
        )}

        <button
          type="button"
          onClick={onConhecerObra}
          className="mx-auto mt-2 flex shrink-0 items-center gap-3 border border-ouro bg-ouro/10 px-6 text-ouro transition-transform active:scale-[0.98] active:bg-ouro/25"
          style={{ minHeight: "58px" }}
        >
          Conheça a obra →
        </button>
      </ZonaAlcance>
    </>
  );
}
