"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function pagarConta(
  id: string,
  descricao: string,
  valor: number
) {
  // Marca a conta como paga
  const { error } = await supabase
    .from("contas_pagar")
    .update({
      status: "Pago",
    })
    .eq("id", id);

  if (error) {
    return;
  }

  // Lança uma saída no fluxo de caixa
  const { error: erroFluxo } = await supabase
    .from("fluxo_caixa")
    .insert({
      descricao: `Pagamento - ${descricao}`,
      tipo: "Saída",
      valor: valor,
    });

  if (erroFluxo) {
    return;
  }

  // Atualiza as páginas
  revalidatePath("/dashboard");
  revalidatePath("/fluxo-caixa");
  revalidatePath("/contas-pagar");
}
