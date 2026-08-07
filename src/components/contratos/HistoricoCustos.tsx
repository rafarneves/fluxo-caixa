type Custo = {
    id: string;
    descricao: string;
    valor: number;
};

type Props = {
    custos: Custo[];
};

export default function HistoricoCustos({ custos }: Props) {
    const formatMoney = useConfiguracoes().formatarMoeda;
    return (
        <div className="rounded-3xl border border-zinc-800 bg-[#161B22] p-8">
            <h2 className="mb-6 text-2xl font-bold">Histórico de Custos</h2>

            {custos.length === 0 ? (
                <p className="text-zinc-500">Nenhum custo cadastrado.</p>
            ) : (
                <div className="space-y-3">
                    {custos.map((custo) => (
                        <div key={custo.id} className="flex items-center justify-between rounded-xl bg-zinc-900/60 p-5">
                            <div>
                                <p className="font-semibold text-white">{custo.descricao}</p>
                            </div>

                            <div className="text-right">
                                <p className="font-bold text-red-400">{formatMoney(Number(custo.valor))}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
('use client');

import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
