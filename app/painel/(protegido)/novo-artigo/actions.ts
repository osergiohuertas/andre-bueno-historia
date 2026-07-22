"use server";

import { uploadImagem } from "@/lib/upload";
import { commitArtigoMdx } from "@/lib/github";
import { createClient } from "@/lib/supabase/server";
import { gerarSlug } from "@/lib/slug";
import { getSeguidoresDaSerie } from "@/lib/series-seguidas";
import { enviarEmailNotificacaoSerie } from "@/lib/brevo";
import { SITE_URL } from "@/lib/site";
import type { PeriodoId } from "@/data/periodos";

export async function uploadImagemAction(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; erro: string }> {
  const arquivo = formData.get("arquivo");
  if (!(arquivo instanceof File)) {
    return { ok: false, erro: "Nenhum arquivo enviado." };
  }

  const buffer = Buffer.from(await arquivo.arrayBuffer());
  return uploadImagem(buffer, arquivo.name);
}

export type EstadoPublicacao =
  | { status: "idle" }
  | { status: "erro"; mensagem: string }
  | { status: "ok"; url: string; slug: string };

export async function publicarArtigoAction(input: {
  titulo: string;
  subtitulo?: string;
  periodo: PeriodoId;
  periodosSecundarios: PeriodoId[];
  anoInicio: number;
  anoFim?: number;
  regiao?: string;
  serie?: string;
  excerpt: string;
  tags: string[];
  imagemCapa?: string;
  corpoMdx: string;
}): Promise<EstadoPublicacao> {
  if (!input.periodo) {
    return {
      status: "erro",
      mensagem: "Nenhum artigo pode ser publicado sem período declarado.",
    };
  }
  if (!input.titulo || !input.corpoMdx) {
    return { status: "erro", mensagem: "Título e corpo são obrigatórios." };
  }

  const slug = gerarSlug(input.titulo);
  const leituraMinutos = Math.max(
    1,
    Math.round(input.corpoMdx.split(/\s+/).length / 200),
  );

  let serieOrdem: number | undefined;
  let serieNome: string | undefined;
  if (input.serie) {
    try {
      const supabase = await createClient();
      const { count } = await supabase
        .from("series")
        .select("*", { count: "exact", head: true })
        .eq("slug", input.serie);
      serieOrdem = (count ?? 0) + 1;

      const { data: serieRow } = await supabase
        .from("series")
        .select("nome")
        .eq("slug", input.serie)
        .maybeSingle();
      serieNome = serieRow?.nome;
    } catch {
      serieOrdem = undefined;
    }
  }

  const frontmatter: Record<string, unknown> = {
    titulo: input.titulo,
    ...(input.subtitulo ? { subtitulo: input.subtitulo } : {}),
    slug,
    periodo: input.periodo,
    ...(input.periodosSecundarios.length
      ? { periodosSecundarios: input.periodosSecundarios }
      : {}),
    anoInicio: input.anoInicio,
    ...(input.anoFim ? { anoFim: input.anoFim } : {}),
    ...(input.regiao ? { regiao: input.regiao } : {}),
    excerpt: input.excerpt,
    leituraMinutos,
    tags: input.tags,
    ...(input.serie ? { serie: input.serie, serieOrdem } : {}),
    ...(input.imagemCapa ? { imagemCapa: input.imagemCapa } : {}),
    publicado: true,
    data: new Date().toISOString().slice(0, 10),
  };

  const yaml = Object.entries(frontmatter)
    .map(([chave, valor]) => `${chave}: ${formatarValorYaml(valor)}`)
    .join("\n");

  const conteudoMdx = `---\n${yaml}\n---\n\n${input.corpoMdx.trim()}\n`;

  const resultado = await commitArtigoMdx(slug, conteudoMdx);

  if (!resultado.ok) {
    return { status: "erro", mensagem: resultado.erro };
  }

  // Notificação pra quem segue a série — melhor esforço: uma falha aqui
  // não desfaz a publicação, que já aconteceu (commit no GitHub).
  if (input.serie && serieNome) {
    try {
      const seguidores = await getSeguidoresDaSerie(input.serie);
      await enviarEmailNotificacaoSerie({
        destinatarios: seguidores,
        serieNome,
        artigoTitulo: input.titulo,
        artigoUrl: `${SITE_URL}/artigos/${slug}`,
      });
    } catch {
      // segue o jogo — a publicação já é um sucesso independente disso.
    }
  }

  return { status: "ok", url: resultado.url, slug };
}

function formatarValorYaml(valor: unknown): string {
  if (Array.isArray(valor)) {
    return `[${valor.map((v) => JSON.stringify(v)).join(", ")}]`;
  }
  if (typeof valor === "string") return JSON.stringify(valor);
  return String(valor);
}
