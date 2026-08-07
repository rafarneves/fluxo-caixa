import Link from 'next/link';
import FormDespesa from './FormDespesa';

export default function NovaDespesaPage() {
    return (
        <main className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-[0.25em] text-zinc-500 uppercase">FINANCEIRO</p>

                    <h1 className="mt-3 text-5xl font-bold text-white">
                        Nova
                        <span className="text-green-400"> Despesa</span>
                    </h1>

                    <p className="mt-3 text-lg text-zinc-400">Cadastre um novo custo operacional da empresa.</p>
                </div>

                <Link
                    href="/despesas"

                    className="rounded-xl border border-zinc-800 bg-[#1C2430] px-6 py-3 font-semibold text-white transition hover:border-zinc-600"
                >
                    ← Voltar
                </Link>
            </div>

            <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white">Informações da despesa</h2>

                    <p className="mt-2 text-zinc-500">
                        Preencha os dados abaixo para registrar o lançamento financeiro.
                    </p>
                </div>

                <FormDespesa />
            </section>
        </main>
    );
}
