import { BriefcaseBusiness, Wallet, TrendingDown, BarChart3 } from "lucide-react";

import ReportHeader from "@/components/relatorios/ReportHeader";
import ReportKPICard from "@/components/relatorios/ReportKPICard";
import ReportExport from "@/components/relatorios/ReportExport";
import ReportTable from "@/components/relatorios/ReportTable";

import { getDashboardExecutivo } from "@/lib/relatorios/dashboard";

export default async function RelatorioCustosPage() {
  const dados = await getDashboardExecutivo();

  const custos = dados.custosContrato;

  const totalCustos = custos.reduce((total: number, custo: any) => total + Number(custo.valor), 0);

  const quantidade = custos.length;

  const ticketMedio = quantidade === 0 ? 0 : totalCustos / quantidade;

  const participacao = dados.recebido > 0 ? (totalCustos / dados.recebido) * 100 : 0;

  return (
    <main className="space-y-8">
      <ReportHeader
        title="Custos"
        description="Relatório completo dos custos registrados no ERP."
        actions={<ReportExport disabledPDF disabledExcel />}
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ReportKPICard title="Total de Custos" value={totalCustos} icon={Wallet} color="red" />

        <ReportKPICard
          title="Lançamentos"
          value={quantidade}
          icon={BriefcaseBusiness}
          color="blue"
          isCurrency={false}
        />

        <ReportKPICard title="Custo Médio" value={ticketMedio} icon={TrendingDown} color="yellow" />

        <ReportKPICard
          title="Participação"
          value={`${participacao.toFixed(1)}%`}
          icon={BarChart3}
          color="green"
          isCurrency={false}
        />
      </section>

      <ReportTable
        title="Custos"
        description="Lista completa dos custos cadastrados."
        columns={[
          {
            key: "descricao",
            title: "Descrição",
            render: (item: any) => item.descricao ?? "-",
          },
          {
            key: "categoria",
            title: "Categoria",
            render: (item: any) => item.categoria ?? "-",
          },
          {
            key: "data",
            title: "Data",
            render: (item: any) =>
              item.data ? new Date(item.data).toLocaleDateString("pt-BR") : "-",
          },
          {
            key: "valor",
            title: "Valor",
            align: "right",
            render: (item: any) =>
              Number(item.valor).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              }),
          },
        ]}
        data={custos}
      />
    </main>
  );
}
