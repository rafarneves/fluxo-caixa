import { supabase } from "./supabase";
import { calcularFinanceiro } from "./financeiro";

export async function calcularFinanceiroEmpresa() {
  // Clientes
  const { data: clientes } = await supabase
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false });

  // Contratos
  const { data: contratos } = await supabase
    .from("contratos")
    .select(
      `
      *,
      clientes(nome)
    `
    )
    .eq("status", "Ativo");

  // Recebimentos
  const { data: recebimentos } = await supabase
    .from("recebimentos")
    .select(
      `
      *,
      contratos(
        nome,
        clientes(nome)
      )
    `
    )
    .order("vencimento", { ascending: true });

  // Despesas
  const { data: despesas } = await supabase.from("despesas").select("*");

  // Custos dos contratos
  const { data: custosContrato } = await supabase.from("custos_contrato").select("*");

  const clientesData = clientes ?? [];
  const contratosData = contratos ?? [];
  const recebimentosData = recebimentos ?? [];
  const despesasData = despesas ?? [];
  const custosData = custosContrato ?? [];

  const financeiro = calcularFinanceiro(recebimentosData);

  // Totais
  const totalClientes = clientesData.length;

  const contratosAtivos = contratosData.length;

  const faturamentoMensal = contratosData.reduce(
    (total: number, contrato: any) => total + Number(contrato.valor),
    0
  );

  const despesasTotal = despesasData.reduce(
    (total: number, despesa: any) => total + Number(despesa.valor),
    0
  );

  const custosTotal = custosData.reduce(
    (total: number, custo: any) => total + Number(custo.valor),
    0
  );

  const totalSaidas = despesasTotal + custosTotal;

  const lucro = financeiro.recebido - totalSaidas;

  const ticketMedio = contratosAtivos === 0 ? 0 : faturamentoMensal / contratosAtivos;

  const margem = financeiro.recebido === 0 ? 0 : (lucro / financeiro.recebido) * 100;

  // Atividades recentes
  const atividades = [
    ...clientesData.slice(0, 3).map((cliente: any) => ({
      id: cliente.id,
      titulo: "Novo cliente cadastrado",
      descricao: cliente.nome,
      data: new Date(cliente.created_at).toLocaleDateString("pt-BR"),
      tipo: "cliente" as const,
    })),

    ...recebimentosData
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
    // Dados
    clientes: clientesData,
    contratos: contratosData,
    recebimentos: recebimentosData,
    despesas: despesasData,
    custos: custosData,
    atividades,

    // Totais
    totalClientes,
    contratosAtivos,
    faturamentoMensal,
    ticketMedio,

    // Financeiro
    recebido: financeiro.recebido,
    emAberto: financeiro.emAberto,
    atrasados: financeiro.atrasadosValor,
    percentualRecebimento: financeiro.percentualRecebimento,

    // Custos
    despesasTotal,
    custosTotal,
    totalSaidas,

    // Resultado
    lucro,
    margem,
  };
}
