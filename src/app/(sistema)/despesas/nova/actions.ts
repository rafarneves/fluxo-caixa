"use server";

import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function criarDespesa(
  formData: FormData
) {
  const tipo = formData.get("tipo");

  const { error } = await supabase
    .from("despesas")
    .insert({
      descricao: formData.get("descricao"),

      categoria: formData.get("categoria"),

      // Sempre operacional (o usuário não precisa escolher)
      tipo_dre: "Operacional",

      tipo,

      valor: Number(formData.get("valor")),

      data:
        tipo === "Variável"
          ? formData.get("data")
          : null,

      dia_vencimento:
        tipo === "Fixa"
          ? Number(formData.get("dia_vencimento"))
          : null,

      status: "Pago",
    });

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  redirect("/despesas");
}