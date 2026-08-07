import { supabase } from "@/lib/supabase";
import { obterPeriodo } from "@/lib/periodo";

import DREHeader from "@/components/dre/DREHeader";
import DRESummaryCards from "@/components/dre/DRESummaryCards";
import DREIndicators from "@/components/dre/DREIndicators";
import DREResume from "@/components/dre/DREResume";
import DREComparison from "@/components/dre/DREComparison";
import DRECharts from "@/components/dre/DRECharts";
import DREStatement from "@/components/dre/DREStatement";
import DREExpenseBreakdown from "@/components/dre/DREExpenseBreakdown";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: {
    periodo?: string;
  };
};

export default async function DREPage({
  searchParams,
}: Props) {

  const periodo =
    searchParams?.periodo ?? "mes";


  const {
    inicio,
    fim,
  } = obterPeriodo(periodo);


  const inicioISO =
    inicio.toISOString().split("T")[0];

  const fimISO =
    fim.toISOString().split("T")[0];


  const [
    { data: recebimentos },
    { data: despesas },
    { data: custosContrato },
  ] = await Promise.all([

    supabase
      .from("recebimentos")
      .select("valor, competencia")
      .eq("status", "Pago"),


    supabase
      .from("despesas")
      .select("categoria, valor, data")
      .gte("data", inicioISO)
      .lte("data", fimISO),


    supabase
      .from("custos_contrato")
      .select("valor, data")
      .gte("data", inicioISO)
      .lte("data", fimISO),

  ]);



  const receitaBruta =
    recebimentos?.reduce(
      (acc, item) =>
        acc + Number(item.valor || 0),
      0
    ) || 0;



  const custos =
    custosContrato?.reduce(
      (acc, item) =>
        acc + Number(item.valor || 0),
      0
    ) || 0;



  const despesasOperacionais =
    despesas?.reduce(
      (acc, item) =>
        acc + Number(item.valor || 0),
      0
    ) || 0;



  const lucroBruto =
    receitaBruta - custos;



  const lucroLiquido =
    lucroBruto - despesasOperacionais;



  const margem =
    receitaBruta > 0
      ? (lucroLiquido / receitaBruta) * 100
      : 0;



  const meses: Record<
    string,
    {
      mes: string;
      receita: number;
      lucro: number;
    }
  > = {};



  recebimentos?.forEach((item: any) => {

    const mes =
      item.competencia || "Sem mês";


    if (!meses[mes]) {

      meses[mes] = {
        mes,
        receita: 0,
        lucro: 0,
      };

    }


    meses[mes].receita +=
      Number(item.valor || 0);

  });



  despesas?.forEach((item: any) => {

    const mes =
      item.data?.slice(0, 7) ||
      "Sem mês";


    if (!meses[mes]) {

      meses[mes] = {
        mes,
        receita: 0,
        lucro: 0,
      };

    }


    meses[mes].lucro -=
      Number(item.valor || 0);

  });



  custosContrato?.forEach((item: any) => {

    const mes =
      item.data?.slice(0, 7) ||
      "Sem mês";


    if (!meses[mes]) {

      meses[mes] = {
        mes,
        receita: 0,
        lucro: 0,
      };

    }


    meses[mes].lucro -=
      Number(item.valor || 0);

  });



  const dadosGrafico =
    Object.values(meses)
      .map((item) => ({
        mes: item.mes,
        receita: item.receita,
        lucro:
          item.receita +
          item.lucro,
      }))
      .sort(
        (a, b) =>
          a.mes.localeCompare(b.mes)
      );



  return (

    <main className="space-y-8">


      <DREHeader />


      <DRESummaryCards
        receitaBruta={receitaBruta}
        custos={custos}
        lucroLiquido={lucroLiquido}
        margem={margem}
      />



      <DREIndicators
        receitaBruta={receitaBruta}
        custos={custos}
        despesasOperacionais={
          despesasOperacionais
        }
        lucroLiquido={lucroLiquido}
      />



      <DREResume
        receitaBruta={receitaBruta}
        custos={custos}
        despesasOperacionais={
          despesasOperacionais
        }
        lucroLiquido={lucroLiquido}
        margem={margem}
      />



      <DREComparison
        receitaBruta={receitaBruta}
        lucroLiquido={lucroLiquido}
        margem={margem}
      />



      <DRECharts
        dados={dadosGrafico}
      />



      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">


        <div className="xl:col-span-2">

          <DREStatement
            receitaBruta={receitaBruta}
            custos={custos}
            despesasOperacionais={
              despesasOperacionais
            }
            despesas={despesas ?? []}
          />

        </div>


        <div>

          <DREExpenseBreakdown
            despesas={despesas ?? []}
          />

        </div>


      </div>


    </main>

  );
}