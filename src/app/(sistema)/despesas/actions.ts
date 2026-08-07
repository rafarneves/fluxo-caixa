"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";


export async function excluirDespesa(
  id:string
){


  await supabase
    .from("despesas")
    .delete()
    .eq(
      "id",
      id
    );



  revalidatePath("/despesas");


}