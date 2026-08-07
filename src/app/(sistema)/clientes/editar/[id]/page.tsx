"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";


export default function EditarCliente({
  params,
}: {
  params: { id:string };
}) {


  const router = useRouter();


  const [cliente,setCliente] =
    useState<any>(null);



  async function carregarCliente(){


    const { data } =
      await supabase
        .from("clientes")
        .select("*")
        .eq("id",params.id)
        .single();



    setCliente(data);


  }




  if(!cliente){

    carregarCliente();


    return (
      <div className="text-white">
        Carregando...
      </div>
    );

  }







  async function salvar(){


    const { error } =
      await supabase
        .from("clientes")
        .update({

          nome:cliente.nome,

          telefone:
            cliente.telefone,

          cidade:
            cliente.cidade,

        })
        .eq(
          "id",
          params.id
        );




    if(error){

      alert(error.message);

      return;

    }




    router.push("/clientes");

    router.refresh();


  }







return (

<main className="space-y-8">



<div>


<p
className="
text-xs
font-semibold
uppercase
tracking-[0.22em]
text-zinc-500
"
>
CLIENTES
</p>



<h1
className="
mt-3
text-5xl
font-bold
text-white
"
>
Editar Cliente
</h1>



<p
className="
mt-2
text-lg
text-zinc-400
"
>
Altere as informações cadastrais do cliente.
</p>



</div>








<div
className="
max-w-3xl
rounded-3xl
border
border-zinc-800
bg-gradient-to-b
from-[#171F2B]
to-[#111827]
p-8
space-y-6
"
>





<div>


<label className="text-sm text-zinc-400">
Nome
</label>


<input

value={cliente.nome ?? ""}

onChange={(e)=>
setCliente({
...cliente,
nome:e.target.value
})
}

className="
mt-2
w-full
bg-[#0B0F14]
border
border-zinc-800
rounded-xl
p-4
text-white
outline-none
focus:border-green-500
"

/>


</div>








<div>


<label className="text-sm text-zinc-400">
Telefone
</label>


<input

value={cliente.telefone ?? ""}

onChange={(e)=>
setCliente({
...cliente,
telefone:e.target.value
})
}

className="
mt-2
w-full
bg-[#0B0F14]
border
border-zinc-800
rounded-xl
p-4
text-white
outline-none
focus:border-green-500
"

/>


</div>








<div>


<label className="text-sm text-zinc-400">
Cidade
</label>


<input

value={cliente.cidade ?? ""}

onChange={(e)=>
setCliente({
...cliente,
cidade:e.target.value
})
}

className="
mt-2
w-full
bg-[#0B0F14]
border
border-zinc-800
rounded-xl
p-4
text-white
outline-none
focus:border-green-500
"

/>


</div>








<button

onClick={salvar}

className="
mt-4
bg-green-500
hover:bg-green-400
text-black
px-8
py-4
rounded-xl
font-bold
transition
hover:-translate-y-0.5
shadow-lg
shadow-green-500/20
"

>

Salvar Alterações

</button>







</div>





</main>

);


}