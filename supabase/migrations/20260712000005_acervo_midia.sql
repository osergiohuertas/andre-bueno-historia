create table public.acervo_midia (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('video', 'foto')),
  titulo text not null,
  descricao text,
  categoria text,
  url text not null,
  credito text,
  data date,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.acervo_midia is
  'Vídeos e fotos da obra do autor (Fase 3, /obra/videos e /obra/fotos). Vídeo: url é sempre embed (YouTube/Vimeo), nunca upload. categoria para vídeo: entrevista|congresso|simposio|seminario. credito obrigatório (em app) para foto de terceiro.';

create index acervo_midia_tipo_idx on public.acervo_midia (tipo);
create index acervo_midia_categoria_idx on public.acervo_midia (categoria);

create trigger set_updated_at
  before update on public.acervo_midia
  for each row execute function public.set_updated_at();

alter table public.acervo_midia enable row level security;

create policy "Leitura pública de mídia publicada"
  on public.acervo_midia for select
  to anon, authenticated
  using (publicado = true);
