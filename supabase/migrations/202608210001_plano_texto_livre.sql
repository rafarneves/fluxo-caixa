begin;

-- O plano passa a ser texto livre digitado no contrato (coluna contratos.nome).
-- A tabela planos deixa de ser obrigatoria, entao plano_id vira opcional.
alter table public.contratos
alter column plano_id drop not null;

drop index if exists public.contratos_status_plano_id_idx;

create index if not exists contratos_status_nome_idx
on public.contratos (status, nome);

-- A distribuicao do dashboard passa a agrupar pelo texto livre do plano.
drop function if exists public.dashboard_distribuicao_planos();

create or replace function public.dashboard_distribuicao_planos()
returns table (
  plano_id text,
  slug text,
  nome text,
  total bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  with contratos_ativos as (
    select coalesce(nullif(trim(c.nome), ''), 'Sem plano') as nome
    from public.contratos c
    where c.status = 'Ativo'
  )
  select
    a.nome as plano_id,
    -- Slug sem acento e sem o prefixo "plano ", usado so para colorir o card.
    trim(
      both '-' from regexp_replace(
        regexp_replace(
          lower(
            translate(
              a.nome,
              'áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ',
              'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC'
            )
          ),
          '^plano[[:space:]]+',
          ''
        ),
        '[^a-z0-9]+',
        '-',
        'g'
      )
    ) as slug,
    a.nome,
    count(*)::bigint as total
  from contratos_ativos a
  group by a.nome
  order by total desc, a.nome;
$$;

revoke execute on function public.dashboard_distribuicao_planos() from public, anon;
grant execute on function public.dashboard_distribuicao_planos() to authenticated;

commit;
