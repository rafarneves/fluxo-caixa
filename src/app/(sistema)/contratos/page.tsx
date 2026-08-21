import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { FileText, Wallet, XCircle, TrendingUp } from 'lucide-react';
import { formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';
import ContratosClient from '@/components/contratos/ContratosClient';

export default async function ContratosPage() {
    const supabase = await createClient();
    const { configuracoes } = await getContextoConfiguracoes();
    const formatCompactMoney = (value: number) => formatarMoedaServidor(value, configuracoes, true);
    const { data: contratos } = await supabase
        .from('contratos')
        .select(
            `
      *,
      clientes (
        id,
        nome
      )
    `
        )
        .order('created_at', {
            ascending: false,
        });

    const contratosData = contratos ?? [];

    const ativos = contratosData.filter((contrato: any) => contrato.status === 'Ativo').length;

    const cancelados = contratosData.filter((contrato: any) => contrato.status === 'Cancelado').length;

    const receita = contratosData
        .filter((contrato: any) => contrato.status === 'Ativo')
        .reduce((total: number, contrato: any) => total + Number(contrato.valor), 0);

    const ticket = ativos === 0 ? 0 : receita / ativos;

    return (
        <div className="space-y-10">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">CONTRATOS</p>

                    <h1 className="mt-3 text-3xl font-bold text-white sm:text-5xl">Contratos</h1>

                    <p className="mt-3 text-base text-zinc-400 sm:text-lg">
                        Gerencie contratos, valores e recorrências dos clientes.
                    </p>
                </div>

                <Link
                    href="/contratos/novo"
                    className="w-full shrink-0 rounded-2xl bg-green-500 px-6 py-4 text-center sm:w-auto font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-green-400 hover:shadow-xl hover:shadow-green-500/20"
                >
                    + Novo Contrato
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <CardResumo
                    titulo="Contratos Ativos"
                    valor={String(ativos)}
                    icone={<FileText size={22} />}
                    tipo="verde"
                />

                <CardResumo
                    titulo="Receita Contratada"
                    valor={formatCompactMoney(receita)}
                    icone={<Wallet size={22} />}
                    tipo="verde"
                />

                <CardResumo
                    titulo="Cancelados"
                    valor={String(cancelados)}
                    icone={<XCircle size={22} />}
                    tipo="vermelho"
                />

                <CardResumo
                    titulo="Ticket Médio"
                    valor={formatCompactMoney(ticket)}
                    icone={<TrendingUp size={22} />}
                    tipo="azul"
                />
            </div>

            <ContratosClient contratos={contratosData} />
        </div>
    );
}

function CardResumo({
    titulo,
    valor,
    icone,
    tipo,
}: {
    titulo: string;
    valor: string;
    icone: React.ReactNode;
    tipo: 'verde' | 'vermelho' | 'azul';
}) {
    const estilos = {
        verde: {
            borda: 'border-green-500/20',
            fundo: 'bg-green-500/10',
            texto: 'text-green-400',
            numero: 'text-green-400',
        },

        vermelho: {
            borda: 'border-red-500/20',
            fundo: 'bg-red-500/10',
            texto: 'text-red-400',
            numero: 'text-red-400',
        },

        azul: {
            borda: 'border-cyan-500/20',
            fundo: 'bg-cyan-500/10',
            texto: 'text-cyan-400',
            numero: 'text-cyan-400',
        },
    }[tipo];

    return (
        <div
            className={`group rounded-3xl border ${estilos.borda} bg-gradient-to-b from-[#171F2B] to-[#111827] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-sm text-zinc-500 sm:text-base">{titulo}</p>

                    <h2 className={`mt-4 text-2xl font-bold xl:text-3xl 2xl:text-4xl ${estilos.numero} truncate`}>
                        {valor}
                    </h2>
                </div>

                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${estilos.fundo} ${estilos.texto} transition-all duration-300 group-hover:scale-110`}
                >
                    {icone}
                </div>
            </div>
        </div>
    );
}
