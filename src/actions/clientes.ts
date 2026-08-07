'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function inativarCliente(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('clientes')
        .update({
            status: 'Inativo',
        })
        .eq('id', id);

    if (error) {
        return;
    }

    revalidatePath('/clientes');
    revalidatePath('/dashboard');
    revalidatePath('/contas-receber');
}
