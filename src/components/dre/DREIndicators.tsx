import { TrendingUp, Percent, Receipt, Wallet } from 'lucide-react';

type Props = {
    receitaBruta: number;
    custos: number;
    despesasOperacionais: number;
    lucroLiquido: number;
};

function percentual(valor: number, total: number) {
    if (total <= 0) return '0%';

    return `${((valor / total) * 100).toFixed(1)}%`;
}

export default function DREIndicators({ receitaBruta, custos, despesasOperacionais, lucroLiquido }: Props) {
    const margemBruta = receitaBruta > 0 ? ((receitaBruta - custos) / receitaBruta) * 100 : 0;

    const margemLiquida = receitaBruta > 0 ? (lucroLiquido / receitaBruta) * 100 : 0;

    const indicadores = [
        {
            titulo: 'Margem Bruta',
            valor: `${margemBruta.toFixed(1)}%`,
            descricao: 'Após custos diretos',
            cor: 'green',
            icon: TrendingUp,
        },

        {
            titulo: 'Margem Líquida',
            valor: `${margemLiquida.toFixed(1)}%`,
            descricao: 'Resultado final',
            cor: 'blue',
            icon: Percent,
        },

        {
            titulo: 'Custo / Receita',
            valor: percentual(custos, receitaBruta),
            descricao: 'Custos dos contratos',
            cor: 'red',
            icon: Receipt,
        },

        {
            titulo: 'Despesa / Receita',
            valor: percentual(despesasOperacionais, receitaBruta),
            descricao: 'Operação da empresa',
            cor: 'yellow',
            icon: Wallet,
        },
    ];

    const cores = {
        green: {
            texto: 'text-green-400',
            fundo: 'bg-green-500/10',
        },

        blue: {
            texto: 'text-cyan-400',
            fundo: 'bg-cyan-500/10',
        },

        red: {
            texto: 'text-red-400',
            fundo: 'bg-red-500/10',
        },

        yellow: {
            texto: 'text-yellow-400',
            fundo: 'bg-yellow-500/10',
        },
    };

    return (
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
            <div className="mb-6">
                <p className="text-xs font-semibold tracking-[0.20em] text-zinc-500 uppercase">INDICADORES</p>

                <h2 className="mt-3 text-2xl font-bold">Performance Financeira</h2>

                <p className="mt-2 text-zinc-500">Métricas estratégicas da operação.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {indicadores.map((item) => {
                    const Icon = item.icon;

                    const cor = cores[item.cor as keyof typeof cores];

                    return (
                        <div
                            key={item.titulo}

                            className="group cursor-pointer rounded-2xl border border-zinc-800 bg-black/20 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-600 hover:shadow-xl"
                        >
                            <div className="flex items-center justify-between">
                                <div
                                    className={`rounded-xl p-3 ${cor.fundo} ${cor.texto} transition-transform duration-300 group-hover:scale-110`}
                                >
                                    <Icon size={20} />
                                </div>
                            </div>

                            <p className="mt-5 text-sm text-zinc-500">{item.titulo}</p>

                            <h3 className={`mt-2 text-3xl font-bold ${cor.texto} `}>{item.valor}</h3>

                            <p className="mt-2 text-xs text-zinc-600">{item.descricao}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
