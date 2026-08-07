'use client';

import { marcarComoPago } from './actions';

export default function MarcarPago({ id }: { id: string }) {
    return (
        <form
            action={async () => {
                await marcarComoPago(id);
            }}
        >
            <button className="rounded-xl bg-green-500 px-4 py-2 font-bold text-black hover:bg-green-400">
                Marcar Pago
            </button>
        </form>
    );
}
