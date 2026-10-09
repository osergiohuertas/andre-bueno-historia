import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTodosArtigos } from "@/lib/artigos";
import { getTodasOpinioes } from "@/lib/opinioes";
import { getAcervoPublicado } from "@/lib/acervo";
import { formatarData } from "@/lib/format";

export const dynamic = "force-dynamic";

type Pendencia = { href: string; titulo: string; motivo: string };

// Imagem salva num projeto Supabase que não é o atual = arquivo perdido
// (o projeto antigo foi apagado). Precisa ser reenviada pelo painel.
function imagemPerdida(url?: string | null) {
  if (!url || !url.includes(".supabase.co")) return false;
  const atual = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).host;
  return !url.includes(atual);
}

export default async function InicioPainelPage() {
  const supabase = await createClient();
  const agora = new Date().toISOString();

  const [destinos, eventos, midia, publicacoes, fotoSobre] = await Promise.all([
    supabase.from("destinos").select("id, nome, endereco, coordenadas, foto, publicado"),
    supabase.from("eventos").select("id, titulo, slug, local, data_inicio, publicado").order("data_inicio"),
    supabase.from("acervo_midia").select("id, tipo, titulo, url, publicado"),
    supabase.from("publicacoes").select("id, publicado"),
    supabase.from("site_config").select("valor").eq("chave", "sobre.foto_url").maybeSingle(),
  ]);

  const artigos = getTodosArtigos().sort((a, b) => b.data.localeCompare(a.data));
  const opinioes = getTodasOpinioes();
  const trabalhos = getAcervoPublicado();
  const listaDestinos = destinos.data ?? [];
  const listaEventos = eventos.data ?? [];
  const listaMidia = midia.data ?? [];
  const videos = listaMidia.filter((m) => m.tipo === "video");
  const fotos = listaMidia.filter((m) => m.tipo === "foto");
  const proximos = listaEventos.filter((e) => e.data_inicio >= agora).slice(0, 4);

  const pendencias: Pendencia[] = [];
  for (const d of listaDestinos) {
    const semLocal =
      d.endereco === "A confirmar" || (d.coordenadas.lat === 0 && d.coordenadas.lng === 0);
    if (semLocal) {
      pendencias.push({ href: `/painel/destinos/${d.id}`, titulo: d.nome, motivo: "Destino sem endereço ou localização no mapa" });
    } else if (!d.publicado) {
      pendencias.push({ href: `/painel/destinos/${d.id}`, titulo: d.nome, motivo: "Destino em rascunho" });
    }
    if (imagemPerdida(d.foto)) {
      pendencias.push({ href: `/painel/destinos/${d.id}`, titulo: d.nome, motivo: "Foto perdida — reenviar" });
    }
  }
  for (const v of videos) {
    if (v.url.includes("youtube.com/results")) {
      pendencias.push({ href: `/painel/obra/videos/${v.id}`, titulo: v.titulo, motivo: "Vídeo sem link — cole a URL e publique" });
    } else if (!v.publicado) {
      pendencias.push({ href: `/painel/obra/videos/${v.id}`, titulo: v.titulo, motivo: "Vídeo em rascunho" });
    }
  }
  for (const e of listaEventos) {
    if (e.local === "A confirmar") {
      pendencias.push({ href: `/painel/agenda/${e.id}`, titulo: e.titulo, motivo: "Evento sem local/organizador" });
    }
  }
  for (const a of artigos) {
    if (imagemPerdida(a.imagemCapa)) {
      pendencias.push({ href: `/painel/artigos/${a.slug}`, titulo: a.titulo, motivo: "Capa perdida — reenviar" });
    }
  }
  for (const t of trabalhos) {
    if (imagemPerdida(t.imagemCapa)) {
      pendencias.push({ href: `/painel/acervo/documentos/${t.slug}`, titulo: t.titulo, motivo: "Capa perdida — reenviar" });
    }
  }
  if (!fotoSobre.data?.valor || imagemPerdida(fotoSobre.data.valor)) {
    pendencias.push({ href: "/painel/conteudo/sobre", titulo: "Página Sobre", motivo: "Sem foto do autor" });
  }

  const numeros = [
    { label: "Artigos", valor: artigos.filter((a) => a.publicado).length, href: "/painel/artigos" },
    { label: "Opiniões", valor: opinioes.filter((o) => o.publicado).length, href: "/painel/opinioes" },
    { label: "Destinos", valor: listaDestinos.filter((d) => d.publicado).length, href: "/painel/destinos" },
    { label: "Eventos futuros", valor: proximos.length, href: "/painel/agenda" },
    { label: "Vídeos", valor: videos.filter((v) => v.publicado).length, href: "/painel/obra/videos" },
    { label: "Fotos", valor: fotos.filter((f) => f.publicado).length, href: "/painel/obra/fotos" },
    { label: "Publicações", valor: (publicacoes.data ?? []).filter((p) => p.publicado).length, href: "/painel/obra/publicacoes" },
    { label: "Trabalhos técnicos", valor: trabalhos.length, href: "/painel/acervo/documentos" },
  ];

  const atalhos = [
    { href: "/painel/novo-artigo", label: "Novo artigo" },
    { href: "/painel/nova-opiniao", label: "Nova opinião" },
    { href: "/painel/agenda/novo", label: "Novo evento" },
    { href: "/painel/destinos/novo", label: "Novo destino" },
    { href: "/painel/obra/fotos/nova", label: "Nova foto" },
    { href: "/painel/midia", label: "Biblioteca de mídia" },
  ];

  return (
    <div className="max-w-6xl">
      <p className="meta text-lacre">Painel</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Visão geral</h1>
      <p className="mt-2 font-serif text-chumbo">
        O que está no ar, o que precisa de atenção e os próximos compromissos.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {atalhos.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="meta border border-ink px-4 py-2.5 text-ink transition-colors hover:bg-ink hover:text-ouro"
          >
            + {a.label}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 border-l border-t border-borda sm:grid-cols-4">
        {numeros.map((n) => (
          <Link
            key={n.label}
            href={n.href}
            className="group border-b border-r border-borda p-5 transition-colors hover:bg-paper-mid"
          >
            <p className="font-display text-3xl text-ink group-hover:text-lacre">{n.valor}</p>
            <p className="meta mt-1 text-chumbo-lt">{n.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl text-ink">Precisa de atenção</h2>
            <span className="meta text-chumbo-lt">{pendencias.length} itens</span>
          </div>
          {pendencias.length === 0 ? (
            <p className="mt-6 font-serif text-chumbo">Tudo em dia.</p>
          ) : (
            <ul className="mt-6 divide-y divide-borda border-y border-borda">
              {pendencias.map((p, i) => (
                <li key={`${p.href}-${i}`}>
                  <Link
                    href={p.href}
                    className="group flex items-center justify-between gap-4 py-3.5 hover:bg-paper-mid"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-serif text-ink group-hover:text-lacre">{p.titulo}</p>
                      <p className="meta mt-0.5 text-lacre/80">{p.motivo}</p>
                    </div>
                    <span className="meta shrink-0 text-chumbo-lt" aria-hidden>
                      Abrir →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-col gap-12">
          <section>
            <h2 className="font-display text-2xl text-ink">Próximos eventos</h2>
            {proximos.length === 0 ? (
              <p className="mt-6 font-serif text-chumbo">Nenhum evento futuro.</p>
            ) : (
              <ul className="mt-6 flex flex-col gap-3">
                {proximos.map((e) => (
                  <li key={e.id}>
                    <Link href={`/painel/agenda/${e.id}`} className="block border border-borda p-4 hover:border-lacre">
                      <p className="meta text-lacre">{formatarData(e.data_inicio)}</p>
                      <p className="mt-1 font-serif text-ink">{e.titulo}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink">Últimos artigos</h2>
            <ul className="mt-6 flex flex-col gap-3">
              {artigos.slice(0, 5).map((a) => (
                <li key={a.slug} className="flex items-baseline justify-between gap-4">
                  <Link href={`/painel/artigos/${a.slug}`} className="font-serif text-ink hover:text-lacre">
                    {a.titulo}
                  </Link>
                  <span className="meta shrink-0 text-chumbo-lt">
                    {a.publicado ? formatarData(a.data) : "Rascunho"}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
