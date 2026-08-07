import { createClient } from '@/lib/supabase/server';
import NovoCusto from './components/NovoCusto';
import ExcluirCusto from './components/ExcluirCusto';
import { formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';

export default async function CustosPage() {
    const supabase = await createClient();
    const { configuracoes } = await getContextoConfiguracoes();
    const formatMoney = (value: number) => formatarMoedaServidor(value, configuracoes);
    const [{ data: custos }, { data: contratos }] = await Promise.all([
        supabase
            .from('custos_contrato')
            .select(
                `
      *,
      contratos(
        nome,
        clientes(nome)
      )
    `
            )
            .order('created_at', { ascending: false }),
        supabase
            .from('contratos')
            .select(
                `
      id,
      nome,
      clientes(nome)
    `
            )
            .eq('status', 'Ativo'),
    ]);

    const dados = custos ?? [];

    const listaContratos = (contratos ?? []).map((c: any) => ({
        id: c.id,
        cliente: c.clientes?.nome ?? c.nome,
    }));

    const total = dados.reduce((soma: number, custo: any) => soma + Number(custo.valor), 0);

    return (
        <main className="space-y-8">
            <div>
                <h1 className="text-5xl font-bold text-green-400">Custos</h1>

                <p className="mt-2 text-zinc-400">Controle de custos dos contratos.</p>
            </div>

            <NovoCusto contratos={listaContratos} />

            <div className="grid grid-cols-2 gap-5">
                <div className="rounded-2xl bg-[#161B22] p-6">
                    <p className="text-zinc-400">Total Custos</p>

                    <h2 className="mt-3 text-3xl font-bold text-red-400">{formatMoney(total)}</h2>
                </div>

                <div className="rounded-2xl bg-[#161B22] p-6">
                    <p className="text-zinc-400">Registros</p>

                    <h2 className="mt-3 text-3xl font-bold text-green-400">{dados.length}</h2>
                </div>
            </div>

            <div className="rounded-3xl bg-[#161B22] p-8">
                <h2 className="mb-6 text-2xl font-bold">Histórico de Custos</h2>

                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-800 text-left text-zinc-400">
                            <th className="pb-4">Descrição</th>

                            <th>Contrato</th>

                            <th className="text-right">Valor</th>

                            <th className="text-center">Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {dados.map((c: any) => (
                            <tr key={c.id} className="border-b border-zinc-800">
                                <td className="py-5">{c.descricao}</td>

                                <td>{c.contratos?.clientes?.nome ?? '-'}</td>

                                <td className="text-right font-bold text-red-400">{formatMoney(Number(c.valor))}</td>

                                <td className="text-center">
                                    <ExcluirCusto id={c.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
