import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Percent,
  Wallet,
  Landmark,
} from "lucide-react";

import ReportHeader from "@/components/relatorios/ReportHeader";
import ReportKPICard from "@/components/relatorios/ReportKPICard";
import ReportExport from "@/components/relatorios/ReportExport";
import ReportTable from "@/components/relatorios/ReportTable";

import { getDashboardExecutivo } from "@/lib/relatorios/dashboard";
import { formatMoneyCompact } from "@/lib/formatMoneyCompact";


export default async function DRECompletoPage() {


  const dados = await getDashboardExecutivo();


  const receitaBruta = dados.recebido;

  const custos = dados.custosTotal;

  const despesas = dados.despesasTotal;



  const lucroBruto = receitaBruta - custos;

  const lucroLiquido = lucroBruto - despesas;



  const margem =
    receitaBruta === 0
      ? 0
      : (lucroLiquido / receitaBruta) * 100;



  const linhas = [

    {
      conta:"Receita Bruta",
      grupo:"Receitas",
      valor:receitaBruta,
    },


    {
      conta:"(-) Custos",
      grupo:"Custos",
      valor:-custos,
    },


    {
      conta:"Lucro Bruto",
      grupo:"Resultado",
      valor:lucroBruto,
    },


    {
      conta:"(-) Despesas Operacionais",
      grupo:"Despesas",
      valor:-despesas,
    },


    {
      conta:"Lucro Líquido",
      grupo:"Resultado Final",
      valor:lucroLiquido,
    },

  ];



  return (

    <main className="space-y-8">


      <ReportHeader

        title="DRE Completo"

        description="Demonstrativo completo do resultado do exercício."

        actions={
          <ReportExport
            disabledPDF
            disabledExcel
          />
        }

      />



      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">


        <ReportKPICard

          title="Receita"

          value={
            formatMoneyCompact(
              receitaBruta
            )
          }

          icon={DollarSign}

          color="green"

        />



        <ReportKPICard

          title="Custos"

          value={
            formatMoneyCompact(
              custos
            )
          }

          icon={Wallet}

          color="yellow"

        />



        <ReportKPICard

          title="Lucro Bruto"

          value={
            formatMoneyCompact(
              lucroBruto
            )
          }

          icon={TrendingUp}

          color={
            lucroBruto >= 0
              ? "green"
              : "red"
          }

        />



        <ReportKPICard

          title="Despesas"

          value={
            formatMoneyCompact(
              despesas
            )
          }

          icon={TrendingDown}

          color="red"

        />



        <ReportKPICard

          title="Lucro Líquido"

          value={
            formatMoneyCompact(
              lucroLiquido
            )
          }

          icon={Landmark}

          color={
            lucroLiquido >= 0
              ? "green"
              : "red"
          }

        />



        <ReportKPICard

          title="Margem"

          value={
            `${margem.toFixed(2)}%`
          }

          icon={Percent}

          color="blue"

        />


      </section>





      <ReportTable

        title="Demonstrativo"

        description="Composição completa do DRE."

        columns={[

          {

            key:"grupo",

            title:"Grupo",

          },


          {

            key:"conta",

            title:"Conta",

          },


          {

            key:"valor",

            title:"Valor",

            align:"right",

            render:(item:any)=>

              item.valor.toLocaleString(

                "pt-BR",

                {

                  style:"currency",

                  currency:"BRL",

                }

              ),

          },


        ]}


        data={linhas}


      />


    </main>

  );

}