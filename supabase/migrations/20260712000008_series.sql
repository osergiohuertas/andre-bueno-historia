create table public.series (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  numero text not null,
  nome text not null,
  descricao text,
  total_partes integer,
  publicado boolean not null default false,
  ordem integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.series is
  'Séries editoriais (Fase 1D). Migrado para o Supabase porque o André cria série nova sem poder depender de commit. O artigo continua em MDX e referencia a série pelo campo `serie` = slug desta tabela.';

create index series_publicado_idx on public.series (publicado);
create index series_ordem_idx on public.series (ordem);

create trigger set_updated_at
  before update on public.series
  for each row execute function public.set_updated_at();

alter table public.series enable row level security;

create policy "Leitura pública de séries publicadas"
  on public.series for select
  to anon
  using (publicado = true);

-- FOR ALL cobre select/insert/update/delete para o André autenticado,
-- inclusive séries ainda não publicadas (ele precisa vê-las no painel).
create policy "André gerencia séries"
  on public.series for all
  to authenticated
  using (true)
  with check (true);
