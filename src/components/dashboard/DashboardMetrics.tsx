import { Users, FileText, Wallet, Landmark } from "lucide-react";

import StatCard from "@/components/ui/StatCard";

type Props = {
  totalClientes: number;
  contratosAtivos: number;
  faturamentoMensal: number;
  emAberto: number;
};

function formatCompact(value: number) {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}k`;
  }

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function DashboardMetrics({
  totalClientes,
  contratosAtivos,
  faturamentoMensal,
  emAberto,
}: Props) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard
        titulo="Clientes"

        valor={totalClientes.toString()}

        subtitulo="Clientes cadastrados"

        status="Ativos"

        tendencia="Carteira atual"

        progresso={100}

        cor="blue"

        tamanho="grande"

        icone={<Users size={22} />}
      />

      <StatCard
        titulo="Contratos"

        valor={contratosAtivos.toString()}

        subtitulo="Contratos ativos"

        status="Em andamento"

        tendencia="Operação"

        progresso={100}

        cor="green"

        tamanho="grande"

        icone={<FileText size={22} />}
      />

      <StatCard
        titulo="Faturamento"

        valor={formatCompact(faturamentoMensal)}

        subtitulo="Receita do período"

        status="Receita"

        tendencia="Financeiro"

        progresso={100}

        cor="yellow"

        tamanho="grande"

        icone={<Wallet size={22} />}
      />

      <StatCard
        titulo="Em Aberto"

        valor={formatCompact(emAberto)}

        subtitulo="Valores a receber"

        status="Cobranças"

        tendencia="Pendências"

        progresso={faturamentoMensal > 0 ? (emAberto / faturamentoMensal) * 100 : 0}

        cor="red"

        tamanho="grande"

        icone={<Landmark size={22} />}
      />
    </section>
  );
}
