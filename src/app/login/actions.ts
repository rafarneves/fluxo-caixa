'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { configuracoesIniciais, configuracoesParaRow } from '@/lib/configuracoes';
import { createClient } from '@/lib/supabase/server';

export type LoginState = {
    error?: string;
};

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!email || !password) {
        return { error: 'Informe o e-mail e a senha.' };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return { error: 'E-mail ou senha inválidos.' };
    }

    if (data.user) {
        const { error: configuracaoError } = await supabase
            .from('configuracoes')
            .upsert(configuracoesParaRow(configuracoesIniciais, data.user.id), {
                onConflict: 'usuario_id',
                ignoreDuplicates: true,
            });

        if (configuracaoError) {
            await supabase.auth.signOut();
            return {
                error: 'Login válido, mas não foi possível associar as configurações. Execute as migrations do Supabase.',
            };
        }
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/login');
}
