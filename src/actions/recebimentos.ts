"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function receberRecebimento(id: string) {
  const hoje = new Date().toISOString();

  const { data: recebimento, error } = await supabase
    .from("recebimentos")
    .select(
      `
      *,
      contratos (
        id,
        cliente_id,
        clientes (
          id,
          nome
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !recebimento) return;

  await supabase
    .from("recebimentos")
    .update({
      status: "Pago",
      data_pagamento: hoje,
    })
    .eq("id", id);

  await supabase.from("fluxo_caixa").insert({
    descricao: `Recebimento - ${recebimento.contratos.clientes.nome}`,
    tipo: "Entrada",
    valor: recebimento.valor,
    cliente_id: recebimento.contratos.clientes.id,
  });

  revalidatePath("/contas-receber");
  revalidatePath("/fluxo-caixa");
  revalidatePath("/dashboard");
}

export async function criarRecebimento({
  contrato_id,
  competencia,
  valor,
  vencimento,
}: {
  contrato_id: string;
  competencia: string;
  valor: number;
  vencimento: string;
}) {
  await supabase.from("recebimentos").insert({
    contrato_id,
    competencia,
    valor,
    vencimento,
    status: "Pendente",
  });

  revalidatePath("/contas-receber");
}
