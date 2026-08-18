'use client';

import { Users, FileText, Wallet, Landmark } from 'lucide-react';

import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import StatCard from '@/components/ui/StatCard';
import ResponsiveGrid from '@/components/ui/ResponsiveGrid';

type Props = {
    totalClientes: number;
    contratosAtivos: number;
    faturamentoMensal: number;
    emAberto: number;
};

export default function DashboardMetrics({ totalClientes, contratosAtivos, faturamentoMensal, emAberto }: Props) {
    const { formatarMoedaCompacta } = useConfiguracoes();

    return (
        <ResponsiveGrid>
            <StatCard
                titulo="Clientes"

                valor={totalClientes.toString()}

                subtitulo="Clientes cadastrados"

                status="Ativos"

                tendencia="Carteira atual"

                progresso={100}

                cor="blue"

                icone={<Users size={22} />}
            />

            <StatCard
                titulo="Contratos"

                valor={contratosAtivos.toString()}

                subtitulo="Contratos ativos"

                status="Em andamento"

                tendencia="Operação"

                progresso={100}

                cor="green"

                icone={<FileText size={22} />}
            />

            <StatCard
                titulo="Faturamento"

                valor={formatarMoedaCompacta(faturamentoMensal)}

                subtitulo="Receita do período"

                status="Receita"

                tendencia="Financeiro"

                progresso={100}

                cor="yellow"

                icone={<Wallet size={22} />}
            />

            <StatCard
                titulo="Em Aberto"

                valor={formatarMoedaCompacta(emAberto)}

                subtitulo="Valores a receber"

                status="Cobranças"

                tendencia="Pendências"

                progresso={faturamentoMensal > 0 ? (emAberto / faturamentoMensal) * 100 : 0}

                cor="red"

                icone={<Landmark size={22} />}
            />
        </ResponsiveGrid>
    );
}
