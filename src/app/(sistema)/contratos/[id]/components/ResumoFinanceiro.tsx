'use client';

import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import ResponsiveGrid from '@/components/ui/ResponsiveGrid';
import StatCard from '@/components/ui/StatCard';

export default function ResumoFinanceiro({ receita, custos }: { receita: number; custos: number }) {
    const formatMoney = useConfiguracoes().formatarMoeda;
    const lucro = receita - custos;
    const margem = receita === 0 ? 0 : (lucro / receita) * 100;
    return (
        <ResponsiveGrid>
            <StatCard titulo="Receita Mensal" valor={formatMoney(receita)} cor="green" />
            <StatCard titulo="Custos" valor={formatMoney(custos)} cor="red" />
            <StatCard titulo="Lucro" valor={formatMoney(lucro)} cor={lucro >= 0 ? 'green' : 'red'} />
            <StatCard titulo="Margem" valor={`${margem.toFixed(1)}%`} cor={margem >= 0 ? 'green' : 'red'} />
        </ResponsiveGrid>
    );
}
