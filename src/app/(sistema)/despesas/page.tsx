import { createClient } from '@/lib/supabase/server';
import DespesasClient from '@/components/despesas/DespesasClient';

export default async function DespesasPage() {
    const supabase = await createClient();
    const { data: despesas } = await supabase.from('despesas').select('*').order('created_at', {
        ascending: false,
    });

    const dados = despesas ?? [];

    return (
        <main className="space-y-8">
            <div>
                <p className="text-xs font-semibold tracking-[0.20em] text-zinc-500 uppercase">FINANCEIRO</p>

                <h1 className="mt-3 text-5xl font-bold text-white">Despesas</h1>

                <p className="mt-2 text-zinc-400">Controle dos custos operacionais da empresa.</p>
            </div>

            <DespesasClient despesas={dados} />
        </main>
    );
}
