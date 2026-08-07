import {
    ArrowDownCircle,
    ArrowUpCircle,
    Receipt,
    Briefcase,
    TrendingUp,
  } from "lucide-react";
  
  import StatCard from "@/components/ui/StatCard";
  
  type Props = {
    entradas: number;
    despesasFixas: number;
    despesasVariaveis: number;
    custosContratos: number;
    resultado: number;
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
  
  export default function FluxoSummary({
    entradas,
    despesasFixas,
    despesasVariaveis,
    custosContratos,
    resultado,
  }: Props) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
  
        <StatCard
          titulo="Entradas"
          valor={moeda(entradas)}
          subtitulo="Recebimentos confirmados"
          icone={<ArrowDownCircle size={22} />}
          status="Entrada"
          tendencia="Fluxo positivo"
          progresso={100}
          cor="green"
        />
  
        <StatCard
          titulo="Despesas Fixas"
          valor={moeda(despesasFixas)}
          subtitulo="Custos recorrentes"
          icone={<Receipt size={22} />}
          status="Mensal"
          tendencia="Controle financeiro"
          progresso={65}
          cor="red"
        />
  
        <StatCard
          titulo="Despesas Variáveis"
          valor={moeda(despesasVariaveis)}
          subtitulo="Custos eventuais"
          icone={<ArrowUpCircle size={22} />}
          status="Variável"
          tendencia="Acompanhar gastos"
          progresso={45}
          cor="yellow"
        />
  
        <StatCard
          titulo="Custos Contratos"
          valor={moeda(custosContratos)}
          subtitulo="Execução dos contratos"
          icone={<Briefcase size={22} />}
          status="Operação"
          tendencia="Custos ativos"
          progresso={75}
          cor="blue"
        />
  
        <StatCard
          titulo="Resultado"
          valor={moeda(resultado)}
          subtitulo="Resultado financeiro"
          icone={<TrendingUp size={22} />}
          status={
            resultado >= 0
              ? "Lucro"
              : "Prejuízo"
          }
          tendencia={
            resultado >= 0
              ? "Empresa saudável"
              : "Resultado negativo"
          }
          progresso={
            resultado >= 0
              ? Math.min(resultado / 100, 100)
              : Math.min(Math.abs(resultado) / 100, 100)
          }
          cor={
            resultado >= 0
              ? "green"
              : "red"
          }
        />
  
      </section>
    );
  }