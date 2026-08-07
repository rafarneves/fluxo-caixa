import {
    TrendingUp,
    TrendingDown,
  } from "lucide-react";
  
  
  type Props = {
    receitaBruta: number;
    lucroLiquido: number;
    margem: number;
  };
  
  
  
  function moeda(valor:number){
  
    return valor.toLocaleString(
      "pt-BR",
      {
        style:"currency",
        currency:"BRL",
        maximumFractionDigits:0,
      }
    );
  
  }
  
  
  
  
  
  function Indicador({
  
    titulo,
    valor,
    descricao,
    positivo,
  
  }:{
  
    titulo:string;
    valor:string;
    descricao:string;
    positivo:boolean;
  
  }) {
  
  
  
    const Icon =
      positivo
        ? TrendingUp
        : TrendingDown;
  
  
  
    return (
  
  
      <div
  
        className="
          group
          rounded-2xl
          border
          border-zinc-800
          bg-black/20
          p-5
          cursor-pointer
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-zinc-600
          hover:shadow-xl
        "
  
      >
  
  
  
        <div className="
          flex
          items-center
          justify-between
        ">
  
  
  
          <p className="
            text-sm
            text-zinc-500
          ">
            {titulo}
          </p>
  
  
  
  
          <div
  
            className={`
              rounded-xl
              p-2
              transition-transform
              duration-300
              group-hover:scale-110
  
              ${
                positivo
                ?
                "bg-green-500/10 text-green-400"
                :
                "bg-red-500/10 text-red-400"
              }
            `}
  
          >
  
            <Icon size={18}/>
  
          </div>
  
  
  
        </div>
  
  
  
  
  
        <h3
  
          className={`
            mt-4
            text-3xl
            font-bold
  
            ${
              positivo
              ?
              "text-green-400"
              :
              "text-red-400"
            }
          `}
  
        >
  
          {valor}
  
        </h3>
  
  
  
  
  
        <p className="
          mt-2
          text-xs
          text-zinc-500
        ">
  
          {descricao}
  
        </p>
  
  
  
  
  
      </div>
  
  
    );
  
  }
  
  
  
  
  
  
  
  export default function DREComparison({
  
    receitaBruta,
    lucroLiquido,
    margem,
  
  }:Props){
  
  
  
    const empresaSaudavel =
      lucroLiquido >= 0;
  
  
  
  
    const margemBoa =
      margem >= 20;
  
  
  
  
  
    return (
  
  
      <section
  
        className="
          rounded-3xl
          border
          border-zinc-800
          bg-gradient-to-b
          from-[#171F2B]
          to-[#111827]
          p-8
        "
  
      >
  
  
  
        <div className="mb-6">
  
  
  
          <p className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.20em]
            text-zinc-500
          ">
            PERFORMANCE
          </p>
  
  
  
  
          <h2 className="
            mt-3
            text-2xl
            font-bold
          ">
            Comparativo do Período
          </h2>
  
  
  
  
          <p className="
            mt-2
            text-zinc-500
          ">
            Indicadores estratégicos da operação.
          </p>
  
  
  
        </div>
  
  
  
  
  
  
  
        <div className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-5
        ">
  
  
  
  
          <Indicador
  
            titulo="Receita"
  
            valor={
              moeda(receitaBruta)
            }
  
            descricao="Faturamento do período"
  
            positivo={
              empresaSaudavel
            }
  
          />
  
  
  
  
  
          <Indicador
  
            titulo="Lucro Líquido"
  
            valor={
              moeda(lucroLiquido)
            }
  
            descricao="Resultado final"
  
            positivo={
              empresaSaudavel
            }
  
          />
  
  
  
  
  
          <Indicador
  
            titulo="Margem"
  
            valor={
              `${margem.toFixed(1)}%`
            }
  
            descricao={
              margemBoa
              ?
              "Margem saudável"
              :
              "Atenção na rentabilidade"
            }
  
            positivo={
              margemBoa
            }
  
          />
  
  
  
  
  
        </div>
  
  
  
  
  
      </section>
  
  
    );
  
  }