import { createClient } from '@/lib/supabase/server';
import { obterPeriodo } from '@/lib/periodo';

import DREHeader from '@/components/dre/DREHeader';
import DRESummaryCards from '@/components/dre/DRESummaryCards';
import DREIndicators from '@/components/dre/DREIndicators';
import DREResume from '@/components/dre/DREResume';
import DREComparison from '@/components/dre/DREComparison';
import DRECharts from '@/components/dre/DRECharts';
import DREStatement from '@/components/dre/DREStatement';
import DREExpenseBreakdown from '@/components/dre/DREExpenseBreakdown';

export const dynamic = 'force-dynamic';

type Props = {
    searchParams?: Promise<{
        periodo?: string;
    }>;
};

export default async function DREPage({ searchParams }: Props) {
    const supabase = await createClient();
    const { periodo = 'mes' } = (await searchParams) ?? {};

    const { inicio, fim } = obterPeriodo(periodo);

    const inicioISO = inicio.toISOString().split('T')[0];
    const fimISO = fim.toISOString().split('T')[0];

    // Mês de início e fim no formato YYYY-MM para comparar com campo "competencia"
    const inicioMes = inicioISO.slice(0, 7);
    const fimMes = fimISO.slice(0, 7);

    const [{ data: recebimentos }, { data: despesas }, { data: custosContrato }] = await Promise.all([
        supabase
            .from('recebimentos')
            .select('valor, competencia')
            .eq('status', 'Pago')
            .gte('competencia', inicioMes)
            .lte('competencia', fimMes),

        supabase.from('despesas').select('categoria, valor, data').gte('data', inicioISO).lte('data', fimISO),

        supabase.from('custos_contrato').select('valor, data').gte('data', inicioISO).lte('data', fimISO),
    ]);

    const receitaBruta = recebimentos?.reduce((acc, item) => acc + Number(item.valor || 0), 0) || 0;

    const custos = custosContrato?.reduce((acc, item) => acc + Number(item.valor || 0), 0) || 0;

    const despesasOperacionais = despesas?.reduce((acc, item) => acc + Number(item.valor || 0), 0) || 0;

    const lucroBruto = receitaBruta - custos;

    const lucroLiquido = lucroBruto - despesasOperacionais;

    const margem = receitaBruta > 0 ? (lucroLiquido / receitaBruta) * 100 : 0;

    const meses: Record<
        string,
        {
            mes: string;
            receita: number;
            lucro: number;
        }
    > = {};

    recebimentos?.forEach((item: any) => {
        const mes = item.competencia || 'Sem mês';

        if (!meses[mes]) {
            meses[mes] = {
                mes,
                receita: 0,
                lucro: 0,
            };
        }

        meses[mes].receita += Number(item.valor || 0);
    });

    despesas?.forEach((item: any) => {
        const mes = item.data?.slice(0, 7) || 'Sem mês';

        if (!meses[mes]) {
            meses[mes] = {
                mes,
                receita: 0,
                lucro: 0,
            };
        }

        meses[mes].lucro -= Number(item.valor || 0);
    });

    custosContrato?.forEach((item: any) => {
        const mes = item.data?.slice(0, 7) || 'Sem mês';

        if (!meses[mes]) {
            meses[mes] = {
                mes,
                receita: 0,
                lucro: 0,
            };
        }

        meses[mes].lucro -= Number(item.valor || 0);
    });

    const dadosGrafico = Object.values(meses)
        .map((item) => ({
            mes: item.mes,
            receita: item.receita,
            lucro: item.receita + item.lucro,
        }))
        .sort((a, b) => a.mes.localeCompare(b.mes));

    // Agrupar despesas por categoria para o PDF
    const despesasAgrupadas: Record<string, number> = {};
    (despesas ?? []).forEach((d: any) => {
        const cat = d.categoria || 'Outros';
        despesasAgrupadas[cat] = (despesasAgrupadas[cat] || 0) + Number(d.valor);
    });
    const despesasPorCategoria = Object.entries(despesasAgrupadas)
        .map(([categoria, valor]) => ({ categoria, valor }))
        .sort((a, b) => b.valor - a.valor);

    return (
        <main className="space-y-8">
            <DREHeader
                receitaBruta={receitaBruta}
                custos={custos}
                despesasOperacionais={despesasOperacionais}
                lucroLiquido={lucroLiquido}
                margem={margem}
                periodo={periodo}
                despesasPorCategoria={despesasPorCategoria}
            />

            <DRESummaryCards receitaBruta={receitaBruta} custos={custos} lucroLiquido={lucroLiquido} margem={margem} />

            <DREIndicators
                receitaBruta={receitaBruta}
                custos={custos}
                despesasOperacionais={despesasOperacionais}
                lucroLiquido={lucroLiquido}
            />

            <DREResume
                receitaBruta={receitaBruta}
                custos={custos}
                despesasOperacionais={despesasOperacionais}
                lucroLiquido={lucroLiquido}
                margem={margem}
            />

            <DREComparison receitaBruta={receitaBruta} lucroLiquido={lucroLiquido} margem={margem} />

            <DRECharts dados={dadosGrafico} />

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <DREStatement
                        receitaBruta={receitaBruta}
                        custos={custos}
                        despesasOperacionais={despesasOperacionais}
                        despesas={despesas ?? []}
                    />
                </div>

                <div>
                    <DREExpenseBreakdown despesas={despesas ?? []} />
                </div>
            </div>
        </main>
    );
}
