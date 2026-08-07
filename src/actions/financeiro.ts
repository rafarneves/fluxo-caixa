'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function receberRecebimento(recebimentoId: string) {
    const supabase = await createClient();
    const hoje = new Date().toISOString().split('T')[0];

    const { data: recebimento, error } = await supabase
        .from('recebimentos')
        .select('valor')
        .eq('id', recebimentoId)
        .single();

    if (error || !recebimento) {
        throw new Error('Erro ao buscar recebimento');
    }

    const { error: updateError } = await supabase
        .from('recebimentos')
        .update({
            status: 'Pago',

            data_pagamento: hoje,

            valor_recebido: Number(recebimento.valor),
        })
        .eq('id', recebimentoId);

    if (updateError) {
        throw new Error('Erro ao atualizar recebimento');
    }

    revalidatePath('/contas-receber');

    revalidatePath('/recebimentos');

    revalidatePath('/fluxo-caixa');
}
