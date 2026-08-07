import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Users,
  Gift,
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




export default async function IndicacoesPage(){


  const { data: indicacoes } =
    await supabase
      .from("indicacoes")
      .select(`
        *,
        indicador:cliente_indicador(
          nome
        ),
        indicado:cliente_indicado(
          nome
        )
      `)
      .order(
        "created_at",
        {
          ascending:false
        }
      );





  const indicacoesComStatus =
    await Promise.all(

      (indicacoes ?? [])
      .map(
        async(indicacao:any)=>{


          const { data: contrato } =
            await supabase
              .from("contratos")
              .select("status")
              .eq(
                "cliente_id",
                indicacao.cliente_indicado
              )
              .eq(
                "status",
                "Ativo"
              )
              .limit(1)
              .maybeSingle();



          const beneficioAtivo =
            !!contrato;




          await supabase
            .from("indicacoes")
            .update({

              status:
                beneficioAtivo
                ?
                "Ativo"
                :
                "Suspenso"

            })
            .eq(
              "id",
              indicacao.id
            );




          return {

            ...indicacao,

            beneficioAtivo

          };


        }
      )

    );







  const totalIndicacoes =
    indicacoesComStatus.length;



  const beneficiosAtivos =
    indicacoesComStatus.filter(
      (item:any)=>
        item.beneficioAtivo
    ).length;




  const beneficioMensal =
    indicacoesComStatus.reduce(
      (
        total:number,
        item:any
      )=>{

        return (
          total +
          (
            item.beneficioAtivo
            ?
            Number(item.valor_desconto)
            :
            0
          )
        );

      },
      0
    );







return (

<main className="space-y-10">





<div className="
flex
items-start
justify-between
">



<div>


<p className="
text-xs
font-semibold
uppercase
tracking-[0.22em]
text-zinc-500
">
INDICAÇÕES
</p>



<h1 className="
mt-3
text-5xl
font-bold
text-white
">
Indicações
</h1>



<p className="
mt-3
text-lg
text-zinc-400
">
Controle de benefícios gerados por indicação de clientes.
</p>



</div>






<Link

href="/indicacoes/nova"

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

+ Nova Indicação

</Link>



</div>









<div className="
grid
grid-cols-1
md:grid-cols-3
gap-6
">





<CardResumo

titulo="Total Indicações"

valor={String(totalIndicacoes)}

icone={<Users size={22}/>}

cor="green"

/>





<CardResumo

titulo="Benefícios Ativos"

valor={String(beneficiosAtivos)}

icone={<Gift size={22}/>}

cor="blue"

/>





<CardResumo

titulo="Benefício Mensal"

valor={formatMoney(beneficioMensal)}

icone={<TrendingUp size={22}/>}

cor="yellow"

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
Cliente Indicador
</th>


<th className="p-5 text-left text-zinc-400">
Cliente Indicado
</th>


<th className="p-5 text-left text-zinc-400">
Benefício
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
indicacoesComStatus.map(
(indicacao:any)=>(


<tr

key={indicacao.id}

className="
border-t
border-zinc-800
hover:bg-black/20
transition
"

>



<td className="p-5 font-semibold text-white">

{indicacao.indicador?.nome ?? "-"}

</td>





<td className="p-5 text-zinc-300">

{indicacao.indicado?.nome ?? "-"}

</td>





<td className="
p-5
font-bold
text-yellow-400
">

{
formatMoney(
Number(
indicacao.valor_desconto
)
)
}

</td>






<td className="p-5">


{
indicacao.beneficioAtivo

?

<span className="
rounded-full
bg-green-500/10
px-3
py-1
text-sm
text-green-400
">
Ativo
</span>

:

<span className="
rounded-full
bg-red-500/10
px-3
py-1
text-sm
text-red-400
">
Suspenso
</span>

}



</td>






<td className="
p-5
text-right
">


<Link

href={`/indicacoes/editar/${indicacao.id}`}

className="
rounded-xl
bg-cyan-500/10
px-4
py-2
text-sm
text-cyan-400
hover:bg-cyan-500/20
transition
"

>

Editar

</Link>



</td>





</tr>


)

)

}




</tbody>





</table>






</div>







</main>

);


}









function CardResumo({

titulo,

valor,

icone,

cor,

}:{

titulo:string;

valor:string;

icone:React.ReactNode;

cor:"green"|"blue"|"yellow";

}){



const estilo = {

green:{
texto:"text-green-400",
fundo:"bg-green-500/10",
borda:"border-green-500/20"
},

blue:{
texto:"text-cyan-400",
fundo:"bg-cyan-500/10",
borda:"border-cyan-500/20"
},

yellow:{
texto:"text-yellow-400",
fundo:"bg-yellow-500/10",
borda:"border-yellow-500/20"
}

}[cor];





return (

<div

className={`
group
rounded-3xl
border
${estilo.borda}
bg-gradient-to-b
from-[#171F2B]
to-[#111827]
p-6
transition-all
duration-300
hover:-translate-y-1
hover:shadow-2xl
`}

>


<div className="
flex
items-center
justify-between
">


<div>


<p className="
text-zinc-500
">
{titulo}
</p>


<h2 className={`
mt-4
text-4xl
font-bold
${estilo.texto}
`}>
{valor}
</h2>


</div>





<div className={`
flex
h-12
w-12
items-center
justify-center
rounded-2xl
${estilo.fundo}
${estilo.texto}
transition
duration-300
group-hover:scale-110
`}>

{icone}

</div>



</div>


</div>

);

}