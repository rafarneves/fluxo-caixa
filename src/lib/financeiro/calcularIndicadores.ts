import { calcularFinanceiro } from "@/lib/financeiro";

type DadosFinanceiros = {
  clientes: any[];
  contratos: any[];
  recebimentos: any[];
  despesas: any[];
  custosContrato: any[];
};

export function calcularIndicadores({
  clientes,
  contratos,
  recebimentos,
  despesas,
  custosContrato,
}: DadosFinanceiros) {
  const financeiro = calcularFinanceiro(recebimentos);

  const totalClientes = clientes.length;

  const contratosAtivos = contratos.length;

  const faturamentoMensal = contratos.reduce(
    (total, contrato) => total + Number(contrato.valor),
    0
  );

  const despesasTotal = despesas.reduce(
    (total, despesa) => total + Number(despesa.valor),
    0
  );

  const custosTotal = custosContrato.reduce(
    (total, custo) => total + Number(custo.valor),
    0
  );

  const totalSaidas = despesasTotal + custosTotal;

  const lucro = financeiro.recebido - totalSaidas;

  const ticketMedio =
    contratosAtivos === 0
      ? 0
      : faturamentoMensal / contratosAtivos;

  const margem =
    financeiro.recebido === 0
      ? 0
      : (lucro / financeiro.recebido) * 100;

  const atividades = [
    ...clientes.slice(0, 3).map((cliente: any) => ({
      id: cliente.id,
      titulo: "Novo cliente cadastrado",
      descricao: cliente.nome,
      data: new Date(cliente.created_at).toLocaleDateString("pt-BR"),
      tipo: "cliente" as const,
    })),

    ...recebimentos
      .filter((r: any) => r.status === "Pago")
      .slice(0, 3)
      .map((r: any) => ({
        id: r.id,
        titulo: "Pagamento recebido",
        descricao: r.contratos?.clientes?.nome ?? "Cliente",
        data: "Recente",
        tipo: "pagamento" as const,
      })),
  ].slice(0, 6);

  return {
    totalClientes,
    contratosAtivos,

    faturamentoMensal,

    recebido: financeiro.recebido,
    emAberto: financeiro.emAberto,
    atrasados: financeiro.atrasadosValor,

    percentualRecebimento:
      financeiro.percentualRecebimento,

    despesasTotal,

    custosTotal,

    totalSaidas,

    lucro,

    margem,

    ticketMedio,

    atividades,
  };
}