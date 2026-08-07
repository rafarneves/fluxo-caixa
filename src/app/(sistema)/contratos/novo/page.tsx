"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { criarContrato } from "@/actions/contratos";
import Link from "next/link";
import { FilePlus } from "lucide-react";
import { useRouter } from "next/navigation";



export default function NovoContratoPage(){


  const router = useRouter();


  const [clientes,setClientes] = useState<any[]>([]);


  const [mensagem,setMensagem] = useState("");

  const [criando,setCriando] = useState(false);



  useEffect(()=>{


    async function carregarClientes(){


      const { data } =
        await supabase
          .from("clientes")
          .select(`
            id,
            nome
          `)
          .order(
            "nome",
            {
              ascending:true
            }
          );


      setClientes(
        data ?? []
      );


    }


    carregarClientes();


  },[]);







  async function enviarContrato(
    formData:FormData
  ){


    setCriando(true);



    const resultado =
      await criarContrato(
        formData
      );




    if(resultado?.success){


      setMensagem(
        "Contrato criado com sucesso! Recebimento gerado."
      );



      setTimeout(()=>{


        router.push(
          `/contratos/${resultado.contratoId}`
        );


        router.refresh();



      },2000);



    }



  }







return (

<main className="space-y-8">






<div>


<p className="
text-xs
font-semibold
uppercase
tracking-[0.22em]
text-zinc-500
">
CONTRATOS
</p>



<h1 className="
mt-3
text-5xl
font-bold
text-white
">
Novo Contrato
</h1>



<p className="
mt-3
text-lg
text-zinc-400
">
Crie um contrato e gere automaticamente o recebimento inicial.
</p>



</div>









{
mensagem &&

<div className="
rounded-2xl
border
border-green-500/30
bg-green-500/10
p-5
text-green-400
font-semibold
">

✓ {mensagem}

</div>

}








<form

action={enviarContrato}

className="
max-w-5xl
rounded-3xl
border
border-zinc-800
bg-gradient-to-b
from-[#171F2B]
to-[#111827]
p-8
space-y-8
"

>







<div className="
flex
items-center
gap-4
pb-6
border-b
border-zinc-800
">


<div className="
flex
h-12
w-12
items-center
justify-center
rounded-2xl
bg-green-500/10
text-green-400
">

<FilePlus size={24}/>

</div>



<div>

<h2 className="
text-xl
font-bold
">
Informações do Contrato
</h2>


<p className="
text-sm
text-zinc-500
">
Vincule o contrato ao cliente.
</p>


</div>


</div>









<div>


<label className="text-sm text-zinc-400">
Cliente
</label>



<select

name="cliente_id"

required

className="
mt-2
w-full
bg-[#0B0F14]
border
border-zinc-800
rounded-xl
p-4
"

>


<option value="">
Selecione o cliente
</option>



{
clientes.map(
(cliente)=>(


<option

key={cliente.id}

value={cliente.id}

>

{cliente.nome}

</option>


)
)
}



</select>


</div>









<div className="
grid
md:grid-cols-2
gap-6
">


<div>


<label className="text-sm text-zinc-400">
Nome do contrato
</label>


<input

name="nome"

required

placeholder="Plano Performance"

className="
mt-2
w-full
bg-[#0B0F14]
border
border-zinc-800
rounded-xl
p-4
"

/>


</div>





<div>


<label className="text-sm text-zinc-400">
Valor mensal
</label>


<input

name="valor"

type="number"

step="0.01"

required

placeholder="2500"

className="
mt-2
w-full
bg-[#0B0F14]
border
border-zinc-800
rounded-xl
p-4
"

/>


</div>



</div>








<div className="
grid
md:grid-cols-3
gap-6
">


<div>

<label className="text-sm text-zinc-400">
Dia vencimento
</label>


<input

name="vencimento"

type="number"

min="1"

max="31"

required

placeholder="10"

className="
mt-2
w-full
bg-[#0B0F14]
border
border-zinc-800
rounded-xl
p-4
"

/>

</div>





<div>

<label className="text-sm text-zinc-400">
Recorrência
</label>


<select

name="recorrencia"

className="
mt-2
w-full
bg-[#0B0F14]
border
border-zinc-800
rounded-xl
p-4
"

>

<option value="Mensal">
Mensal
</option>

<option value="Trimestral">
Trimestral
</option>

<option value="Anual">
Anual
</option>


</select>


</div>





<div>

<label className="text-sm text-zinc-400">
Data início
</label>


<input

name="data_inicio"

type="date"

required

className="
mt-2
w-full
bg-[#0B0F14]
border
border-zinc-800
rounded-xl
p-4
"

/>


</div>


</div>









<div>

<label className="text-sm text-zinc-400">
Descrição
</label>


<textarea

name="descricao"

rows={5}

placeholder="Detalhes do contrato..."

className="
mt-2
w-full
bg-[#0B0F14]
border
border-zinc-800
rounded-xl
p-4
"

/>


</div>








<div className="
flex
gap-4
">


<button

disabled={criando}

className="
bg-green-500
hover:bg-green-400
disabled:opacity-50
text-black
px-8
py-4
rounded-xl
font-bold
transition
"

>


{
criando
?
"Criando..."
:
"Criar Contrato"
}


</button>





<Link

href="/contratos"

className="
bg-zinc-800
px-8
py-4
rounded-xl
font-bold
"

>

Cancelar

</Link>



</div>







</form>







</main>

);


}