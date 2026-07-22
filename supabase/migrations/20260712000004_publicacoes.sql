create table public.publicacoes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  tipo text not null check (tipo in ('livro', 'artigo_academico', 'capitulo', 'ensaio')),
  veiculo text not null,
  ano integer not null,
  coautores text,
  link text,
  resumo text,
  capa text,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.publicacoes is
  'Obra do autor (Fase 3). /obra/livros e /obra/publicacoes são a mesma tabela filtrada por tipo — tipo=livro para o primeiro, os demais para o segundo. Não confundir com /livro, que é a vitrine de conversão (dados em site_config, Fase 1D).';

create index publicacoes_tipo_idx on public.publicacoes (tipo);
create index publicacoes_ano_idx on public.publicacoes (ano);

create trigger set_updated_at
  before update on public.publicacoes
  for each row execute function public.set_updated_at();

alter table public.publicacoes enable row level security;

create policy "Leitura pública de publicações publicadas"
  on public.publicacoes for select
  to anon, authenticated
  using (publicado = true);
