import 'server-only';

import { cache } from 'react';

import {
    configuracoesIniciais,
    configuracoesParaRow,
    rowParaConfiguracoes,
    type Configuracoes,
    type ConfiguracoesRow,
} from '@/lib/configuracoes';
import { createClient } from '@/lib/supabase/server';

export const getContextoConfiguracoes = cache(async () => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { user: null, configuracoes: configuracoesIniciais };
    }

    const { data: existente } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('usuario_id', user.id)
        .maybeSingle();

    let configuracoes = rowParaConfiguracoes(existente as ConfiguracoesRow | null);

    if (!existente) {
        const { data } = await supabase
            .from('configuracoes')
            .upsert(configuracoesParaRow(configuracoesIniciais, user.id), {
                onConflict: 'usuario_id',
            })
            .select()
            .single();

        configuracoes = rowParaConfiguracoes(data as ConfiguracoesRow | null);
    }

    return { user, configuracoes };
});

export function formatarMoedaServidor(valor: number, configuracoes: Configuracoes, compacta = false) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: configuracoes.moeda,
        ...(compacta ? { notation: 'compact' as const, maximumFractionDigits: 1 } : {}),
    }).format(valor);
}

export function formatarDataServidor(data: string | Date, configuracoes: Configuracoes) {
    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: configuracoes.fusoHorario,
    }).format(new Date(data));
}
