import { supabase } from "@/lib/supabase";
import { buscarBeneficioIndicacao } from "@/lib/indicacoes";

export async function gerarRecebimentosContrato({
  contratoId,
  clienteId,
  valor,
  vencimento,
  duracao,
}: {
  contratoId: string;
  clienteId: string;
  valor: number;
  vencimento: number;
  duracao: number;
}) {

  const descontoIndicacao =
    await buscarBeneficioIndicacao(clienteId);


  const valorFinal =
    valor - descontoIndicacao;



  for (let i = 0; i < duracao; i++) {

    const competenciaData = new Date();


    competenciaData.setMonth(
      competenciaData.getMonth() + i
    );


    const competencia =
      `${String(
        competenciaData.getMonth() + 1
      ).padStart(2, "0")}/${competenciaData.getFullYear()}`;



    const dataVencimento =
      new Date(
        competenciaData.getFullYear(),
        competenciaData.getMonth(),
        vencimento
      );



    const { error } = await supabase
      .from("recebimentos")
      .insert({

        contrato_id: contratoId,

        competencia,

        valor_original: valor,

        desconto_indicacao:
          descontoIndicacao,

        valor:
          valorFinal,

        vencimento:
          dataVencimento
          .toISOString()
          .split("T")[0],

        status: "Pendente",

      });



    if (error) {
      throw error;
    }

  }

}