import { AtlasMapa } from "@/components/atlas/AtlasMapa";
import type { PontoAtlas } from "@/lib/atlas";

export function EstadoMapa({
  pontosMapa,
  onSelecionarPonto,
}: {
  pontosMapa: PontoAtlas[];
  onSelecionarPonto: (info: {
    tipo: "artigo" | "destino";
    slug: string;
    titulo: string;
    url: string;
  }) => void;
}) {
  return (
    <>
      <div
        className="absolute inset-x-0 top-0 flex flex-col items-center justify-end px-10 text-center"
        style={{ height: "20vh" }}
      >
        <p className="meta text-ouro">Mapa histórico</p>
        <h1 className="mt-3 font-display text-2xl text-paper">
          Onde a história aconteceu
        </h1>
      </div>

      <div
        className="absolute inset-x-0 px-5 text-ink"
        style={{ top: "22vh", height: "58vh" }}
      >
        <div className="h-full bg-paper p-3">
          <AtlasMapa
            pontos={pontosMapa}
            modoQuiosque
            onSelecionarPonto={onSelecionarPonto}
            mensagemIndisponivel="O mapa está descansando — volte em breve."
          />
        </div>
      </div>
    </>
  );
}
