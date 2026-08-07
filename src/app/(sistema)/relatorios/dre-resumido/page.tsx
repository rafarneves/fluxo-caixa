import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

import ReportHeader from "@/components/relatorios/ReportHeader";
import ReportKPICard from "@/components/relatorios/ReportKPICard";
import ReportExport from "@/components/relatorios/ReportExport";
import ReportTable from "@/components/relatorios/ReportTable";

import { getDashboardExecutivo } from "@/lib/relatorios/dashboard";
import { formatMoneyCompact } from "@/lib/formatMoneyCompact";

export default async function DREResumidoPage() {
  const dados = await getDashboardExecutivo();

  const receita = dados.recebido;

  const custos = dados.custosTotal;

  const despesas = dados.despesasTotal;

  const lucro = dados.lucro;

  const margem = receita === 0 ? 0 : (lucro / receita) * 100;

  return (
    <main className="space-y-8">
      <ReportHeader
        title="DRE Resumido"

        description="Demonstrativo resumido do resultado do exercício."

        actions={<ReportExport disabledPDF disabledExcel />}
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ReportKPICard
          title="Receita"

          value={formatMoneyCompact(receita)}

          icon={DollarSign}

          color="green"
        />

        <ReportKPICard
          title="Custos"

          value={formatMoneyCompact(custos)}

          icon={TrendingDown}

          color="yellow"
        />

        <ReportKPICard
          title="Despesas"

          value={formatMoneyCompact(despesas)}

          icon={TrendingDown}

          color="red"
        />

        <ReportKPICard
          title="Lucro"

          value={formatMoneyCompact(lucro)}

          icon={TrendingUp}

          color={lucro >= 0 ? "green" : "red"}
        />
      </section>

      <ReportTable
        title="Resumo Financeiro"

        description="Resumo dos principais indicadores do DRE."

        columns={[
          {
            key: "conta",

            title: "Conta",
          },

          {
            key: "valor",

            title: "Valor",

            align: "right",
          },
        ]}

        data={[
          {
            conta: "Receita Bruta",

            valor: receita.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
          },

          {
            conta: "(-) Custos",

            valor: custos.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
          },

          {
            conta: "(-) Despesas",

            valor: despesas.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
          },

          {
            conta: "Lucro Líquido",

            valor: lucro.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
          },

          {
            conta: "Margem",

            valor: `${margem.toFixed(2)}%`,
          },
        ]}
      />
    </main>
  );
}
