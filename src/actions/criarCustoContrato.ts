'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function criarCustoContrato(formData: FormData) {
    const supabase = await createClient();
    const contratoId = String(formData.get('contrato_id'));

    const descricao = String(formData.get('descricao'));

    const valor = Number(formData.get('valor'));

    const tipo = descricao === 'Tráfego Pago' ? 'Mídia' : 'Operacional';

    const { error } = await supabase.from('custos_contrato').insert({
        contrato_id: contratoId,
        descricao,
        valor,
        tipo,
        categoria: 'Custo',
        recorrente: false,
        competencia: new Date().toISOString().slice(0, 7),
        observacao: '',
    });

    if (error) {
        console.error(error);
        throw new Error('Erro ao cadastrar custo.');
    }

    revalidatePath(`/contratos/${contratoId}`);
    revalidatePath('/rentabilidade');
    revalidatePath('/custos');
}
