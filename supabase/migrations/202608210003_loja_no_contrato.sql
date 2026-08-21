begin;

-- A loja passa a ser cadastrada no contrato, e nao mais no cliente.
alter table public.contratos
add column if not exists loja text;

-- Herda a loja que ja estava no cadastro do cliente.
update public.contratos as c
set loja = cl.loja
from public.clientes as cl
where c.cliente_id = cl.id
  and c.loja is null
  and nullif(trim(cl.loja), '') is not null;

create index if not exists contratos_loja_idx
on public.contratos (loja);

-- A coluna clientes.loja deixa de ser preenchida pelo sistema; fica so como historico.
alter table public.clientes
alter column loja drop not null;

commit;
