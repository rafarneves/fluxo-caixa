import { redirect } from 'next/navigation';

import { getContextoConfiguracoes } from '@/lib/configuracoes-server';
import ConfiguracoesForm from './ConfiguracoesForm';

export default async function ConfiguracoesPage() {
    const { user, configuracoes } = await getContextoConfiguracoes();

    if (!user) redirect('/login');

    return <ConfiguracoesForm configuracoesIniciais={configuracoes} />;
}
