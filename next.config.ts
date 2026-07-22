import type { NextConfig } from "next";

type WebpackCompiler = {
  options: { mode?: string };
  hooks: {
    beforeCompile: { tapPromise: (name: string, fn: () => Promise<void>) => void };
  };
};

// Roda o build do Velite junto com o Next.js — recipe oficial
// (https://velite.js.org/guide/with-nextjs), já que o Velite ainda não
// publica um plugin dedicado.
class VeliteWebpackPlugin {
  static started = false;

  apply(compiler: WebpackCompiler) {
    compiler.hooks.beforeCompile.tapPromise("VeliteWebpackPlugin", async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const dev = compiler.options.mode === "development";
      const { build } = await import("velite");
      // strict: um MDX com `periodo` fora da taxonomia canônica quebra o build.
      await build({ watch: dev, clean: !dev, strict: true });
    });
  }
}

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/atlas",
        destination: "/acervo?secao=atlas",
        permanent: true,
      },
      {
        source: "/obra",
        destination: "/acervo?secao=livros",
        permanent: true,
      },
      {
        source: "/obra/livros",
        destination: "/acervo?secao=livros",
        permanent: true,
      },
      {
        source: "/obra/publicacoes",
        destination: "/acervo?secao=publicacoes",
        permanent: true,
      },
      {
        source: "/obra/videos",
        destination: "/acervo?secao=videos",
        permanent: true,
      },
      {
        source: "/obra/fotos",
        destination: "/acervo?secao=fotos",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      // Capa do livro puxada direto da Amazon (data/livro.defaults.ts) —
      // ideal migrar pro upload do painel quando o André tiver uma imagem
      // própria.
      { protocol: "https", hostname: "m.media-amazon.com" },
      // Fotos de museus com fonte no Wikimedia Commons (domínio público /
      // CC) — cadastro inicial de exemplo, ideal migrar pro upload do
      // painel quando o André tiver fotos próprias de cada museu.
      { protocol: "https", hostname: "upload.wikimedia.org" },
      // Uploads do painel (foto do Sobre, capas de artigo/acervo/opinião,
      // mídia da obra) — bucket público no Supabase Storage, ver lib/upload.ts.
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

export default nextConfig;
