"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";


export async function marcarComoPago(
  id:string
){


  await supabase
    .from("recebimentos")
    .update({

      status:"Pago",

      data_pagamento:
        new Date()
        .toISOString()
        .split("T")[0],

      valor_recebido:
        null

    })
    .eq(
      "id",
      id
    );



  revalidatePath("/recebimentos");


}