'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function marcarComoPago(id: string) {
    const supabase = await createClient();
    await supabase
        .from('recebimentos')
        .update({
            status: 'Pago',

            data_pagamento: new Date().toISOString().split('T')[0],

            valor_recebido: null,
        })
        .eq('id', id);

    revalidatePath('/recebimentos');
}
