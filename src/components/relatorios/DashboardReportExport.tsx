'use client';

import ReportExport from '@/components/relatorios/ReportExport';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

type DashboardReportExportProps = {
    periodo: string;
    indicadores: {
        recebido: number;
        emAberto: number;
        lucro: number;
        despesas: number;
        clientes: number;
        margem: number;
    };
    evolucao: {
        mes: string;
        recebido: number;
        despesas: number;
        custos: number;
        lucro: number;
    }[];
    atividades: {
        titulo: string;
        descricao: string;
        data: string;
    }[];
};

const COLORS = {
    background: [9, 9, 11] as [number, number, number],
    panel: [24, 24, 27] as [number, number, number],
    panelAlternate: [30, 30, 35] as [number, number, number],
    border: [63, 63, 70] as [number, number, number],
    text: [228, 228, 231] as [number, number, number],
    muted: [161, 161, 170] as [number, number, number],
    green: [74, 222, 128] as [number, number, number],
    red: [248, 113, 113] as [number, number, number],
    yellow: [250, 204, 21] as [number, number, number],
    blue: [34, 211, 238] as [number, number, number],
};

const periodos: Record<string, string> = {
    hoje: 'Hoje',
    semana: 'Esta semana',
    mes: 'Este mês',
    '30dias': 'Últimos 30 dias',
    ano: 'Este ano',
    todos: 'Todo o período',
};

