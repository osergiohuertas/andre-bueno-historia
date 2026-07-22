create table public.eventos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  descricao text not null,
  data_inicio timestamptz not null,
  data_fim timestamptz not null,
  natureza text not null check (natureza in ('cultural', 'academico')),
  participacao text not null check (participacao in ('curadoria', 'com_andre')),
  local text not null,
  cidade text not null,
  endereco text,
  coordenadas jsonb,
  organizador text not null,
  link_inscricao text,
  imagem_capa text,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.eventos is
  'Eventos da agenda (Fase 3). Cruzamento de dois eixos independentes: natureza (cultural|academico) e participacao (curadoria|com_andre). Transição futuro->arquivo é derivada de data_fim, sem edição manual.';

create index eventos_data_fim_idx on public.eventos (data_fim);
create index eventos_natureza_idx on public.eventos (natureza);
create index eventos_participacao_idx on public.eventos (participacao);

create trigger set_updated_at
  before update on public.eventos
  for each row execute function public.set_updated_at();

alter table public.eventos enable row level security;

create policy "Leitura pública de eventos publicados"
  on public.eventos for select
  to anon, authenticated
  using (publicado = true);
