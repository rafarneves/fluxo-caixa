'use client';

import { removerCusto } from '../actions';

export default function ExcluirCusto({ id }: { id: string }) {
    return (
        <button
            onClick={async () => {
                const confirmar = confirm('Deseja realmente excluir este custo?');

                if (!confirmar) return;

                await removerCusto(id);

                window.location.reload();
            }}
            className="text-xl text-red-400 transition hover:text-red-300"
            title="Excluir custo"
        >
            🗑️
        </button>
    );
}
