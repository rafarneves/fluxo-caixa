create table if not exists public.configuracoes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null unique references auth.users(id) on delete cascade,
  empresa text not null default 'Altuza',
  email text,
  telefone text,
  moeda text not null default 'BRL' check (moeda in ('BRL', 'USD', 'EUR')),
  fuso_horario text not null default 'America/Sao_Paulo',
  notificacoes_vencimento boolean not null default true,
  resumo_semanal boolean not null default true,
  alertas_financeiros boolean not null default true,
  interface_compacta boolean not null default false,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create or replace function public.definir_atualizado_em()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists configuracoes_definir_atualizado_em on public.configuracoes;
create trigger configuracoes_definir_atualizado_em
before update on public.configuracoes
for each row
execute function public.definir_atualizado_em();

alter table public.configuracoes enable row level security;

revoke all on table public.configuracoes from anon;
grant select, insert, update on table public.configuracoes to authenticated;

drop policy if exists "Usuário consulta suas configurações" on public.configuracoes;
create policy "Usuário consulta suas configurações"
on public.configuracoes
for select
to authenticated
using ((select auth.uid()) = usuario_id);

drop policy if exists "Usuário cria suas configurações" on public.configuracoes;
create policy "Usuário cria suas configurações"
on public.configuracoes
for insert
to authenticated
with check ((select auth.uid()) = usuario_id);

drop policy if exists "Usuário atualiza suas configurações" on public.configuracoes;
create policy "Usuário atualiza suas configurações"
on public.configuracoes
for update
to authenticated
using ((select auth.uid()) = usuario_id)
with check ((select auth.uid()) = usuario_id);
