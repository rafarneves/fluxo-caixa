import { supabase } from "@/lib/supabase";

export async function buscarBeneficioIndicacao(clienteId: string) {
  const { data: indicacoes } = await supabase
    .from("indicacoes")
    .select(
      `
      valor_desconto,
      cliente_indicado
    `
    )
    .eq("cliente_indicador", clienteId);

  if (!indicacoes || indicacoes.length === 0) {
    return 0;
  }

  for (const indicacao of indicacoes) {
    const { data: contrato } = await supabase
      .from("contratos")
      .select("status")
      .eq("cliente_id", indicacao.cliente_indicado)
      .eq("status", "Ativo")
      .maybeSingle();

    if (contrato) {
      return Number(indicacao.valor_desconto);
    }
  }

  return 0;
}
