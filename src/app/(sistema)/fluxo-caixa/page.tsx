import { createClient } from '@/lib/supabase/server';

import FluxoHeader from '@/components/fluxo-caixa/FluxoHeader';
import FluxoCaixaClient from '@/components/fluxo-caixa/FluxoCaixaClient';

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
          nome,
          loja
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

    return (
        <main className="space-y-8">
            <FluxoHeader />
            <FluxoCaixaClient 
                recebimentos={recebimentosData}
                despesas={despesasData}
                custos={custosData}
            />
        </main>
    );
}
