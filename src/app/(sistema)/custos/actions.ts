"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function criarCusto(
  formData: FormData
) {
  const contrato_id = String(
    formData.get("contrato_id")
  );

  const descricao = String(
    formData.get("descricao") || ""
  );

  const valor = Number(
    formData.get("valor") || 0
  );

  // Apenas Tráfego é considerado mídia.
  const tipo =
    descricao === "Tráfego Pago"
      ? "Mídia"
      : "Operacional";

  const { error } = await supabase
    .from("custos_contrato")
    .insert({
      contrato_id,
      descricao,
      valor,

      // Campos automáticos
      tipo,
      recorrente: true,

      // Obrigatórios na tabela
      categoria: descricao,
      competencia: "",
      observacao: "",
    });

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  revalidatePath("/custos");
  revalidatePath("/rentabilidade");
}

export async function removerCusto(
  id: string
) {
  const { error } = await supabase
    .from("custos_contrato")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  revalidatePath("/custos");
  revalidatePath("/rentabilidade");
}

export async function alternarStatus() {
  return;
}
