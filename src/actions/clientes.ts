"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function inativarCliente(id: string) {
  const { error } = await supabase
    .from("clientes")
    .update({
      status: "Inativo",
    })
    .eq("id", id);

  if (error) {
    return;
  }

  revalidatePath("/clientes");
  revalidatePath("/dashboard");
  revalidatePath("/contas-receber");
}
