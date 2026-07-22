import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { FaixaTransversal } from "@/components/timeline/FaixaTransversal";
import { LinhaDoTempoScroll } from "@/components/timeline/LinhaDoTempoScroll";
import { getLinhaDoTempo, getConteudoTransversal } from "@/lib/timeline";

export const metadata: Metadata = {
  title: "Linha do Tempo — André Bueno",
  description:
    "Artigos e acervo, das sociedades originárias ao Brasil republicano, em ordem cronológica.",
};

export default function LinhaDoTempoPage() {
  const faixas = getLinhaDoTempo();
  const transversal = getConteudoTransversal();

  return (
    <>
      <div className="border-b border-borda py-12">
        <Container>
          <p className="meta text-lacre">Autoridade</p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            Linha do Tempo
          </h1>
          <p className="mt-4 max-w-prose font-serif text-chumbo">
            Derivada inteiramente dos artigos e do acervo — nenhum conteúdo
            é escrito aqui. Períodos sem material aparecem como &ldquo;em
            pesquisa&rdquo;: a lacuna é informação, não é escondida.
          </p>
        </Container>
      </div>

      <FaixaTransversal itens={transversal} />

      <LinhaDoTempoScroll faixas={faixas} />
    </>
  );
}
