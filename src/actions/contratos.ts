'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function criarContrato(formData: FormData) {
    const supabase = await createClient();
    const cliente_id = String(formData.get('cliente_id'));

    const nome = String(formData.get('nome'));

    const descricao = String(formData.get('descricao') ?? '');

    const valor = Number(formData.get('valor'));

    const vencimento = Number(formData.get('vencimento'));

    const recorrencia = String(formData.get('recorrencia'));

    const data_inicio = String(formData.get('data_inicio'));

    const data_fim_input = String(formData.get('data_fim') ?? '');

    const { data: contrato, error } = await supabase
        .from('contratos')
        .insert({
            cliente_id,

            nome,

            descricao,

            valor,

            vencimento,

            recorrencia,

            data_inicio,

            data_fim: data_fim_input || null,

            status: 'Ativo',
        })
        .select()
        .single();

    if (error || !contrato) {
        throw new Error('Erro ao criar contrato');
    }

    const recebimentos: any[] = [];

    const inicio = new Date(data_inicio);

    let fim;

    if (data_fim_input) {
        fim = new Date(data_fim_input);
    } else {
        fim = new Date(inicio);

        fim.setMonth(fim.getMonth() + 11);
    }

    let atual = new Date(inicio.getFullYear(), inicio.getMonth(), vencimento);

    while (atual <= fim) {
        recebimentos.push({
            contrato_id: contrato.id,

            competencia: atual.toISOString().slice(0, 7),

            valor,

            valor_original: valor,

            vencimento: atual.toISOString().split('T')[0],

            status: 'Pendente',
        });

        if (recorrencia === 'Mensal') {
            atual.setMonth(atual.getMonth() + 1);
        } else if (recorrencia === 'Trimestral') {
            atual.setMonth(atual.getMonth() + 3);
        } else if (recorrencia === 'Anual') {
            atual.setFullYear(atual.getFullYear() + 1);
        } else {
            atual.setMonth(atual.getMonth() + 1);
        }
    }

    if (recebimentos.length) {
        const { error: erroRecebimentos } = await supabase.from('recebimentos').insert(recebimentos);

        if (erroRecebimentos) {
            throw new Error('Contrato criado, mas erro ao gerar recebimentos');
        }
    }

    revalidatePath('/contratos');

    revalidatePath('/recebimentos');

    revalidatePath('/dashboard');

    revalidatePath(`/contratos/${contrato.id}`);

    return {
        success: true,

        contratoId: contrato.id,
    };
}

export async function cancelarContrato(contratoId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('contratos')
        .update({
            status: 'Cancelado',
        })
        .eq('id', contratoId);

    if (error) {
        throw new Error('Erro ao cancelar contrato');
    }

    await supabase
        .from('recebimentos')
        .update({
            status: 'Cancelado',
        })
        .eq('contrato_id', contratoId);

    revalidatePath('/contratos');

    revalidatePath('/recebimentos');

    revalidatePath('/dashboard');
}
