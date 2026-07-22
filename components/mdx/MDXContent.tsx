import * as runtime from "react/jsx-runtime";
import type { ComponentPropsWithoutRef, ComponentType } from "react";
import { Termo } from "@/components/mdx/Termo";

const mdxComponents = {
  termo: Termo,
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-12 mb-4 font-display text-2xl text-ink md:text-3xl"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-10 mb-3 font-display text-xl text-ink" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="my-5 text-left" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-8 border-l-2 border-lacre pl-6 font-serif text-xl italic text-chumbo"
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="my-5 list-disc space-y-2 pl-6" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="my-5 list-decimal space-y-2 pl-6" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a className="text-lacre underline underline-offset-2" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-ink" {...props} />
  ),
};

// Cacheia por código compilado: o mesmo `code` sempre resolve para o mesmo
// componente, em vez de recriar a função a cada render.
const cache = new Map<string, ComponentType<{ components?: typeof mdxComponents }>>();

function resolveMDXComponent(code: string) {
  const existente = cache.get(code);
  if (existente) return existente;

  const fn = new Function(code);
  const Component = fn({ ...runtime }).default;
  cache.set(code, Component);
  return Component;
}

export function MDXContent({ code }: { code: string }) {
  // resolveMDXComponent é cacheada por `code` — a referência é estável entre
  // renders, mas o lint não consegue provar isso estaticamente.
  const Component = resolveMDXComponent(code);
  return (
    <div className="prose-artigo">
      {/* eslint-disable-next-line react-hooks/static-components */}
      <Component components={mdxComponents} />
    </div>
  );
}
