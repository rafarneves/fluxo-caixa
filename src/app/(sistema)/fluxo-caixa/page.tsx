import { createClient } from '@/lib/supabase/server';

import FluxoHeader from '@/components/fluxo-caixa/FluxoHeader';
import FluxoSummary from '@/components/fluxo-caixa/FluxoSummary';
import EntradasCard from '@/components/fluxo-caixa/EntradasCard';
import SaidasCard from '@/components/fluxo-caixa/SaidasCard';

export const dynamic = 'force-dynamic';

export default async function FluxoCaixaPage() {
    const supabase = await createClient();
    const [{ data: recebimentos }, { data: despesas }, { data: custos }] = await Promise.all([
        supabase
            .from('recebimentos')
            .select(
                `
      *,
      contratos (
        nome,
        clientes (
          nome
        )
      )
    `
            )
            .eq('status', 'Pago'),
        supabase.from('despesas').select('*'),
        supabase.from('custos_contrato').select('*'),
    ]);

    const recebimentosData = recebimentos ?? [];
    const despesasData = despesas ?? [];
    const custosData = custos ?? [];

    const entradas = recebimentosData.reduce((total: number, r: any) => total + Number(r.valor), 0);

    const despesasFixas = despesasData
        .filter((d: any) => d.tipo === 'Fixa')
        .reduce((total: number, d: any) => total + Number(d.valor), 0);

    const despesasVariaveis = despesasData
        .filter((d: any) => d.tipo === 'Variável')
        .reduce((total: number, d: any) => total + Number(d.valor), 0);

    const custosContratos = custosData.reduce((total: number, c: any) => total + Number(c.valor), 0);

    const resultado = entradas - despesasFixas - despesasVariaveis - custosContratos;

    return (
        <main className="space-y-8">
            <FluxoHeader />

            <FluxoSummary
                entradas={entradas}
                despesasFixas={despesasFixas}
                despesasVariaveis={despesasVariaveis}
                custosContratos={custosContratos}
                resultado={resultado}
            />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <EntradasCard recebimentos={recebimentosData} />

                <SaidasCard despesas={despesasData} />
            </div>
        </main>
    );
}
