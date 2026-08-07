import {
    CalendarClock,
    Wallet,
    BadgeDollarSign,
    AlertTriangle,
  } from "lucide-react";
  
  import StatCard from "@/components/ui/StatCard";
  
  type Props = {
    receberHoje: number;
    emAberto: number;
    recebido: number;
    atrasados: number;
  };
  
  function moeda(valor: number) {
    if (valor >= 1000000) {
      return `R$ ${(valor / 1000000).toFixed(1)}M`;
    }
  
    if (valor >= 1000) {
      return `R$ ${(valor / 1000).toFixed(1)}k`;
    }
  
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
  
  export default function RecebimentosSummary({
    receberHoje,
    emAberto,
    recebido,
    atrasados,
  }: Props) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
  
        <StatCard
          titulo="Receber Hoje"
          valor={moeda(receberHoje)}
          subtitulo="Vencimentos do dia"
          icone={<CalendarClock size={22} />}
          status="Hoje"
          tendencia="Recebimentos previstos"
          progresso={100}
          cor="blue"
        />
  
        <StatCard
          titulo="Em Aberto"
          valor={moeda(emAberto)}
          subtitulo="Valores pendentes"
          icone={<Wallet size={22} />}
          status="Pendente"
          tendencia="Cobranças abertas"
          progresso={70}
          cor="yellow"
        />
  
        <StatCard
          titulo="Recebido"
          valor={moeda(recebido)}
          subtitulo="Valores confirmados"
          icone={<BadgeDollarSign size={22} />}
          status="Pago"
          tendencia="Receita recebida"
          progresso={100}
          cor="green"
        />
  
        <StatCard
          titulo="Atrasados"
          valor={String(atrasados)}
          subtitulo="Cobranças vencidas"
          icone={<AlertTriangle size={22} />}
          status={atrasados > 0 ? "Atenção" : "Controlado"}
          tendencia={
            atrasados > 0
              ? "Necessita cobrança"
              : "Sem pendências"
          }
          progresso={Math.min(atrasados * 10, 100)}
          cor={atrasados > 0 ? "red" : "green"}
        />
  
      </section>
    );
  }