import {
  DollarSign,
  Wallet,
  TrendingUp,
  Percent,
  Eye,
} from "lucide-react";

import ReportHeader from "@/components/relatorios/ReportHeader";
import ReportKPICard from "@/components/relatorios/ReportKPICard";
import ReportExport from "@/components/relatorios/ReportExport";

import { getRentabilidadeContratos } from "@/lib/relatorios/rentabilidade";

export default async function RelatorioRentabilidadeContratosPage() {
  const { contratos, totais } = await getRentabilidadeContratos();

  return (
    <main className="space-y-8">

      <ReportHeader
        title="Rentabilidade dos Contratos"
        description="Visualize a rentabilidade de todos os contratos da empresa."
        actions={
          <ReportExport
            disabledPDF
            disabledExcel
          />
        }
      />


      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <ReportKPICard
          title="Receita Total"
          value={totais.receita.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          icon={DollarSign}
          color="green"
        />


        <ReportKPICard
          title="Custos Totais"
          value={totais.custos.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          icon={Wallet}
          color="red"
        />


        <ReportKPICard
          title="Lucro Total"
          value={totais.lucro.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          icon={TrendingUp}
          color="blue"
        />


        <ReportKPICard
          title="Margem Geral"
          value={`${totais.margem.toFixed(1)}%`}
          icon={Percent}
          color="yellow"
        />

      </section>



      <section
        className="
          rounded-3xl
          border
          border-zinc-800
          bg-[#111827]
          overflow-hidden
        "
      >

        <table className="min-w-full">

          <thead className="border-b border-zinc-800">

            <tr>

              <th className="px-6 py-5 text-left text-xs text-zinc-500">
                Cliente
              </th>

              <th className="px-6 py-5 text-left text-xs text-zinc-500">
                Contrato
              </th>

              <th className="px-6 py-5 text-right text-xs text-zinc-500">
                Receita
              </th>

              <th className="px-6 py-5 text-right text-xs text-zinc-500">
                Custos
              </th>

              <th className="px-6 py-5 text-right text-xs text-zinc-500">
                Lucro
              </th>

              <th className="px-6 py-5 text-right text-xs text-zinc-500">
                Margem
              </th>

              <th className="px-6 py-5 text-center text-xs text-zinc-500">
                Ações
              </th>

            </tr>

          </thead>



          <tbody>

            {contratos.map((item:any)=>(

              <tr
                key={item.id}
                className="border-b border-zinc-800"
              >

                <td className="px-6 py-5 text-zinc-300">
                  {item.cliente}
                </td>


                <td className="px-6 py-5 text-zinc-300">
                  {item.contrato}
                </td>


                <td className="px-6 py-5 text-right text-zinc-300">
                  {item.receita.toLocaleString("pt-BR", {
                    style:"currency",
                    currency:"BRL",
                  })}
                </td>


                <td className="px-6 py-5 text-right text-zinc-300">
                  {item.custos.toLocaleString("pt-BR", {
                    style:"currency",
                    currency:"BRL",
                  })}
                </td>


                <td className="px-6 py-5 text-right text-zinc-300">
                  {item.lucro.toLocaleString("pt-BR", {
                    style:"currency",
                    currency:"BRL",
                  })}
                </td>


                <td className="px-6 py-5 text-right text-zinc-300">
                  {item.margem.toFixed(1)}%
                </td>



                <td className="px-6 py-5 text-center">

                  <button
                    type="button"
                    onClick={() => {

                      console.log(
                        "CLIQUE FUNCIONOU:",
                        item.id
                      );

                      window.location.assign(
                        `/relatorios/rentabilidade/${item.id}`
                      );

                    }}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-lg
                      bg-green-500
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      text-black
                      cursor-pointer
                    "
                  >

                    <Eye size={16}/>

                    Ver detalhes

                  </button>

                </td>


              </tr>

            ))}

          </tbody>

        </table>

      </section>


    </main>
  );
}