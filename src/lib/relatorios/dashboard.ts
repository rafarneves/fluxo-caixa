import { buscarDadosFinanceiros } from "@/lib/financeiro/buscarDados";
import { calcularIndicadores } from "@/lib/financeiro/calcularIndicadores";

function getMesAno(data: string | Date) {
  const d = new Date(data);

  return d.toLocaleDateString("pt-BR", {
    month: "short",
    year: "2-digit",
  });
}

export async function getDashboardExecutivo() {
  const dados = await buscarDadosFinanceiros();

  const indicadores = calcularIndicadores(dados);

  const mapa = new Map<
    string,
    {
      mes: string;
      recebido: number;
      despesas: number;
      custos: number;
    }
  >();

  dados.recebimentos
    .filter((r: any) => r.status === "Pago")
    .forEach((r: any) => {
      const chave = getMesAno(r.vencimento);

      if (!mapa.has(chave)) {
        mapa.set(chave, {
          mes: chave,
          recebido: 0,
          despesas: 0,
          custos: 0,
        });
      }

      mapa.get(chave)!.recebido += Number(r.valor);
    });

  dados.despesas.forEach((d: any) => {
    if (!d.data) return;

    const chave = getMesAno(d.data);

    if (!mapa.has(chave)) {
      mapa.set(chave, {
        mes: chave,
        recebido: 0,
        despesas: 0,
        custos: 0,
      });
    }

    mapa.get(chave)!.despesas += Number(d.valor);
  });

  dados.custosContrato.forEach((c: any) => {
    if (!c.data) return;

    const chave = getMesAno(c.data);

    if (!mapa.has(chave)) {
      mapa.set(chave, {
        mes: chave,
        recebido: 0,
        despesas: 0,
        custos: 0,
      });
    }

    mapa.get(chave)!.custos += Number(c.valor);
  });

  const grafico = Array.from(mapa.values()).map((item) => ({
    ...item,
    lucro: item.recebido - item.despesas - item.custos,
  }));

  grafico.sort((a, b) => a.mes.localeCompare(b.mes));

  const resumo = {
    clientes: indicadores.totalClientes,
    contratos: indicadores.contratosAtivos,
    ticketMedio: indicadores.ticketMedio,
    recebimentosPendentes: indicadores.emAberto,
    faturamento: indicadores.faturamentoMensal,
    lucro: indicadores.lucro,
  };

  const kpis = {
    recebido: indicadores.recebido,
    emAberto: indicadores.emAberto,
    despesas: indicadores.despesasTotal,
    custos: indicadores.custosTotal,
    lucro: indicadores.lucro,
    margem: indicadores.margem,
    faturamento: indicadores.faturamentoMensal,
    ticketMedio: indicadores.ticketMedio,
  };

  return {
    ...dados,
    ...indicadores,
    grafico,
    resumo,
    kpis,
  };
}