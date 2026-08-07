type Custo = {
    id: string;
    categoria: string;
    descricao: string | null;
    valor: number;
    competencia: string | null;
};

export default function ListaCustos({ custos }: { custos: Custo[] }) {
    const formatMoney = useConfiguracoes().formatarMoeda;
    return (
        <div className="rounded-3xl border border-zinc-800 bg-[#161B22] p-8">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Custos do Contrato</h2>

                <span className="text-zinc-500">{custos.length} registros</span>
            </div>

            {custos.length === 0 && (
                <div className="rounded-xl bg-zinc-900 p-8 text-center text-zinc-500">
                    Nenhum custo cadastrado para este contrato.
                </div>
            )}

            {custos.length > 0 && (
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-800 text-left text-zinc-500">
                            <th className="pb-4">Categoria</th>

                            <th>Descrição</th>

                            <th>Competência</th>

                            <th className="text-right">Valor</th>
                        </tr>
                    </thead>

                    <tbody>
                        {custos.map((custo) => (
                            <tr key={custo.id} className="border-b border-zinc-800">
                                <td className="py-5">{custo.categoria}</td>

                                <td>{custo.descricao || '-'}</td>

                                <td>{custo.competencia || '-'}</td>

                                <td className="text-right font-bold text-red-400">
                                    {formatMoney(Number(custo.valor))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
('use client');

import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
