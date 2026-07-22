import { ZonaAlcance } from "@/components/totem/ZonaAlcance";
import {
  IconeLinhaDoTempo,
  IconeMapa,
  IconePena,
  IconeAcervo,
} from "@/components/totem/TotemIcons";

const PORTAS = [
  {
    id: "timeline" as const,
    Icone: IconeLinhaDoTempo,
    titulo: "Linha do Tempo",
    subtitulo: "Da colônia à ditadura, período a período",
  },
  {
    id: "acervo" as const,
    Icone: IconeAcervo,
    titulo: "Acervo Documental",
    subtitulo: "Documentos originais, com fonte declarada",
  },
  {
    id: "mapa" as const,
    Icone: IconeMapa,
    titulo: "Mapa Histórico",
    subtitulo: "Onde a história aconteceu, e onde visitar",
  },
  {
    id: "sobre" as const,
    Icone: IconePena,
    titulo: "O Historiador",
    subtitulo: "Quem é o André e por que este acervo existe",
  },
];

export function EstadoMenu({
  nomeSite,
  onEscolher,
}: {
  nomeSite: string;
  onEscolher: (destino: "timeline" | "acervo" | "mapa" | "sobre") => void;
}) {
  return (
    <>
      <div className="absolute inset-x-0 top-0 flex flex-col items-center justify-end px-10 text-center" style={{ height: "20vh" }}>
        <p className="meta text-ouro">{nomeSite}</p>
        <h1 className="mt-3 font-display text-2xl text-paper">O que você quer explorar?</h1>
      </div>

      <ZonaAlcance className="justify-center gap-3 px-6 py-2">
        {PORTAS.map((porta) => (
          <button
            key={porta.id}
            type="button"
            onClick={() => onEscolher(porta.id)}
            className="flex shrink-0 items-center gap-5 border border-paper/20 bg-paper/5 px-6 text-left text-ouro transition-transform active:scale-[0.98] active:bg-ouro/15"
            style={{ minHeight: "88px" }}
          >
            <porta.Icone />
            <span>
              <span className="block font-display text-xl text-paper">
                {porta.titulo}
              </span>
              <span className="mt-1 block font-serif text-sm text-paper/60">
                {porta.subtitulo}
              </span>
            </span>
          </button>
        ))}
      </ZonaAlcance>
    </>
  );
}
