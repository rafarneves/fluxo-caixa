type DashboardCardProps = {
    titulo: string;
    valor: string | number;
    descricao: string;
    icone: string;
    cor: string;
};

export default function DashboardCard({ titulo, valor, descricao, icone, cor }: DashboardCardProps) {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-[#161B22] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm tracking-widest text-zinc-500 uppercase">{titulo}</p>

                    <h2 className={`mt-4 text-4xl font-bold ${cor}`}>{valor}</h2>

                    <p className="mt-4 text-zinc-400">{descricao}</p>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-3xl">
                    {icone}
                </div>
            </div>
        </div>
    );
}
