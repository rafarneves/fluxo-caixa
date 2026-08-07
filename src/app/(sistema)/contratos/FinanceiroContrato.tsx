import { createClient } from '@/lib/supabase/server';
import CardsFinanceiros from './CardsFinanceiros';
import HistoricoCustos from './HistoricoCustos';

type Props = {
    contratoId: string;
    receita: number;
};

export default async function FinanceiroContrato({ contratoId, receita }: Props) {
    const supabase = await createClient();
    const { data: custos } = await supabase
        .from('custos_contrato')
        .select(
            `
      id,
      descricao,
      valor
    `
        )
        .eq('contrato_id', contratoId)
        .order('created_at', {
            ascending: false,
        });

    const custosData = custos ?? [];

    const totalCustos = custosData.reduce((total: number, custo: any) => total + Number(custo.valor), 0);

    return (
        <section className="space-y-8">
            <CardsFinanceiros receita={receita} custos={totalCustos} />

            <HistoricoCustos custos={custosData} />
        </section>
    );
}
