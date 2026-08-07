'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function editarDespesa(id: string, formData: FormData) {
    const supabase = await createClient();
    const tipo = formData.get('tipo');

    await supabase
        .from('despesas')
        .update({
            descricao: formData.get('descricao'),

            categoria: formData.get('categoria'),

            tipo,

            valor: Number(formData.get('valor')),

            data: tipo === 'Variável' ? formData.get('data') : null,

            dia_vencimento: tipo === 'Fixa' ? Number(formData.get('dia_vencimento')) : null,
        })
        .eq('id', id);

    revalidatePath('/despesas');

    redirect('/despesas');
}
