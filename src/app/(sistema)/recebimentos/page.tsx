import { createClient } from '@/lib/supabase/server';

import RecebimentosHeader from '@/components/recebimentos/RecebimentosHeader';
import RecebimentosSummary from '@/components/recebimentos/RecebimentosSummary';
import RecebimentosTable from '@/components/recebimentos/RecebimentosTable';

export const dynamic = 'force-dynamic';

export default async function RecebimentosPage() {
    const supabase = await createClient();
    const { data: recebimentos } = await supabase
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
        .order('vencimento', {
            ascending: true,
        });

    const dados = recebimentos ?? [];

    const recebido = dados
        .filter((r: any) => r.status === 'Pago')
        .reduce((total: number, r: any) => total + Number(r.valor_recebido ?? r.valor), 0);

    const emAberto = dados
        .filter((r: any) => r.status !== 'Pago')
        .reduce((total: number, r: any) => total + Number(r.valor), 0);

    const receberHoje = dados
        .filter((r: any) => {
            const hoje = new Date().toISOString().split('T')[0];

            return r.vencimento === hoje && r.status !== 'Pago';
        })
        .reduce((total: number, r: any) => total + Number(r.valor), 0);

    const atrasados = dados.filter((r: any) => {
        return r.status !== 'Pago' && new Date(r.vencimento) < new Date();
    }).length;

    return (
        <main className="space-y-8">
            <RecebimentosHeader />

            <RecebimentosSummary
                receberHoje={receberHoje}
                emAberto={emAberto}
                recebido={recebido}
                atrasados={atrasados}
            />

            <RecebimentosTable recebimentos={dados} />
        </main>
    );
}
