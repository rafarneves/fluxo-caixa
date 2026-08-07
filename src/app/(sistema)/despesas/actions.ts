'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function excluirDespesa(id: string) {
    const supabase = await createClient();
    await supabase.from('despesas').delete().eq('id', id);

    revalidatePath('/despesas');
}
