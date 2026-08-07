'use client';
import { excluirDespesa } from './actions';

export default function ExcluirDespesa({ id }: { id: string }) {
    const excluir = excluirDespesa.bind(null, id);

    return (
        <form action={excluir}>
            <button className="rounded-xl bg-red-500/20 px-4 py-2 font-bold text-red-400 transition hover:bg-red-500 hover:text-white">
                Excluir
            </button>
        </form>
    );
}
