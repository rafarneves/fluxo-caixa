type Props = {
    title: string;
    value: string | number;
    subtitle: string;
    color?: string;
};

export default function MetricCard({ title, value, subtitle, color = 'text-white' }: Props) {
    return (
        <div className="relative min-h-[220px] overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#181f29] via-[#141a22] to-[#10151b] p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-green-500/40">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-green-500/5 blur-3xl" />

            <div className="relative flex h-full flex-col justify-between">
                <div>
                    <p className="text-xs tracking-[4px] text-zinc-500 uppercase">{title}</p>

                    <h2 className={`mt-6 text-5xl leading-none font-bold whitespace-nowrap ${color} `}>{value}</h2>
                </div>

                <p className="text-lg text-zinc-400">{subtitle}</p>
            </div>
        </div>
    );
}
