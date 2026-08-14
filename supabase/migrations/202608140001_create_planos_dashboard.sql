begin;

-- Catálogo de planos.
create table if not exists public.planos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  ativo boolean not null default true,
  ordem smallint not null default 0,
  criado_em timestamptz not null default now()
);

insert into public.planos (nome, slug, ordem)
values
  ('Plano Performance', 'performance', 10),
  ('Alta Performance', 'alta-performance', 20),
  ('Plano PRO', 'pro', 30),
  ('Personalizado', 'personalizado', 40),
  ('Outros', 'outros', 50)
on conflict (slug) do update
set
  nome = excluded.nome,
  ordem = excluded.ordem;

-- Relaciona cada contrato a um plano.
alter table public.contratos
add column if not exists plano_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'contratos_plano_id_fkey'
      and conrelid = 'public.contratos'::regclass
  ) then
    alter table public.contratos
    add constraint contratos_plano_id_fkey
    foreign key (plano_id)
    references public.planos(id)
    on delete restrict;
  end if;
end;
$$;

-- Migra os contratos com nomes de planos conhecidos.
update public.contratos as c
set plano_id = p.id
from public.planos as p
where c.plano_id is null
  and p.slug = case
    regexp_replace(
      lower(trim(coalesce(c.nome, ''))),
      '^plano[[:space:]]+',
      ''
    )
    when 'performance' then 'performance'
    when 'alta performance' then 'alta-performance'
    when 'pro' then 'pro'
    when 'personalizado' then 'personalizado'
    else null
  end;

-- Mantém contratos fora do catálogo visíveis na distribuição.
update public.contratos as c
set plano_id = p.id
from public.planos as p
where c.plano_id is null
  and p.slug = 'outros';

alter table public.contratos
alter column plano_id set not null;

create index if not exists contratos_status_plano_id_idx
on public.contratos (status, plano_id);

-- Protege a nova tabela com a mesma regra administrativa do restante do sistema.
alter table public.planos enable row level security;

revoke all on table public.planos from anon;
grant select, insert, update, delete on table public.planos to authenticated;

drop policy if exists "Acesso administrativo autenticado" on public.planos;
create policy "Acesso administrativo autenticado"
on public.planos
for all
to authenticated
using (
  exists (
    select 1
    from public.configuracoes c
    where c.usuario_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.configuracoes c
    where c.usuario_id = (select auth.uid())
  )
);

-- Entrega ao dashboard a distribuição de contratos ativos já agregada.
create or replace function public.dashboard_distribuicao_planos()
returns table (
  plano_id uuid,
  slug text,
  nome text,
  total bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    p.id,
    p.slug,
    p.nome,
    count(c.id)::bigint
  from public.planos p
  left join public.contratos c
    on c.plano_id = p.id
   and c.status = 'Ativo'
  where p.ativo = true
  group by p.id, p.slug, p.nome, p.ordem
  order by p.ordem;
$$;

revoke execute on function public.dashboard_distribuicao_planos() from public, anon;
grant execute on function public.dashboard_distribuicao_planos() to authenticated;

commit;
