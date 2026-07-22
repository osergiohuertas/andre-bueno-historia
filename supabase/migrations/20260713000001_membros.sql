-- Fase 5 — Comunidade. Leitor público, distinto do André: todo leitor tem
-- uma linha aqui; o André (conta única de operador, criada fora deste
-- fluxo) nunca tem. É essa ausência/presença que o proxy usa pra separar
-- /painel (só André) de /conta (só leitor) — ver lib/supabase/middleware.ts.
create table public.membros (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.membros is
  'Perfil público de leitor (Fase 5). 1:1 com auth.users — on delete cascade apaga o perfil quando a conta é excluída. André nunca tem linha aqui.';

create trigger set_updated_at
  before update on public.membros
  for each row execute function public.set_updated_at();

alter table public.membros enable row level security;

create policy "Leitor vê e edita o próprio perfil"
  on public.membros for all
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Biblioteca pessoal: salvar artigo e marcar como lido. Artigo é MDX/Git,
-- não tem FK — referenciado pelo slug.
create table public.biblioteca_pessoal (
  id uuid primary key default gen_random_uuid(),
  membro_id uuid not null references public.membros (id) on delete cascade,
  artigo_slug text not null,
  salvo boolean not null default false,
  lido boolean not null default false,
  salvo_em timestamptz,
  lido_em timestamptz,
  created_at timestamptz not null default now(),
  unique (membro_id, artigo_slug)
);

comment on table public.biblioteca_pessoal is
  'Biblioteca pessoal do leitor (Fase 5): estado salvo/lido por artigo. artigo_slug referencia o MDX em content/artigos, sem FK.';

create index biblioteca_pessoal_membro_id_idx on public.biblioteca_pessoal (membro_id);

alter table public.biblioteca_pessoal enable row level security;

create policy "Leitor gerencia a própria biblioteca"
  on public.biblioteca_pessoal for all
  to authenticated
  using (membro_id = auth.uid())
  with check (membro_id = auth.uid());

-- Séries seguidas: notificação por e-mail quando sai parte nova
-- (publicarArtigoAction, Fase 2, dispara pra quem segue a série do artigo).
create table public.seguidores_serie (
  id uuid primary key default gen_random_uuid(),
  membro_id uuid not null references public.membros (id) on delete cascade,
  serie_slug text not null,
  created_at timestamptz not null default now(),
  unique (membro_id, serie_slug)
);

comment on table public.seguidores_serie is
  'Quem segue qual série (Fase 5). serie_slug = slug da tabela series. Publicar artigo novo da série dispara e-mail pros seguidores.';

create index seguidores_serie_serie_slug_idx on public.seguidores_serie (serie_slug);

alter table public.seguidores_serie enable row level security;

create policy "Leitor gerencia as próprias séries seguidas"
  on public.seguidores_serie for all
  to authenticated
  using (membro_id = auth.uid())
  with check (membro_id = auth.uid());