export default function DashboardReportExport({
    periodo,
    indicadores,
    evolucao,
    atividades,
}: DashboardReportExportProps) {
    const { formatarMoeda } = useConfiguracoes();

    async function exportarDashboardPDF() {
        const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
            import('jspdf'),
            import('jspdf-autotable'),
        ]);
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const decoratedPages = new Set<number>();
        const periodoLabel = periodos[periodo] ?? periodos.mes;
        const dataExportacao = new Intl.DateTimeFormat('pt-BR').format(new Date());

        function drawPageBase(firstPage = false) {
            const pageNumber = doc.getCurrentPageInfo().pageNumber;

            doc.setFillColor(...COLORS.background);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');

            doc.setFillColor(17, 24, 39);
            doc.rect(0, 0, pageWidth, firstPage ? 48 : 24, 'F');

            doc.setTextColor(...COLORS.green);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(firstPage ? 22 : 13);
            doc.text('DASHBOARD EXECUTIVO', margin, firstPage ? 23 : 15);

            if (firstPage) {
                doc.setTextColor(...COLORS.muted);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.text(`Período: ${periodoLabel}  |  Exportado em: ${dataExportacao}`, margin, 35);
            }

            doc.setDrawColor(...COLORS.green);
            doc.setLineWidth(0.8);
            doc.line(margin, firstPage ? 44 : 21, pageWidth - margin, firstPage ? 44 : 21);
            decoratedPages.add(pageNumber);
        }

        function ensurePageDecorated() {
            const currentPage = doc.getCurrentPageInfo().pageNumber;

            if (!decoratedPages.has(currentPage)) drawPageBase(false);
        }

        function drawSectionTitle(title: string, y: number) {
            doc.setTextColor(...COLORS.text);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(13);
            doc.text(title, margin, y);
        }

        drawPageBase(true);

        const cardGap = 5;
        const cardWidth = (pageWidth - margin * 2 - cardGap * 2) / 3;
        const cardHeight = 23;
        const cards = [
            { label: 'Receita recebida', value: formatarMoeda(indicadores.recebido), color: COLORS.green },
            { label: 'Em aberto', value: formatarMoeda(indicadores.emAberto), color: COLORS.yellow },
            {
                label: 'Lucro',
                value: formatarMoeda(indicadores.lucro),
                color: indicadores.lucro >= 0 ? COLORS.green : COLORS.red,
            },
            { label: 'Despesas', value: formatarMoeda(indicadores.despesas), color: COLORS.red },
            { label: 'Clientes', value: indicadores.clientes.toLocaleString('pt-BR'), color: COLORS.blue },
            {
                label: 'Margem',
                value: `${indicadores.margem.toFixed(1)}%`,
                color: indicadores.margem >= 0 ? COLORS.green : COLORS.red,
            },
        ];

        cards.forEach((card, index) => {
            const column = index % 3;
            const row = Math.floor(index / 3);
            const x = margin + column * (cardWidth + cardGap);
            const y = 56 + row * (cardHeight + cardGap);

            doc.setFillColor(...COLORS.panel);
            doc.setDrawColor(...COLORS.border);
            doc.roundedRect(x, y, cardWidth, cardHeight, 2.5, 2.5, 'FD');
            doc.setFillColor(...card.color);
            doc.roundedRect(x, y, cardWidth, 2, 2.5, 2.5, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(...COLORS.muted);
            doc.text(card.label.toUpperCase(), x + 4, y + 9);

            doc.setTextColor(...card.color);
            doc.setFontSize(11);
            const value = doc.splitTextToSize(card.value, cardWidth - 8)[0] ?? card.value;
            doc.text(value, x + 4, y + 18);
        });

        drawSectionTitle('Evolução financeira', 119);

        const evolucaoRows =
            evolucao.length > 0
                ? evolucao.map((item) => [
                      item.mes,
                      formatarMoeda(item.recebido),
                      formatarMoeda(item.despesas),
                      formatarMoeda(item.custos),
                      formatarMoeda(item.lucro),
                  ])
                : [['Sem dados no período', '-', '-', '-', '-']];

        autoTable(doc, {
            startY: 126,
            head: [['Mês', 'Recebido', 'Despesas', 'Custos', 'Lucro']],
            body: evolucaoRows,
            theme: 'plain',
            styles: {
                fontSize: 8,
                cellPadding: 4,
                textColor: COLORS.text,
                lineColor: COLORS.border,
                lineWidth: 0.15,
            },
            headStyles: {
                fillColor: COLORS.panelAlternate,
                textColor: COLORS.muted,
                fontStyle: 'bold',
            },
            bodyStyles: { fillColor: COLORS.panel },
            alternateRowStyles: { fillColor: COLORS.panelAlternate },
            columnStyles: {
                0: { cellWidth: 28 },
                1: { halign: 'right' },
                2: { halign: 'right', textColor: COLORS.red },
                3: { halign: 'right', textColor: COLORS.yellow },
                4: { halign: 'right' },
            },
            margin: { left: margin, right: margin, top: 31, bottom: 22 },
            willDrawPage: ensurePageDecorated,
            didParseCell(data) {
                if (data.section === 'body' && data.column.index === 4 && evolucao[data.row.index]) {
                    data.cell.styles.textColor = evolucao[data.row.index].lucro >= 0 ? COLORS.green : COLORS.red;
                    data.cell.styles.fontStyle = 'bold';
                }
            },
        });

        const evolutionFinalY =
            (doc as typeof doc & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 170;
        let activitiesY = evolutionFinalY + 13;

        if (activitiesY > pageHeight - 58) {
            doc.addPage();
            drawPageBase(false);
            activitiesY = 34;
        }

        drawSectionTitle('Últimas atividades', activitiesY);

        const atividadesRows =
            atividades.length > 0
                ? atividades.map((item) => [item.titulo, item.descricao, item.data])
                : [['Nenhuma atividade encontrada', '-', '-']];

        autoTable(doc, {
            startY: activitiesY + 7,
            head: [['Título', 'Descrição', 'Data']],
            body: atividadesRows,
            theme: 'plain',
            styles: {
                fontSize: 9,
                cellPadding: 4.5,
                textColor: COLORS.text,
                lineColor: COLORS.border,
                lineWidth: 0.15,
            },
            headStyles: {
                fillColor: COLORS.panelAlternate,
                textColor: COLORS.muted,
                fontStyle: 'bold',
            },
            bodyStyles: { fillColor: COLORS.panel },
            alternateRowStyles: { fillColor: COLORS.panelAlternate },
            columnStyles: {
                0: { cellWidth: 55, fontStyle: 'bold' },
                2: { cellWidth: 28, halign: 'right', textColor: COLORS.muted },
            },
            margin: { left: margin, right: margin, top: 31, bottom: 22 },
            willDrawPage: ensurePageDecorated,
        });

        const totalPages = doc.getNumberOfPages();

        for (let page = 1; page <= totalPages; page += 1) {
            doc.setPage(page);
            doc.setFillColor(17, 24, 39);
            doc.rect(0, pageHeight - 16, pageWidth, 16, 'F');
            doc.setTextColor(113, 113, 122);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.text('Documento gerado automaticamente pelo Sistema de Fluxo de Caixa', margin, pageHeight - 7);
            doc.text(`${page}/${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
        }

        const date = new Date().toISOString().slice(0, 10);
        doc.save(`Dashboard_Executivo_${periodo}_${date}.pdf`);
    }

    return <ReportExport reportTitle="Dashboard Executivo" onExportPDF={exportarDashboardPDF} />;
}
