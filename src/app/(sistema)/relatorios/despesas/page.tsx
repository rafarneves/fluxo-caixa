import { formatarDataServidor, getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { Receipt, TrendingDown, Wallet, CalendarDays } from 'lucide-react';

import ReportHeader from '@/components/relatorios/ReportHeader';
import ReportKPICard from '@/components/relatorios/ReportKPICard';
import ReportExport from '@/components/relatorios/ReportExport';
import ReportTable from '@/components/relatorios/ReportTable';

import { getDashboardExecutivo } from '@/lib/relatorios/dashboard';

export default async function RelatorioDespesasPage() {
    const { configuracoes } = await getContextoConfiguracoes();
    const dados = await getDashboardExecutivo();

    const despesas = dados.despesas;

    const totalDespesas = despesas.reduce((acc: number, item: any) => acc + Number(item.valor), 0);

    const quantidade = despesas.length;

    const ticketMedio = quantidade === 0 ? 0 : totalDespesas / quantidade;

    const categorias = new Set(despesas.map((d: any) => d.categoria)).size;

    return (
        <main className="space-y-8">
            <ReportHeader
                title="Despesas"
                description="Relatório completo das despesas cadastradas no ERP."
                actions={<ReportExport disabledPDF disabledExcel />}
            />

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <ReportKPICard title="Total" value={totalDespesas} icon={Wallet} color="red" />

                <ReportKPICard title="Lançamentos" value={quantidade} icon={Receipt} color="blue" isCurrency={false} />

                <ReportKPICard title="Ticket Médio" value={ticketMedio} icon={TrendingDown} color="yellow" />

                <ReportKPICard
                    title="Categorias"
                    value={categorias}
                    icon={CalendarDays}
                    color="green"
                    isCurrency={false}
                />
            </section>

            <ReportTable
                title="Despesas"
                description="Lista completa das despesas registradas."
                columns={[
                    {
                        key: 'categoria',
                        title: 'Categoria',
                    },
                    {
                        key: 'descricao',
                        title: 'Descrição',
                    },
                    {
                        key: 'data',
                        title: 'Data',
                        render: (item: any) => formatarDataServidor(item.data, configuracoes),
                    },
                    {
                        key: 'valor',
                        title: 'Valor',
                        align: 'right',
                        render: (item: any) =>
                            Number(item.valor).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: configuracoes.moeda,
                            }),
                    },
                ]}
                data={despesas}
            />
        </main>
    );
}
