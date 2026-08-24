-- Destinos: um lugar pode ser mais de uma coisa ao mesmo tempo (ex.: um
-- museu que também é patrimônio cultural tombado) — antes `tipologia` só
-- aceitava uma única string, forçando uma escolha artificial.
alter table public.destinos
  add column if not exists tipologias text[];

update public.destinos
  set tipologias = array[tipologia]
  where tipologias is null and tipologia is not null;

update public.destinos
  set tipologias = '{}'
  where tipologias is null;

alter table public.destinos
  alter column tipologias set not null,
  alter column tipologias set default '{}';

alter table public.destinos drop column if exists tipologia;

create index if not exists destinos_tipologias_idx
  on public.destinos using gin (tipologias);

-- Fotos do acervo: local de registro (onde a foto foi tirada), pra poder
-- aparecer como ponto no Atlas junto de artigos e destinos. Nullable —
-- nem toda foto tem (ou precisa de) localização.
alter table public.acervo_midia
  add column if not exists lat double precision,
  add column if not exists lng double precision;

comment on column public.acervo_midia.lat is 'Latitude de onde a foto foi registrada (opcional) — plota a foto no Atlas.';
comment on column public.acervo_midia.lng is 'Longitude de onde a foto foi registrada (opcional) — plota a foto no Atlas.';
