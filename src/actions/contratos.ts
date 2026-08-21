'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function criarContrato(formData: FormData) {
    const supabase = await createClient();
    const cliente_id = String(formData.get('cliente_id'));

    const plano = String(formData.get('plano') ?? '').trim();

    if (!plano) {
        throw new Error('Informe o plano do contrato');
    }

    const loja = String(formData.get('loja') ?? '').trim();

    if (!loja) {
        throw new Error('Informe o nome da loja');
    }

    const descricao = String(formData.get('descricao') ?? '');

    const valor = Number(formData.get('valor'));

    const vencimento = Number(formData.get('vencimento'));

    const fidelidade_meses = Number(formData.get('fidelidade_meses'));

    if (!Number.isInteger(fidelidade_meses) || fidelidade_meses < 1 || fidelidade_meses > 24) {
        throw new Error('A fidelidade contratual deve ser de 1 a 24 meses');
    }

    const data_inicio = String(formData.get('data_inicio'));

    const data_fim_input = String(formData.get('data_fim') ?? '');

    // Uma cobranca por mes durante toda a fidelidade, sempre no dia de vencimento
    // escolhido (ajustado quando o mes nao tem esse dia).
    const [anoInicio, mesInicio] = data_inicio.split('-').map(Number);

    const doisDigitos = (numero: number) => String(numero).padStart(2, '0');

    const competencias = Array.from({ length: fidelidade_meses }, (_, indice) => {
        const base = new Date(Date.UTC(anoInicio, mesInicio - 1 + indice, 1));

        const ano = base.getUTCFullYear();

        const mes = base.getUTCMonth() + 1;

        const ultimoDia = new Date(Date.UTC(ano, mes, 0)).getUTCDate();

        return {
            competencia: `${ano}-${doisDigitos(mes)}`,

            vencimento: `${ano}-${doisDigitos(mes)}-${doisDigitos(Math.min(vencimento, ultimoDia))}`,
        };
    });

    const data_fim = data_fim_input || competencias[competencias.length - 1].vencimento;

    const { data: contrato, error } = await supabase
        .from('contratos')
        .insert({
            cliente_id,

            nome: plano,

            loja,

            descricao,

            valor,

            vencimento,

            fidelidade_meses,

            data_inicio,

            data_fim,

            status: 'Ativo',
        })
        .select()
        .single();

    if (error || !contrato) {
        throw new Error('Erro ao criar contrato');
    }

    const recebimentos = competencias.map((parcela) => ({
        contrato_id: contrato.id,

        competencia: parcela.competencia,

        valor,

        valor_original: valor,

        vencimento: parcela.vencimento,

        status: 'Pendente',
    }));

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
