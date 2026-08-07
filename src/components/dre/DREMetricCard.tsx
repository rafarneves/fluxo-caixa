type Props = {
    titulo: string;
    valor: string;

    cor?: 'green' | 'red' | 'blue' | 'yellow';

    tendencia?: string;

    status?: string;

    subtitulo?: string;

    progresso?: number;
};

export default function DREMetricCard({
    titulo,
    valor,
    cor = 'green',
    tendencia,
    status,
    subtitulo,
    progresso,
}: Props) {
    const cores = {
        green: {
            texto: 'text-green-400',
            fundo: 'bg-green-500/10',
            barra: 'bg-green-500',
        },

        red: {
            texto: 'text-red-400',
            fundo: 'bg-red-500/10',
            barra: 'bg-red-500',
        },

        blue: {
            texto: 'text-cyan-400',
            fundo: 'bg-cyan-500/10',
            barra: 'bg-cyan-500',
        },

        yellow: {
            texto: 'text-yellow-400',
            fundo: 'bg-yellow-500/10',
            barra: 'bg-yellow-500',
        },
    };

    return (
        <div className="rounded-2xl border border-zinc-800 bg-[#161B22] p-6 transition-all duration-300 hover:border-green-500/30">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-zinc-400">{titulo}</p>

                    <h2 className={`mt-3 text-3xl font-bold ${cores[cor].texto}`}>{valor}</h2>

                    {subtitulo && <p className="mt-2 text-sm text-zinc-500">{subtitulo}</p>}
                </div>

                {status && (
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${cores[cor].texto} ${cores[cor].fundo} `}
                    >
                        {status}
                    </span>
                )}
            </div>

            {(tendencia || progresso !== undefined) && (
                <div className="mt-6">
                    {tendencia && <p className={`text-sm font-semibold ${cores[cor].texto}`}>{tendencia}</p>}

                    {progresso !== undefined && (
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                            <div
                                className={`h-full ${cores[cor].barra} transition-all duration-500`}
                                style={{
                                    width: `${Math.min(Math.max(progresso, 0), 100)}%`,
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
