import { createClient } from '@/lib/supabase/server';
import NovoCustoContrato from './components/NovoCustoContrato';
import { formatarMoedaServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';

export default async function CustosContratoPage() {
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
      valor,
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

    const lucroPorContrato = new Map<
        string,
        {
            cliente: string;
            receita: number;
            custo: number;
            lucro: number;
            margem: number;
        }
    >();

    for (const contrato of contratos ?? []) {
        const receita = Number((contrato as any).valor ?? 0);

        const custo = dados
            .filter((c: any) => c.contrato_id === contrato.id)
            .reduce((soma: number, c: any) => soma + Number(c.valor), 0);

        const lucro = receita - custo;

        const margem = receita === 0 ? 0 : (lucro / receita) * 100;

        lucroPorContrato.set(contrato.id, {
            cliente: (contrato as any).clientes?.nome ?? (contrato as any).nome,
            receita,
            custo,
            lucro,
            margem,
        });
    }

    const ranking = [...lucroPorContrato.values()].sort((a, b) => b.lucro - a.lucro).slice(0, 3);

    return (
        <main className="space-y-8">
            <div>
                <h1 className="text-5xl font-bold text-green-400">Custos por Contrato</h1>

                <p className="mt-2 text-zinc-400">Controle dos custos individuais de cada cliente.</p>
            </div>

            <NovoCustoContrato contratos={listaContratos} />

            <div className="grid grid-cols-3 gap-5">
                <div className="rounded-2xl bg-[#161B22] p-6">
                    <p className="text-zinc-400">Total de Custos</p>

                    <h2 className="mt-3 text-3xl font-bold text-red-400">{formatMoney(total)}</h2>
                </div>

                <div className="rounded-2xl bg-[#161B22] p-6">
                    <p className="text-zinc-400">Registros</p>

                    <h2 className="mt-3 text-3xl font-bold text-green-400">{dados.length}</h2>
                </div>

                <div className="rounded-2xl bg-[#161B22] p-6">
                    <p className="text-zinc-400">Clientes com Custos</p>

                    <h2 className="mt-3 text-3xl font-bold text-blue-400">{ranking.length}</h2>
                </div>
            </div>

            <div className="rounded-3xl bg-[#161B22] p-8">
                <h2 className="mb-6 text-2xl font-bold">Top 3 Contratos Mais Lucrativos</h2>

                <div className="space-y-4">
                    {ranking.map((item, index) => (
                        <div
                            key={item.cliente}
                            className="flex items-center justify-between rounded-xl bg-zinc-900 p-5"
                        >
                            <div>
                                <p className="font-bold">
                                    {index + 1}º {item.cliente}
                                </p>

                                <p className="text-sm text-zinc-400">Margem {item.margem.toFixed(1)}%</p>
                            </div>

                            <strong className="text-xl text-green-400">{formatMoney(item.lucro)}</strong>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-3xl bg-[#161B22] p-8">
                <h2 className="mb-6 text-2xl font-bold">Histórico</h2>

                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-800 text-left text-zinc-400">
                            <th className="pb-4">Categoria</th>

                            <th>Descrição</th>

                            <th>Cliente</th>

                            <th>Valor</th>
                        </tr>
                    </thead>

                    <tbody>
                        {dados.map((c: any) => (
                            <tr key={c.id} className="border-b border-zinc-800">
                                <td className="py-5">{c.categoria}</td>

                                <td>{c.descricao ?? '-'}</td>

                                <td>{c.contratos?.clientes?.nome ?? '-'}</td>

                                <td className="font-bold text-red-400">{formatMoney(Number(c.valor))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
