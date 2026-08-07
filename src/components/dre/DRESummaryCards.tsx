import {
  TrendingUp,
  Wallet,
  Receipt,
  Percent,
} from "lucide-react";

import StatCard from "@/components/ui/StatCard";

type Props = {
  receitaBruta: number;
  custos: number;
  lucroLiquido: number;
  margem: number;
};

function moeda(valor: number) {
  const absoluto = Math.abs(valor);

  if (absoluto >= 1000000) {
    return `${valor < 0 ? "-" : ""}R$ ${(absoluto / 1000000).toFixed(1)}M`;
  }

  if (absoluto >= 1000) {
    return `${valor < 0 ? "-" : ""}R$ ${(absoluto / 1000).toFixed(1)}k`;
  }

  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function DRESummaryCards({
  receitaBruta,
  custos,
  lucroLiquido,
  margem,
}: Props) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      <StatCard
        titulo="Receita Bruta"
        valor={moeda(receitaBruta)}
        subtitulo="Total recebido no período"
        icone={<Wallet size={22} />}
        status="Receita"
        tendencia="Entrada financeira"
        progresso={100}
        cor="green"
      />


      <StatCard
        titulo="Custos dos Contratos"
        valor={moeda(custos)}
        subtitulo="Custos diretos da operação"
        icone={<Receipt size={22} />}
        status="Custos"
        tendencia="Acompanhar margem"
        progresso={60}
        cor="red"
      />


      <StatCard
        titulo="Lucro Líquido"
        valor={moeda(lucroLiquido)}
        subtitulo="Resultado final"
        icone={<TrendingUp size={22} />}
        status={
          lucroLiquido >= 0
            ? "Lucro"
            : "Prejuízo"
        }
        tendencia={
          lucroLiquido >= 0
            ? "Empresa saudável"
            : "Resultado negativo"
        }
        progresso={Math.min(
          Math.abs(lucroLiquido) / 100,
          100
        )}
        cor={
          lucroLiquido >= 0
            ? "green"
            : "red"
        }
      />


      <StatCard
        titulo="Margem Líquida"
        valor={`${margem.toFixed(1)}%`}
        subtitulo="Rentabilidade da empresa"
        icone={<Percent size={22} />}
        status={
          margem >= 30
            ? "Saudável"
            : "Atenção"
        }
        tendencia={
          margem >= 30
            ? "Boa margem"
            : "Revisar custos"
        }
        progresso={Math.min(
          margem,
          100
        )}
        cor={
          margem >= 30
            ? "green"
            : "yellow"
        }
      />

    </section>
  );
}