import { PieChart } from 'lucide-react';

type Props = {
    performance: number;
    altaPerformance: number;
    pro: number;
    personalizado: number;
    outros: number;
};

export default function PlansCard({ performance, altaPerformance, pro, personalizado, outros }: Props) {
    const planos = [
        {
            nome: 'Plano Performance',
            valor: performance,
            cor: 'bg-green-500',
            texto: 'text-green-400',
        },
        {
            nome: 'Alta Performance',
            valor: altaPerformance,
            cor: 'bg-cyan-500',
            texto: 'text-cyan-400',
        },
        {
            nome: 'Plano PRO',
            valor: pro,
            cor: 'bg-yellow-500',
            texto: 'text-yellow-400',
        },
        {
            nome: 'Personalizado',
            valor: personalizado,
            cor: 'bg-purple-500',
            texto: 'text-purple-400',
        },
        {
            nome: 'Outros',
            valor: outros,
            cor: 'bg-zinc-500',
            texto: 'text-zinc-300',
        },
    ];

    const total = planos.reduce((acc, plano) => acc + plano.valor, 0);

    return (
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">CONTRATOS</p>

                    <h2 className="mt-3 text-2xl font-bold">Distribuição dos Planos</h2>

                    <p className="mt-2 text-zinc-500">Participação dos contratos ativos</p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10 text-green-400">
                    <PieChart size={24} />
                </div>
            </div>

            <div className="space-y-7">
                {planos.map((plano) => {
                    const porcentagem = total === 0 ? 0 : (plano.valor / total) * 100;

                    return (
                        <div key={plano.nome}>
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-white">{plano.nome}</p>

                                    <p className="text-sm text-zinc-500">
                                        {plano.valor} contrato{plano.valor !== 1 ? 's' : ''}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className={`text-lg font-bold ${plano.texto}`}>{porcentagem.toFixed(0)}%</p>
                                </div>
                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-black/30">
                                <div
                                    className={`${plano.cor} h-full rounded-full transition-all duration-500`}
                                    style={{
                                        width: `${porcentagem}%`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 border-t border-zinc-800 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-zinc-500">Total de Contratos</p>

                        <h2 className="mt-2 text-4xl font-bold text-green-400">{total}</h2>
                    </div>

                    <div className="rounded-2xl bg-green-500/10 px-5 py-3 font-semibold text-green-400">
                        Carteira Ativa
                    </div>
                </div>
            </div>
        </section>
    );
}
