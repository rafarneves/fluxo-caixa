import Link from "next/link";
import { supabase } from "@/lib/supabase";
import StatusBadge from "@/components/financeiro/StatusBadge";
import { cancelarContrato } from "@/actions/contratos";
import {
  FileText,
  Wallet,
  XCircle,
  TrendingUp,
} from "lucide-react";



function formatMoney(value:number){

  return value.toLocaleString(
    "pt-BR",
    {
      style:"currency",
      currency:"BRL"
    }
  );

}




function formatCompactMoney(value:number){

  if(value >= 1000){

    return (
      "R$ " +
      (value / 1000)
      .toFixed(1)
      .replace(".", ",")
      +
      "k"
    );

  }


  return formatMoney(value);

}






export default async function ContratosPage(){



  const { data: contratos } = await supabase
    .from("contratos")
    .select(`
      *,
      clientes (
        id,
        nome
      )
    `)
    .order(
      "created_at",
      {
        ascending:false
      }
    );



  const contratosData =
    contratos ?? [];




  const ativos =
    contratosData.filter(
      (contrato:any)=>
        contrato.status==="Ativo"
    ).length;



  const cancelados =
    contratosData.filter(
      (contrato:any)=>
        contrato.status==="Cancelado"
    ).length;




  const receita =
    contratosData
    .filter(
      (contrato:any)=>
        contrato.status==="Ativo"
    )
    .reduce(
      (total:number, contrato:any)=>
        total + Number(contrato.valor),
      0
    );




  const ticket =
    ativos === 0
    ?
    0
    :
    receita / ativos;






return (

<div className="space-y-10">





<div className="flex items-start justify-between">



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
Contratos
</h1>



<p className="
mt-3
text-lg
text-zinc-400
">
Gerencie contratos, valores e recorrências dos clientes.
</p>


</div>






<Link

href="/contratos/novo"

className="
rounded-2xl
bg-green-500
px-6
py-4
font-bold
text-black
transition-all
duration-300
hover:bg-green-400
hover:-translate-y-1
hover:shadow-xl
hover:shadow-green-500/20
"

>

+ Novo Contrato

</Link>



</div>








<div className="
grid
grid-cols-1
md:grid-cols-4
gap-6
">





<CardResumo

titulo="Contratos Ativos"

valor={String(ativos)}

icone={<FileText size={22}/>}

tipo="verde"

/>





<CardResumo

titulo="Receita Contratada"

valor={formatCompactMoney(receita)}

icone={<Wallet size={22}/>}

tipo="verde"

/>





<CardResumo

titulo="Cancelados"

valor={String(cancelados)}

icone={<XCircle size={22}/>}

tipo="vermelho"

/>






<CardResumo

titulo="Ticket Médio"

valor={formatCompactMoney(ticket)}

icone={<TrendingUp size={22}/>}

tipo="azul"

/>





</div>









<div className="
overflow-hidden
rounded-3xl
border
border-zinc-800
bg-gradient-to-b
from-[#171F2B]
to-[#111827]
">





<table className="w-full">



<thead className="bg-black/20">


<tr>


<th className="p-5 text-left text-zinc-400">
Cliente
</th>


<th className="p-5 text-left text-zinc-400">
Plano
</th>


<th className="p-5 text-left text-zinc-400">
Valor
</th>


<th className="p-5 text-left text-zinc-400">
Início
</th>


<th className="p-5 text-left text-zinc-400">
Vencimento
</th>


<th className="p-5 text-left text-zinc-400">
Status
</th>


<th className="p-5 text-right text-zinc-400">
Ações
</th>


</tr>


</thead>






<tbody>



{
contratosData.map((contrato:any)=>(


<tr

key={contrato.id}

className="
border-t
border-zinc-800
hover:bg-black/20
transition
"

>



<td className="p-5">


<Link

href={`/clientes/${contrato.clientes?.id}`}

className="
font-semibold
text-white
hover:text-green-400
"

>

{contrato.clientes?.nome}

</Link>


</td>





<td className="p-5">


<Link

href={`/contratos/${contrato.id}`}

className="
font-semibold
text-white
hover:text-green-400
"

>

{contrato.nome ?? "-"}

</Link>


</td>





<td className="
p-5
font-semibold
text-green-400
">

{
formatMoney(
Number(contrato.valor)
)
}

</td>





<td className="p-5 text-zinc-300">

{
contrato.data_inicio
?
new Date(
contrato.data_inicio
)
.toLocaleDateString(
"pt-BR"
)
:
"-"
}

</td>





<td className="p-5">

Dia {contrato.vencimento}

</td>





<td className="p-5">

<StatusBadge
status={contrato.status}
/>

</td>







<td className="p-5 text-right">


{
contrato.status !== "Cancelado"
&&


<form

action={async()=>{

"use server";

await cancelarContrato(
contrato.id
);

}}

>


<button

className="
bg-red-500
hover:bg-red-400
text-white
px-5
py-2
rounded-xl
font-semibold
transition
hover:-translate-y-0.5
"

>

Cancelar

</button>


</form>

}



</td>





</tr>


))
}



</tbody>





</table>






</div>






</div>

);

}









function CardResumo({

titulo,

valor,

icone,

tipo,

}:{

titulo:string;

valor:string;

icone:React.ReactNode;

tipo:"verde"|"vermelho"|"azul";

}){



const estilos = {

verde:{
borda:"border-green-500/20",
fundo:"bg-green-500/10",
texto:"text-green-400",
numero:"text-green-400"
},


vermelho:{
borda:"border-red-500/20",
fundo:"bg-red-500/10",
texto:"text-red-400",
numero:"text-red-400"
},


azul:{
borda:"border-cyan-500/20",
fundo:"bg-cyan-500/10",
texto:"text-cyan-400",
numero:"text-cyan-400"
}

}[tipo];





return (

<div

className={`
group
rounded-3xl
border
${estilos.borda}
bg-gradient-to-b
from-[#171F2B]
to-[#111827]
p-6
transition-all
duration-300
hover:-translate-y-1
hover:shadow-2xl
`

}

>



<div className="
flex
items-center
justify-between
">



<div>


<p className="text-zinc-500">

{titulo}

</p>




<h2 className={`
mt-4
text-4xl
font-bold
${estilos.numero}
`}>

{valor}

</h2>



</div>






<div

className={`
flex
h-12
w-12
items-center
justify-center
rounded-2xl
${estilos.fundo}
${estilos.texto}
transition-all
duration-300
group-hover:scale-110
`

}

>

{icone}

</div>





</div>



</div>

);

}