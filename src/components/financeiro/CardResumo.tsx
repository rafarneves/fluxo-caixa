interface CardResumoProps {
    titulo: string;
    valor: number;
    cor: string;
}

export default function CardResumo({ titulo, valor, cor }: CardResumoProps) {
    const { formatarMoeda } = useConfiguracoes();

    return (
        <div className="rounded-2xl bg-[#161B22] p-6">
            <p className="text-sm text-zinc-400">{titulo}</p>

            <h2 className={`mt-2 text-3xl font-bold ${cor}`}>{formatarMoeda(valor)}</h2>
        </div>
    );
}
('use client');

import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
