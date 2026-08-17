'use client';

import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import PeriodFilter from '@/components/filters/PeriodFilter';

type Props = {
    receitaBruta: number;
    custos: number;
    despesasOperacionais: number;
    lucroLiquido: number;
    margem: number;
    periodo: string;
    despesasPorCategoria: { categoria: string; valor: number }[];
};

function moeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function DREHeader({
    receitaBruta,
    custos,
    despesasOperacionais,
    lucroLiquido,
    margem,
    periodo,
    despesasPorCategoria,
}: Props) {
    function exportarDRE() {
        const labels: Record<string, string> = {
            hoje: 'Hoje',
            semana: 'Esta Semana',
            mes: 'Este Mês',
            '30dias': 'Últimos 30 dias',
            ano: 'Este Ano',
        };

        const periodoLabel = labels[periodo] ?? periodo;
        const dataExportacao = new Date().toLocaleDateString('pt-BR');
        const lucroBruto = receitaBruta - custos;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // --- Cabeçalho com fundo escuro ---
        doc.setFillColor(17, 24, 39); // bg-gray-900
        doc.rect(0, 0, pageWidth, 52, 'F');

        doc.setTextColor(74, 222, 128); // green-400
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('DRE Executivo', 20, 25);

        doc.setTextColor(161, 161, 170); // zinc-400
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Período: ${periodoLabel}  •  Exportado em: ${dataExportacao}`, 20, 38);

        // --- Linha divisória verde ---
        doc.setDrawColor(74, 222, 128);
        doc.setLineWidth(0.8);
        doc.line(20, 48, pageWidth - 20, 48);

        // --- Cards de resumo ---
        let y = 62;
        const cardData = [
            { label: 'Receita Bruta', value: moeda(receitaBruta), color: [74, 222, 128] as [number, number, number] },
            { label: 'Custos dos Contratos', value: `- ${moeda(custos)}`, color: [248, 113, 113] as [number, number, number] },
            { label: 'Lucro Bruto', value: moeda(lucroBruto), color: lucroBruto >= 0 ? [74, 222, 128] as [number, number, number] : [248, 113, 113] as [number, number, number] },
            { label: 'Despesas Operacionais', value: `- ${moeda(despesasOperacionais)}`, color: [248, 113, 113] as [number, number, number] },
            { label: 'Lucro Líquido', value: moeda(lucroLiquido), color: lucroLiquido >= 0 ? [74, 222, 128] as [number, number, number] : [248, 113, 113] as [number, number, number] },
            { label: 'Margem Líquida', value: `${margem.toFixed(1)}%`, color: margem >= 0 ? [74, 222, 128] as [number, number, number] : [248, 113, 113] as [number, number, number] },
        ];

        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('Demonstrativo de Resultado', 20, y);
        y += 10;

        // Tabela do DRE
        autoTable(doc, {
            startY: y,
            head: [['Descrição', 'Valor']],
            body: cardData.map(item => [item.label, item.value]),
            theme: 'plain',
            styles: {
                fontSize: 11,
                cellPadding: 6,
                textColor: [228, 228, 231],
            },
            headStyles: {
                fillColor: [39, 39, 42],
                textColor: [161, 161, 170],
                fontStyle: 'bold',
                fontSize: 9,
            },
            bodyStyles: {
                fillColor: [24, 24, 27],
            },
            alternateRowStyles: {
                fillColor: [30, 30, 35],
            },
            columnStyles: {
                0: { cellWidth: 110 },
                1: { halign: 'right', fontStyle: 'bold' },
            },
            didParseCell: (data) => {
                if (data.section === 'body' && data.column.index === 1) {
                    const item = cardData[data.row.index];
                    if (item) {
                        data.cell.styles.textColor = item.color;
                    }
                }
                // Destacar linha do Lucro Líquido
                if (data.section === 'body' && data.row.index === 4) {
                    data.cell.styles.fillColor = [20, 40, 30];
                    data.cell.styles.fontSize = 12;
                }
            },
            margin: { left: 20, right: 20 },
        });

        // --- Detalhamento por categoria ---
        const finalY = (doc as any).lastAutoTable?.finalY ?? y + 80;
        let catY = finalY + 16;

        if (despesasPorCategoria.length > 0) {
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text('Despesas por Categoria', 20, catY);
            catY += 8;

            autoTable(doc, {
                startY: catY,
                head: [['Categoria', 'Valor', '% da Receita']],
                body: despesasPorCategoria.map(item => [
                    item.categoria,
                    moeda(item.valor),
                    receitaBruta > 0 ? `${((item.valor / receitaBruta) * 100).toFixed(1)}%` : '0%',
                ]),
                theme: 'plain',
                styles: {
                    fontSize: 10,
                    cellPadding: 5,
                    textColor: [228, 228, 231],
                },
                headStyles: {
                    fillColor: [39, 39, 42],
                    textColor: [161, 161, 170],
                    fontStyle: 'bold',
                    fontSize: 9,
                },
                bodyStyles: {
                    fillColor: [24, 24, 27],
                },
                alternateRowStyles: {
                    fillColor: [30, 30, 35],
                },
                columnStyles: {
                    1: { halign: 'right', textColor: [248, 113, 113] },
                    2: { halign: 'right', textColor: [161, 161, 170] },
                },
                margin: { left: 20, right: 20 },
            });
        }

        // --- Rodapé ---
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFillColor(17, 24, 39);
        doc.rect(0, pageHeight - 18, pageWidth, 18, 'F');
        doc.setFontSize(8);
        doc.setTextColor(113, 113, 122);
        doc.text('Documento gerado automaticamente pelo Sistema de Fluxo de Caixa', pageWidth / 2, pageHeight - 8, { align: 'center' });

        doc.save(`DRE_${periodo}_${new Date().toISOString().split('T')[0]}.pdf`);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">FINANCEIRO</p>

                    <h1 className="mt-3 text-5xl font-bold text-white">DRE Executivo</h1>

                    <p className="mt-3 max-w-3xl text-lg text-zinc-400">
                        Análise completa da rentabilidade da empresa, acompanhando receitas, custos, despesas e resultado
                        líquido.
                    </p>
                </div>

                <button
                    onClick={exportarDRE}
                    className="inline-flex shrink-0 items-center gap-3 rounded-2xl bg-green-500 px-6 py-4 font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-green-400"
                >
                    <Download size={20} />
                    Exportar DRE
                </button>
            </div>

            <PeriodFilter />
        </div>
    );
}
