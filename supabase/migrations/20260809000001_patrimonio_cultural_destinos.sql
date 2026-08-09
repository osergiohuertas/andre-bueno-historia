-- Campos específicos para destinos da categoria "Patrimônios Culturais":
-- categoria de proteção, ano de reconhecimento, esfera de proteção e link
-- para o estudo/dossiê. Nullable porque só se aplicam a essa tipologia —
-- Museus e Lugares ficam com esses campos vazios.

alter table public.destinos
  add column categoria_protecao text,
  add column ano_reconhecimento integer,
  add column esfera_protecao text,
  add column link_dossie text;

alter table public.destinos
  add constraint destinos_categoria_protecao_check
    check (categoria_protecao is null or categoria_protecao in ('Inventário', 'Tombamento', 'Registro'));

alter table public.destinos
  add constraint destinos_esfera_protecao_check
    check (esfera_protecao is null or esfera_protecao in ('Municipal', 'Estadual', 'Federal'));

comment on column public.destinos.categoria_protecao is 'Categoria de proteção do patrimônio cultural: Inventário, Tombamento ou Registro.';
comment on column public.destinos.ano_reconhecimento is 'Ano de reconhecimento/proteção do bem.';
comment on column public.destinos.esfera_protecao is 'Esfera responsável pela proteção: Municipal, Estadual ou Federal.';
comment on column public.destinos.link_dossie is 'Link para o estudo ou dossiê técnico relacionado ao bem.';
