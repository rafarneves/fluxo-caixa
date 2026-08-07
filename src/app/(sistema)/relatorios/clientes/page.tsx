import {
  Users,
  UserPlus,
  FileText,
  TrendingUp,
} from "lucide-react";

import ReportHeader from "@/components/relatorios/ReportHeader";
import ReportKPICard from "@/components/relatorios/ReportKPICard";
import ReportExport from "@/components/relatorios/ReportExport";
import ReportTable from "@/components/relatorios/ReportTable";

import { getDashboardExecutivo } from "@/lib/relatorios/dashboard";

export default async function RelatorioClientesPage() {
  const dados = await getDashboardExecutivo();

  const clientes = dados.clientes;
  const contratos = dados.contratos;

  return (
    <main className="space-y-8">
      <ReportHeader
        title="Clientes"
        description="Relatório completo dos clientes cadastrados."
        actions={
          <ReportExport
            disabledPDF
            disabledExcel
          />
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ReportKPICard
          title="Clientes"
          value={clientes.length}
          icon={Users}
          color="blue"
          isCurrency={false}
        />

        <ReportKPICard
          title="Contratos Ativos"
          value={contratos.length}
          icon={FileText}
          color="green"
          isCurrency={false}
        />

        <ReportKPICard
          title="Novos Clientes"
          value={clientes.slice(0, 30).length}
          icon={UserPlus}
          color="yellow"
          isCurrency={false}
        />

        <ReportKPICard
          title="Ticket Médio"
          value={dados.ticketMedio}
          icon={TrendingUp}
          color="green"
        />
      </section>

      <ReportTable
        title="Clientes Cadastrados"
        description="Lista completa dos clientes."
        columns={[
          {
            key: "nome",
            title: "Nome",
          },
          {
            key: "telefone",
            title: "Telefone",
          },
          {
            key: "email",
            title: "E-mail",
          },
          {
            key: "created_at",
            title: "Cadastro",
            render: (item: any) =>
              new Date(item.created_at).toLocaleDateString(
                "pt-BR"
              ),
          },
        ]}
        data={clientes}
      />
    </main>
  );
}