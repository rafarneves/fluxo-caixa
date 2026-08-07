-- Grants concedidos diretamente ao papel anon nas tabelas públicas.
select
  table_name,
  privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee = 'anon'
order by table_name, privilege_type;

-- Políticas aplicáveis diretamente a anon ou a public (que também inclui anon).
select
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and (roles @> array['anon']::name[] or roles @> array['public']::name[])
order by tablename, policyname;

-- Confirma se RLS está habilitado em todas as tabelas públicas.
select
  c.relname as tabela,
  c.relrowsecurity as rls_habilitado,
  c.relforcerowsecurity as rls_forcado
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
order by c.relname;
