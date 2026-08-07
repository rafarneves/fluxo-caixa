import { supabase } from "@/lib/supabase";

export async function buscarDadosFinanceiros() {
  const [
    { data: clientes, error: clientesError },
    { data: contratos, error: contratosError },
    { data: recebimentos, error: recebimentosError },
    { data: despesas, error: despesasError },
    { data: custosContrato, error: custosError },
  ] = await Promise.all([
    supabase.from("clientes").select("*").order("created_at", { ascending: false }),

    supabase.from("contratos").select(`
        *,
        clientes(nome)
      `),

    supabase
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
      .order("vencimento", { ascending: true }),

    supabase.from("despesas").select("*"),

    supabase.from("custos_contrato").select(`
        *,
        contratos(
          id,
          nome,
          clientes(nome)
        )
      `),
  ]);

  if (clientesError || contratosError || recebimentosError || despesasError || custosError) {
    throw new Error("Erro ao buscar informações financeiras do sistema.");
  }

  return {
    clientes: clientes ?? [],
    contratos: contratos ?? [],
    recebimentos: recebimentos ?? [],
    despesas: despesas ?? [],
    custosContrato: custosContrato ?? [],
  };
}
