'use client';

import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';

import type { Configuracoes } from '@/lib/configuracoes';

type ConfiguracoesContextValue = Configuracoes & {
    formatarMoeda: (valor: number) => string;
    formatarMoedaCompacta: (valor: number) => string;
    formatarData: (data: string | Date) => string;
};

const ConfiguracoesContext = createContext<ConfiguracoesContextValue | null>(null);

export function ConfiguracoesProvider({
    configuracoes,
    children,
}: {
    configuracoes: Configuracoes;
    children: ReactNode;
}) {
    useEffect(() => {
        document.documentElement.dataset.interfaceCompacta = String(configuracoes.interfaceCompacta);

        return () => {
            delete document.documentElement.dataset.interfaceCompacta;
        };
    }, [configuracoes.interfaceCompacta]);

    const value = useMemo<ConfiguracoesContextValue>(
        () => ({
            ...configuracoes,
            formatarMoeda: (valor) =>
                new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: configuracoes.moeda,
                }).format(valor),
            formatarMoedaCompacta: (valor) =>
                new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: configuracoes.moeda,
                    notation: 'compact',
                    maximumFractionDigits: 1,
                }).format(valor),
            formatarData: (data) =>
                new Intl.DateTimeFormat('pt-BR', {
                    timeZone: configuracoes.fusoHorario,
                }).format(new Date(data)),
        }),
        [configuracoes]
    );

    return <ConfiguracoesContext.Provider value={value}>{children}</ConfiguracoesContext.Provider>;
}

export function useConfiguracoes() {
    const context = useContext(ConfiguracoesContext);

    if (!context) {
        throw new Error('useConfiguracoes deve ser usado dentro de ConfiguracoesProvider.');
    }

    return context;
}
