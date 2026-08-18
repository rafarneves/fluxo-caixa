import { type ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { ConfiguracoesProvider } from '@/components/configuracoes/ConfiguracoesProvider';
import Sidebar from '@/components/Sidebar';
import { getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { getNotificacoesSistema } from '@/lib/notificacoes-server';

export default async function SistemaLayout({ children }: { children: ReactNode }) {
    const { user, configuracoes } = await getContextoConfiguracoes();

    if (!user) redirect('/login');

    const notificacoes = await getNotificacoesSistema(configuracoes);

    return (
        <ConfiguracoesProvider configuracoes={configuracoes}>
            <Sidebar userEmail={user.email ?? 'Administrador'} notificacoesIniciais={notificacoes}>
                {children}
            </Sidebar>
        </ConfiguracoesProvider>
    );
}
