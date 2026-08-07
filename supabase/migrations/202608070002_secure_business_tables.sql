-- Execute depois da migration de configurações.
-- Remove o acesso anônimo e libera os dados somente para usuários autenticados
-- que possuam uma linha em public.configuracoes.

do $$
declare
  tabela text;
  tabelas text[] := array[
    'clientes',
    'contratos',
    'recebimentos',
    'despesas',
    'custos_contrato',
    'indicacoes',
    'contas_pagar',
    'fluxo_caixa'
  ];
begin
  foreach tabela in array tabelas loop
    if to_regclass(format('public.%I', tabela)) is not null then
      execute format('alter table public.%I enable row level security', tabela);
      execute format('revoke all on table public.%I from anon', tabela);
      execute format(
        'grant select, insert, update, delete on table public.%I to authenticated',
        tabela
      );

      execute format(
        'drop policy if exists "Acesso administrativo autenticado" on public.%I',
        tabela
      );
      execute format(
        'create policy "Acesso administrativo autenticado"
         on public.%I
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
         )',
        tabela
      );
    end if;
  end loop;
end;
$$;
