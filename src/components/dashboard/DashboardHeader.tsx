'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';

export default function DashboardHeader() {
    const { empresa } = useConfiguracoes();

    return (
        <PageHeader
            title="Dashboard"
            description={`Bem-vindo ao ERP ${empresa}. Acompanhe em tempo real os principais indicadores financeiros e operacionais da empresa.`}
            actions={
                <Link href="/clientes/novo" prefetch={false}>
                    <Button type="button" icon={<Plus size={18} />}>
                        Novo Cliente
                    </Button>
                </Link>
            }
        />
    );
}
