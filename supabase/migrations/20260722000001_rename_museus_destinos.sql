-- Renomeia "museus" para "destinos": a categoria deixa de ser só museus e
-- passa a caber patrimônio cultural e outros lugares (campo `tipologia`,
-- já texto livre, sem constraint — só padroniza pra "Museu" / "Patrimônio
-- Cultural" / "Lugar" na UI do painel, sem mudança de schema aqui).

alter table public.museus rename to destinos;
alter table public.museu_artigos rename to destino_artigos;
alter table public.destino_artigos rename column museu_id to destino_id;

alter index museus_cidade_idx rename to destinos_cidade_idx;
alter index museus_tipologia_idx rename to destinos_tipologia_idx;
alter index museu_artigos_museu_id_idx rename to destino_artigos_destino_id_idx;
alter index museu_artigos_artigo_slug_idx rename to destino_artigos_artigo_slug_idx;

comment on table public.destinos is
  'Catálogo de destinos (museus, patrimônio cultural, lugares — Fase 4, renomeado de "museus"). Camada 1: dados práticos. O site oficial é a fonte definitiva — data_verificacao precisa ser exibida sempre.';

comment on table public.destino_artigos is
  'Vínculo destino <-> artigo (Atlas, camada 3). Artigos vivem em MDX/Git, não no Supabase — o vínculo é pelo slug.';
