import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BadgeDollarSign, TrendingUp, Users, Wallet } from 'lucide-react';
import { formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';
import ClientsTable from '@/components/clientes/ClientsTable';

type ContratoCliente = {
    id: string;
    valor: number;
    status: string;
    data_inicio: string | null;
    loja: string | null;
};

type Cliente = {
    id: string;
    nome: string;
    cidade: string | null;
    estado: string | null;
    bairro: string | null;
    status: string;
    contratos: ContratoCliente[] | null;
};

const DIAS_POR_MES = 365.25 / 12;

function calcularPermanenciaMeses(dataInicio: string, referencia: Date) {
    const inicio = Date.parse(`${dataInicio.slice(0, 10)}T00:00:00Z`);

    if (Number.isNaN(inicio) || inicio > referencia.getTime()) {
        return null;
    }

    const dias = (referencia.getTime() - inicio) / (24 * 60 * 60 * 1000);

    return Math.max(1, dias / DIAS_POR_MES);
}

function formatarMeses(valor: number) {
    const meses = Number.isInteger(valor) ? String(valor) : valor.toFixed(1).replace('.', ',');

    return `${meses} ${Math.abs(valor - 1) < 0.05 ? 'mês' : 'meses'}`;
}

export default async function ClientesPage() {
    const supabase = await createClient();
    const { configuracoes } = await getContextoConfiguracoes();
    const formatMoney = (value: number) => formatarMoedaServidor(value, configuracoes);
    const { data: clientes } = await supabase
        .from('clientes')
        .select(
            `
      *,
      contratos (
        id,
        valor,
        status,
        data_inicio,
        loja
      )
    `
        )
        .order('created_at', {
            ascending: false,
        });

    const todosClientes = (clientes ?? []) as Cliente[];
    const clientesData = todosClientes.filter((cliente) => cliente.status?.toLowerCase() === 'ativo');

    const totalClientes = clientesData.length;

    const receita = clientesData.reduce((total, cliente) => {
        const contratos = cliente.contratos ?? [];

        return (
            total +
            contratos
                .filter((contrato) => contrato.status === 'Ativo')
                .reduce((subtotal, contrato) => subtotal + Number(contrato.valor), 0)
        );
    }, 0);

    const ticketMedio = totalClientes === 0 ? 0 : receita / totalClientes;
    const hoje = new Date();
    const permanencias = clientesData.flatMap((cliente) => {
        const contratosCliente = cliente.contratos ?? [];

        if (!contratosCliente.some((contrato) => contrato.status === 'Ativo')) {
            return [];
        }

        const datasInicio = contratosCliente
            .filter((contrato) => contrato.data_inicio)
            .map((contrato) => contrato.data_inicio as string)
            .sort();

        if (datasInicio.length === 0) {
            return [];
        }

        const permanencia = calcularPermanenciaMeses(datasInicio[0], hoje);

        return permanencia === null ? [] : [permanencia];
    });
    const permanenciaMedia =
        permanencias.length === 0
            ? 0
            : permanencias.reduce((total, permanencia) => total + permanencia, 0) / permanencias.length;
    const ltvMedio = ticketMedio * permanenciaMedia;

    return (
        <div className="space-y-10">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">CLIENTES</p>

                    <h1 className="mt-3 text-5xl font-bold text-white">Clientes</h1>

                    <p className="mt-3 text-lg text-zinc-400">
                        Gerencie sua carteira de clientes, contratos e relacionamento.
                    </p>
                </div>

                <Link
                    href="/clientes/novo"
                    prefetch={false}
                    className="rounded-2xl bg-green-500 px-6 py-4 font-bold text-black transition hover:-translate-y-0.5 hover:bg-green-400"
                >
                    + Novo Cliente
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <CardResumo
                    titulo="Clientes Ativos"
                    valor={String(totalClientes)}
                    icone={<Users size={22} />}
                ></CardResumo>

                <CardResumo
                    titulo="Receita Recorrente"
                    valor={formatMoney(receita)}
                    icone={<Wallet size={22} />}
                ></CardResumo>

                <CardResumo
                    titulo="Ticket Médio"
                    valor={formatMoney(ticketMedio)}
                    icone={<TrendingUp size={22} />}
                ></CardResumo>

                <CardResumo
                    titulo="LTV Médio"
                    valor={formatMoney(ltvMedio)}
                    subtitulo={`Permanência média: ${formatarMeses(permanenciaMedia)}`}
                    icone={<BadgeDollarSign size={22} />}
                />
            </div>

            <ClientsTable clientes={todosClientes} />
        </div>
    );
}

function CardResumo({
    titulo,
    valor,
    subtitulo,
    icone,
}: {
    titulo: string;
    valor: string;
    subtitulo?: string;
    icone: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#171F2B] to-[#111827] p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-zinc-500">{titulo}</p>

                    <h2 className="mt-4 text-4xl font-bold text-green-400">{valor}</h2>

                    {subtitulo && <p className="mt-2 text-sm text-zinc-500">{subtitulo}</p>}
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                    {icone}
                </div>
            </div>
        </div>
    );
}
