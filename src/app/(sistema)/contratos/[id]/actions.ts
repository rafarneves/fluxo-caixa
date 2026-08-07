"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function adicionarCustoContrato(
  contrato_id: string,
  formData: FormData
) {
  const categoria = String(
    formData.get("categoria") || ""
  );

  const descricao = String(
    formData.get("descricao") || ""
  );

  const valor = Number(
    formData.get("valor") || 0
  );

  const competencia = String(
    formData.get("competencia") || ""
  );

  const recorrente =
    formData.get("recorrente") === "on";

  const observacao = String(
    formData.get("observacao") || ""
  );

  const { error } = await supabase
    .from("custos_contrato")
    .insert({
      contrato_id,
      categoria,
      descricao,
      valor,
      competencia,
      recorrente,
      observacao,
    });

  if (error) {
    console.log(error);

    throw new Error(
      JSON.stringify(error)
    );
  }

  revalidatePath(`/contratos/${contrato_id}`);
}