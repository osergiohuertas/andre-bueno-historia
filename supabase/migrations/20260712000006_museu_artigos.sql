create table public.museu_artigos (
  id uuid primary key default gen_random_uuid(),
  museu_id uuid not null references public.museus (id) on delete cascade,
  -- Artigos vivem em MDX/Git, não no Supabase — o vínculo é pelo slug.
  artigo_slug text not null,
  created_at timestamptz not null default now(),
  unique (museu_id, artigo_slug)
);

comment on table public.museu_artigos is
  'Vínculo museu <-> artigo (Fase 4/Atlas, camada 3 do museu — só libera na Fase 5). Infraestrutura criada agora, sem página pública ainda: RLS ligado, sem policy de leitura pública.';

create index museu_artigos_museu_id_idx on public.museu_artigos (museu_id);
create index museu_artigos_artigo_slug_idx on public.museu_artigos (artigo_slug);

alter table public.museu_artigos enable row level security;

-- Nenhuma policy de SELECT pública ainda: só service role acessa,
-- até a camada 3 dos museus ser liberada na Fase 5.
