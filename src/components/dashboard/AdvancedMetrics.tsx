import { TrendingUp, DollarSign, Percent, AlertTriangle } from "lucide-react";

import StatCard from "@/components/ui/StatCard";

type Props = {
  mrr: number;
  ticketMedio: number;
  percentualRecebimento: number;
  inadimplencia: number;
};

function formatCompact(value: number) {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}k`;
  }

  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}k`;
  }

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function AdvancedMetrics({
  mrr,
  ticketMedio,
  percentualRecebimento,
  inadimplencia,
}: Props) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard
        titulo="Receita Recorrente"
        valor={formatCompact(mrr)}
        subtitulo="MRR Mensal"
        status="Financeiro"
        tendencia="Receita recorrente"
        progresso={100}
        cor="green"
        icone={<TrendingUp size={22} />}
      />

      <StatCard
        titulo="Ticket Médio"
        valor={formatCompact(ticketMedio)}
        subtitulo="Valor médio por contrato"
        status="Performance"
        tendencia="Clientes ativos"
        progresso={100}
        cor="blue"
        icone={<DollarSign size={22} />}
      />

      <StatCard
        titulo="Recebimento"
        valor={`${percentualRecebimento.toFixed(1)}%`}
        subtitulo="Taxa de recebimento"
        status={
          percentualRecebimento >= 90
            ? "Excelente"
            : percentualRecebimento >= 75
              ? "Boa"
              : "Atenção"
        }
        tendencia="Eficiência financeira"
        progresso={percentualRecebimento}
        cor={percentualRecebimento >= 90 ? "green" : percentualRecebimento >= 75 ? "yellow" : "red"}
        icone={<Percent size={22} />}
      />

      <StatCard
        titulo="Inadimplência"
        valor={formatCompact(inadimplencia)}
        subtitulo="Valores pendentes"
        status={inadimplencia === 0 ? "Controlada" : "Monitorar"}
        tendencia="Cobranças em aberto"
        progresso={Math.min(inadimplencia / 1000, 100)}
        cor={inadimplencia === 0 ? "green" : "red"}
        icone={<AlertTriangle size={22} />}
      />
    </section>
  );
}
