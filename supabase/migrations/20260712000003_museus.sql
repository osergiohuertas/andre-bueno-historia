create table public.museus (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null,
  cidade text not null,
  endereco text not null,
  coordenadas jsonb not null,
  horario text not null,
  ingresso text not null,
  telefone text,
  site text,
  foto text,
  tipologia text not null,
  data_verificacao date not null,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.museus is
  'Catálogo de museus (Fase 4). Camada 1 apenas: dados práticos. O site oficial do museu é a fonte definitiva — data_verificacao precisa ser exibida sempre.';

create index museus_cidade_idx on public.museus (cidade);
create index museus_tipologia_idx on public.museus (tipologia);

create trigger set_updated_at
  before update on public.museus
  for each row execute function public.set_updated_at();

alter table public.museus enable row level security;

create policy "Leitura pública de museus publicados"
  on public.museus for select
  to anon, authenticated
  using (publicado = true);
