-- Campos específicos para destinos da categoria "Patrimônios Culturais":
-- categoria de proteção, ano de reconhecimento, esfera de proteção e link
-- para o estudo/dossiê. Nullable porque só se aplicam a essa tipologia —
-- Museus e Lugares ficam com esses campos vazios.
--
-- Idempotente (IF NOT EXISTS / checagem em pg_constraint) porque a primeira
-- tentativa de rodar isso no SQL Editor do Supabase já criou as colunas
-- antes de falhar — essa versão pode ser executada de novo sem erro.

alter table public.destinos
  add column if not exists categoria_protecao text,
  add column if not exists ano_reconhecimento integer,
  add column if not exists esfera_protecao text,
  add column if not exists link_dossie text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'destinos_categoria_protecao_check'
  ) then
    alter table public.destinos
      add constraint destinos_categoria_protecao_check
        check (categoria_protecao is null or categoria_protecao in ('Inventário', 'Tombamento', 'Registro'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'destinos_esfera_protecao_check'
  ) then
    alter table public.destinos
      add constraint destinos_esfera_protecao_check
        check (esfera_protecao is null or esfera_protecao in ('Municipal', 'Estadual', 'Federal'));
  end if;
end $$;

comment on column public.destinos.categoria_protecao is 'Categoria de proteção do patrimônio cultural: Inventário, Tombamento ou Registro.';
comment on column public.destinos.ano_reconhecimento is 'Ano de reconhecimento/proteção do bem.';
comment on column public.destinos.esfera_protecao is 'Esfera responsável pela proteção: Municipal, Estadual ou Federal.';
comment on column public.destinos.link_dossie is 'Link para o estudo ou dossiê técnico relacionado ao bem.';
