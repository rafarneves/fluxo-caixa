import { DollarSign, Wallet, TrendingUp, Percent } from "lucide-react";
import { notFound } from "next/navigation";

import ReportHeader from "@/components/relatorios/ReportHeader";
import ReportKPICard from "@/components/relatorios/ReportKPICard";

import { getRentabilidadeContrato } from "@/lib/relatorios/rentabilidade";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RentabilidadeContratoPage({ params }: Props) {
  const { id } = await params;

  const contrato = await getRentabilidadeContrato(id);

  if (!contrato) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <ReportHeader title={contrato.contrato} description={contrato.cliente} />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ReportKPICard
          title="Receita"
          value={contrato.receita.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          icon={DollarSign}
          color="green"
        />

        <ReportKPICard
          title="Custos"
          value={contrato.custos.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          icon={Wallet}
          color="red"
        />

        <ReportKPICard
          title="Lucro"
          value={contrato.lucro.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          icon={TrendingUp}
          color="blue"
        />

        <ReportKPICard
          title="Margem"
          value={`${contrato.margem.toFixed(1)}%`}
          icon={Percent}
          color="yellow"
        />
      </section>
    </main>
  );
}
