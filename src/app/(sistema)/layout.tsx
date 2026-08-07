import { type ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { ConfiguracoesProvider } from '@/components/configuracoes/ConfiguracoesProvider';
import Sidebar from '@/components/Sidebar';
import { getContextoConfiguracoes } from '@/lib/configuracoes-server';

export default async function SistemaLayout({ children }: { children: ReactNode }) {
    const { user, configuracoes } = await getContextoConfiguracoes();

    if (!user) redirect('/login');

    return (
        <ConfiguracoesProvider configuracoes={configuracoes}>
            <div className="flex min-h-screen bg-[#0B0F14] text-white">
                <Sidebar userEmail={user.email ?? 'Administrador'} />

                <main className="erp-content flex-1 overflow-auto p-10">{children}</main>
            </div>
        </ConfiguracoesProvider>
    );
}
