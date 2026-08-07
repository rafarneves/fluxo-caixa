"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { UserPlus } from "lucide-react";



function mascaraTelefone(valor:string){

  const numeros =
    valor.replace(/\D/g,"");


  if(numeros.length <= 10){

    return numeros
      .replace(/^(\d{2})(\d)/,"($1) $2")
      .replace(/(\d{4})(\d)/,"$1-$2");

  }


  return numeros
    .replace(/^(\d{2})(\d)/,"($1) $2")
    .replace(/(\d{5})(\d)/,"$1-$2");

}





function mascaraCep(valor:string){

  return valor
    .replace(/\D/g,"")
    .replace(/^(\d{5})(\d)/,"$1-$2");

}





export default function NovoClientePage(){


  const router = useRouter();



  const [nome,setNome] = useState("");

  const [telefone,setTelefone] = useState("");

  const [cep,setCep] = useState("");

  const [rua,setRua] = useState("");

  const [numero,setNumero] = useState("");

  const [bairro,setBairro] = useState("");

  const [cidade,setCidade] = useState("");

  const [estado,setEstado] = useState("");






  async function buscarCep(valor:string){


    const cepLimpo =
      valor.replace(/\D/g,"");



    if(cepLimpo.length !== 8){

      return;

    }




    try{


      const resposta =
        await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`
        );



      const dados =
        await resposta.json();





      if(dados.erro){

        alert(
          "CEP não encontrado."
        );

        return;

      }





      setRua(
        dados.logradouro || ""
      );


      setBairro(
        dados.bairro || ""
      );


      setCidade(
        dados.localidade || ""
      );


      setEstado(
        dados.uf || ""
      );



    }
    catch{


      alert(
        "Erro ao consultar CEP."
      );


    }


  }








  async function salvarCliente(){



    const telefoneLimpo =
      telefone.replace(/\D/g,"");



    const cepLimpo =
      cep.replace(/\D/g,"");





    if(nome.trim().length < 3){

      alert(
        "Informe um nome válido."
      );

      return;

    }





    if(telefoneLimpo.length !== 11){

      alert(
        "Informe um telefone válido com DDD."
      );

      return;

    }





    if(cepLimpo.length !== 8){

      alert(
        "Informe um CEP válido."
      );

      return;

    }





    if(cidade.trim().length < 2){

      alert(
        "Busque um CEP válido antes de salvar."
      );

      return;

    }







    const { error } =
      await supabase
        .from("clientes")
        .insert({

          nome,

          telefone:
            telefoneLimpo,

          cep:
            cepLimpo,

          rua,

          numero,

          bairro,

          cidade,

          estado,

          status:"Ativo"

        });






    if(error){

      alert(
        error.message
      );

      return;

    }





    router.push("/clientes");

    router.refresh();



  }







return (

<main className="space-y-8">



<div>


<p className="
text-xs
font-semibold
uppercase
tracking-[0.20em]
text-zinc-500
">
CLIENTES
</p>



<h1 className="
mt-3
text-5xl
font-bold
text-white
">
Novo Cliente
</h1>



<p className="
text-zinc-400
mt-2
">
Cadastro de novo cliente.
</p>



</div>







<div className="
max-w-3xl
rounded-3xl
border
border-zinc-800
bg-gradient-to-b
from-[#171F2B]
to-[#111827]
p-8
">





<div className="
flex
items-center
gap-3
mb-8
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

<UserPlus size={22}/>

</div>



<div>

<h2 className="text-xl font-bold">
Informações do Cliente
</h2>


<p className="text-sm text-zinc-500">
Preencha os dados principais.
</p>


</div>


</div>







<div className="space-y-6">





<div>

<label className="text-sm text-zinc-400">
Nome
</label>


<input

value={nome}

onChange={(e)=>setNome(e.target.value)}

placeholder="Nome do cliente"

className="
mt-2
w-full
bg-[#0B0F14]
border
border-zinc-800
rounded-xl
p-4
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

value={telefone}

onChange={(e)=>
setTelefone(
mascaraTelefone(
e.target.value
)
)
}

placeholder="(41) 99999-9999"

maxLength={15}

className="
mt-2
w-full
bg-[#0B0F14]
border
border-zinc-800
rounded-xl
p-4
outline-none
focus:border-green-500
"

/>


</div>








<div>

<label className="text-sm text-zinc-400">
CEP
</label>


<input

value={cep}

onChange={(e)=>{

const valor =
mascaraCep(
e.target.value
);

setCep(valor);

buscarCep(valor);

}}

placeholder="00000-000"

maxLength={9}

className="
mt-2
w-full
bg-[#0B0F14]
border
border-zinc-800
rounded-xl
p-4
outline-none
focus:border-green-500
"

/>


</div>







<div className="
grid
grid-cols-1
md:grid-cols-2
gap-6
">


<div>

<label className="text-sm text-zinc-400">
Rua
</label>


<input

value={rua}

readOnly

className="
mt-2
w-full
bg-zinc-900
border
border-zinc-800
rounded-xl
p-4
text-zinc-500
"

/>


</div>




<div>

<label className="text-sm text-zinc-400">
Número
</label>


<input

value={numero}

onChange={(e)=>setNumero(e.target.value)}

placeholder="Número"

className="
mt-2
w-full
bg-[#0B0F14]
border
border-zinc-800
rounded-xl
p-4
outline-none
focus:border-green-500
"

/>


</div>


</div>







<div className="
grid
grid-cols-1
md:grid-cols-3
gap-6
">



<div>

<label className="text-sm text-zinc-400">
Bairro
</label>


<input

value={bairro}

readOnly

className="
mt-2
w-full
bg-zinc-900
border
border-zinc-800
rounded-xl
p-4
text-zinc-500
"

/>


</div>





<div>

<label className="text-sm text-zinc-400">
Cidade
</label>


<input

value={cidade}

readOnly

className="
mt-2
w-full
bg-zinc-900
border
border-zinc-800
rounded-xl
p-4
text-zinc-500
"

/>


</div>





<div>

<label className="text-sm text-zinc-400">
Estado
</label>


<input

value={estado}

readOnly

className="
mt-2
w-full
bg-zinc-900
border
border-zinc-800
rounded-xl
p-4
text-zinc-500
"

/>


</div>



</div>








<button

onClick={salvarCliente}

className="
inline-flex
items-center
gap-2
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

<UserPlus size={20}/>

Salvar Cliente

</button>







</div>





</div>





</main>

);


}