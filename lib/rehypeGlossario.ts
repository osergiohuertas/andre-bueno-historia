import { visit } from "unist-util-visit";
import type { Root, Element, Text } from "hast";

export type TermoGlossario = {
  slug: string;
  termo: string;
  definicao: string;
};

// Tags cujo texto nunca deve ganhar tooltip — títulos, links, código.
const TAGS_IGNORADAS = new Set([
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  "code",
  "pre",
  "termo",
]);

function escaparRegex(valor: string): string {
  return valor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function criarRegexTermo(termo: string): RegExp {
  // \b não lida bem com acentos em português — usa classes Unicode para
  // garantir que o match respeita fronteira de palavra em "inconfidência",
  // "regência" etc.
  return new RegExp(
    `(?<![\\p{L}\\p{N}])(${escaparRegex(termo)})(?![\\p{L}\\p{N}])`,
    "iu",
  );
}

/**
 * Envolve a primeira ocorrência de cada termo do glossário (por documento)
 * com um elemento <termo>, resolvido pelo componente `Termo` registrado em
 * MDXContent. Ocorrências repetidas do mesmo termo não são marcadas de novo
 * — evita poluir o artigo com tooltip a cada frase.
 */
export function rehypeGlossario(termos: TermoGlossario[]) {
  // Termos mais longos primeiro, para "reformas de base" não perder pra
  // um match parcial de um termo mais curto contido nele.
  const termosOrdenados = [...termos].sort(
    (a, b) => b.termo.length - a.termo.length,
  );

  return () => (tree: Root) => {
    const usados = new Set<string>();

    visit(tree, "text", (node: Text, index, parent) => {
      if (!parent || index === null || index === undefined) return;
      if (parent.type !== "element") return;
      if (TAGS_IGNORADAS.has((parent as Element).tagName)) return;

      for (const termo of termosOrdenados) {
        if (usados.has(termo.slug)) continue;

        const regex = criarRegexTermo(termo.termo);
        const match = regex.exec(node.value);
        if (!match) continue;

        usados.add(termo.slug);

        const inicio = match.index;
        const fim = inicio + match[1].length;
        const antes = node.value.slice(0, inicio);
        const meio = node.value.slice(inicio, fim);
        const depois = node.value.slice(fim);

        const termoElement: Element = {
          type: "element",
          tagName: "termo",
          properties: { dataSlug: termo.slug, dataDefinicao: termo.definicao },
          children: [{ type: "text", value: meio }],
        };

        const novosNos = [
          ...(antes ? [{ type: "text" as const, value: antes }] : []),
          termoElement,
          ...(depois ? [{ type: "text" as const, value: depois }] : []),
        ];

        parent.children.splice(index, 1, ...novosNos);
        break;
      }
    });
  };
}
