'use client';

import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

type ReportKPIValueProps = {
    value: string | number;
    isCurrency: boolean;
};

export default function ReportKPIValue({ value, isCurrency }: ReportKPIValueProps) {
    const { formatarMoedaCompacta } = useConfiguracoes();

    if (typeof value !== 'number') return value;

    return isCurrency ? formatarMoedaCompacta(value) : value.toLocaleString('pt-BR');
}
