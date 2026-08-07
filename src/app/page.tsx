import { supabase } from "@/lib/supabase";


export default async function DashboardPage() {


  const { data: contratos } = await supabase
    .from("contratos")
    .select("*");


  const { data: recebimentos } = await supabase
    .from("recebimentos")
    .select("*");


  const { data: clientes } = await supabase
    .from("clientes")
    .select("*");



  const contratosAtivos =
    contratos?.filter(
      (c:any)=>c.status==="Ativo"
    ).length ?? 0;



  const clientesAtivos =
    clientes?.filter(
      (c:any)=>c.status==="Ativo"
    ).length ?? 0;



  const faturamentoMensal =
    contratos
    ?.filter(
      (c:any)=>c.status==="Ativo"
    )
    .reduce(
      (total:number,c:any)=>
        total + Number(c.valor),
      0
    ) ?? 0;



  const recebido =
    recebimentos
    ?.filter(
      (r:any)=>r.data_pagamento
    )
    .reduce(
      (total:number,r:any)=>
        total + Number(r.valor),
      0
    ) ?? 0;



  const pendente =
    recebimentos
    ?.filter(
      (r:any)=>!r.data_pagamento
    )
    .reduce(
      (total:number,r:any)=>
        total + Number(r.valor),
      0
    ) ?? 0;




  return (

<div>


<h1 className="text-5xl font-bold text-green-400">
Dashboard
</h1>


<p className="text-zinc-400 mt-2 mb-10">
Visão geral do negócio.
</p>




<div className="grid grid-cols-4 gap-5">



<div className="bg-[#161B22] rounded-2xl p-6">

<p className="text-zinc-400">
Clientes Ativos
</p>

<h2 className="text-4xl font-bold mt-3">
{clientesAtivos}
</h2>

</div>





<div className="bg-[#161B22] rounded-2xl p-6">

<p className="text-zinc-400">
Contratos Ativos
</p>

<h2 className="text-4xl font-bold mt-3 text-green-400">
{contratosAtivos}
</h2>

</div>





<div className="bg-[#161B22] rounded-2xl p-6">

<p className="text-zinc-400">
Faturamento Mensal
</p>

<h2 className="text-3xl font-bold mt-3 text-yellow-400">

{faturamentoMensal.toLocaleString(
"pt-BR",
{
style:"currency",
currency:"BRL"
}
)}

</h2>

</div>





<div className="bg-[#161B22] rounded-2xl p-6">

<p className="text-zinc-400">
Em Aberto
</p>

<h2 className="text-3xl font-bold mt-3 text-blue-400">

{pendente.toLocaleString(
"pt-BR",
{
style:"currency",
currency:"BRL"
}
)}

</h2>

</div>



</div>





<div className="grid grid-cols-2 gap-5 mt-8">



<div className="bg-[#161B22] rounded-2xl p-6">

<p className="text-zinc-400">
Recebido
</p>


<h2 className="text-4xl font-bold text-green-400 mt-3">

{recebido.toLocaleString(
"pt-BR",
{
style:"currency",
currency:"BRL"
}
)}

</h2>


</div>





<div className="bg-[#161B22] rounded-2xl p-6">

<p className="text-zinc-400">
Indicador financeiro
</p>


<h2 className="text-4xl font-bold mt-3">

Saúde do negócio

</h2>


</div>



</div>




</div>

  );

}