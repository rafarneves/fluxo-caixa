import {
  FileText,
  Wallet,
  TrendingUp,
  Users,
} from "lucide-react";

import ReportHeader from "@/components/relatorios/ReportHeader";
import ReportKPICard from "@/components/relatorios/ReportKPICard";
import ReportExport from "@/components/relatorios/ReportExport";
import ReportTable from "@/components/relatorios/ReportTable";

import { getDashboardExecutivo } from "@/lib/relatorios/dashboard";

export default async function RelatorioContratosPage() {
  const dados = await getDashboardExecutivo();

  const contratos = dados.contratos;

  const faturamento = contratos.reduce(
    (acc: number, contrato: any) =>
      acc + Number(contrato.valor),
    0
  );

  return (
    <main className="space-y-8">
      <ReportHeader
        title="Contratos"
        description="Relatório completo dos contratos cadastrados no ERP."
        actions={
          <ReportExport
            disabledPDF
            disabledExcel
          />
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ReportKPICard
          title="Contratos Ativos"
          value={contratos.length}
          icon={FileText}
          color="green"
          isCurrency={false}
        />

        <ReportKPICard
          title="Faturamento"
          value={faturamento}
          icon={Wallet}
          color="blue"
        />

        <ReportKPICard
          title="Ticket Médio"
          value={dados.ticketMedio}
          icon={TrendingUp}
          color="yellow"
        />

        <ReportKPICard
          title="Clientes"
          value={dados.totalClientes}
          icon={Users}
          color="green"
          isCurrency={false}
        />
      </section>

      <ReportTable
        title="Lista de Contratos"
        description="Todos os contratos ativos cadastrados no sistema."
        columns={[
          {
            key: "cliente",
            title: "Cliente",
            render: (item: any) =>
              item.clientes?.nome ?? "-",
          },
          {
            key: "nome",
            title: "Plano",
            render: (item: any) =>
              item.nome ?? "-",
          },
          {
            key: "valor",
            title: "Valor",
            align: "right",
            render: (item: any) =>
              Number(item.valor).toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL",
                }
              ),
          },
          {
            key: "status",
            title: "Status",
          },
        ]}
        data={contratos}
      />
    </main>
  );
}