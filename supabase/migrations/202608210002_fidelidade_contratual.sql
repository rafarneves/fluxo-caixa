begin;

-- A recorrencia (Mensal/Trimestral/Anual) da lugar a fidelidade contratual em meses.
alter table public.contratos
add column if not exists fidelidade_meses smallint;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'contratos_fidelidade_meses_check'
      and conrelid = 'public.contratos'::regclass
  ) then
    alter table public.contratos
    add constraint contratos_fidelidade_meses_check
    check (fidelidade_meses is null or fidelidade_meses between 1 and 24);
  end if;
end;
$$;

-- Converte os contratos existentes: a antiga recorrencia vira um periodo em meses.
update public.contratos
set fidelidade_meses = case recorrencia
  when 'Trimestral' then 3
  when 'Anual' then 12
  else 12
end
where fidelidade_meses is null;

-- A coluna recorrencia deixa de ser preenchida pelo sistema; fica so como historico.
alter table public.contratos
alter column recorrencia drop not null;

commit;
