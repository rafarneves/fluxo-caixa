import NovoRecebimentoModal from './NovoRecebimentoModal';

interface Props {
    contratoId: string;
}

export default function FiltroRecebimentos({ contratoId }: Props) {
    return (
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-[#161B22] p-5">
            <input
                type="text"
                placeholder="Pesquisar cliente..."
                className="w-80 rounded-xl border border-zinc-700 bg-[#0D1117] px-4 py-3 outline-none focus:border-green-500"
            />

            <div className="flex items-center gap-3">
                <button className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-black">Todos</button>

                <button className="rounded-lg bg-zinc-800 px-4 py-2 hover:bg-zinc-700">Pendentes</button>

                <button className="rounded-lg bg-zinc-800 px-4 py-2 hover:bg-zinc-700">Pagos</button>

                <button className="rounded-lg bg-zinc-800 px-4 py-2 hover:bg-zinc-700">Atrasados</button>

                <NovoRecebimentoModal contratoId={contratoId} />
            </div>
        </div>
    );
}
