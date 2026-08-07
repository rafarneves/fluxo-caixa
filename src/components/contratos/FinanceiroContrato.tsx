import Link from "next/link";
import { supabase } from "@/lib/supabase";
import CardsFinanceiros from "./CardsFinanceiros";
import HistoricoCustos from "./HistoricoCustos";
import NovoCustoContrato from "./NovoCustoContrato";

type Props = {
  contratoId: string;
  receita: number;
};

export default async function FinanceiroContrato({
  contratoId,
  receita,
}: Props) {
  const { data: custos } = await supabase
    .from("custos_contrato")
    .select(`
      id,
      descricao,
      valor
    `)
    .eq("contrato_id", contratoId)
    .order("created_at", {
      ascending: false,
    });

  const custosData = custos ?? [];

  const totalCustos = custosData.reduce(
    (total: number, custo: any) =>
      total + Number(custo.valor),
    0
  );

  return (
    <section className="space-y-8">
      <CardsFinanceiros
        receita={receita}
        custos={totalCustos}
      />

      <div className="flex justify-end">
        <Link
          href={`/contratos/${contratoId}/custos/novo`}
          className="
            inline-flex
            items-center
            rounded-xl
            bg-green-500
            px-5
            py-3
            font-semibold
            text-black
            transition
            hover:bg-green-400
          "
        >
          + Adicionar Custo
        </Link>
      </div>

      <NovoCustoContrato
        contratoId={contratoId}
      />

      <HistoricoCustos
        custos={custosData}
      />
    </section>
  );
}