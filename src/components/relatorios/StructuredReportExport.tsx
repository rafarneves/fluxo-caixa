'use client';

import ReportExport from '@/components/relatorios/ReportExport';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

type CellValue = string | number | null | undefined;
type ValueFormat = 'text' | 'currency' | 'number' | 'percent';
type Tone = 'green' | 'red' | 'yellow' | 'blue' | 'neutral';

type SummaryCard = {
    label: string;
    value: CellValue;
    format?: ValueFormat;
    tone?: Tone;
};

type ReportColumn = {
    header: string;
    dataKey: string;
    format?: ValueFormat;
    align?: 'left' | 'center' | 'right';
    tone?: Tone;
};

type ReportSection = {
    title: string;
    columns: ReportColumn[];
    rows: Record<string, CellValue>[];
    emptyMessage?: string;
};

type StructuredReportExportProps = {
    title: string;
    periodo?: string;
    cards: SummaryCard[];
    sections: ReportSection[];
    fileName?: string;
};

const COLORS = {
    background: [9, 9, 11] as [number, number, number],
    header: [17, 24, 39] as [number, number, number],
    panel: [24, 24, 27] as [number, number, number],
    panelAlternate: [30, 30, 35] as [number, number, number],
    border: [63, 63, 70] as [number, number, number],
    text: [228, 228, 231] as [number, number, number],
    muted: [161, 161, 170] as [number, number, number],
    green: [74, 222, 128] as [number, number, number],
    red: [248, 113, 113] as [number, number, number],
    yellow: [250, 204, 21] as [number, number, number],
    blue: [34, 211, 238] as [number, number, number],
    neutral: [228, 228, 231] as [number, number, number],
};

const PERIOD_LABELS: Record<string, string> = {
    hoje: 'Hoje',
    semana: 'Esta semana',
    mes: 'Este mês',
    '30dias': 'Últimos 30 dias',
    ano: 'Este ano',
    todos: 'Todo o período',
};

function safeFileName(value: string) {
    return (
        value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9-_ ]/g, '')
            .trim()
            .replace(/\s+/g, '_') || 'Relatorio'
    );
}

export default function StructuredReportExport({
    title,
    periodo,
    cards,
    sections,
    fileName,
}: StructuredReportExportProps) {
    const { formatarMoeda } = useConfiguracoes();

    function formatValue(value: CellValue, format: ValueFormat = 'text') {
        if (value === null || value === undefined || value === '') return '-';
        if (format === 'currency') return formatarMoeda(Number(value));
        if (format === 'number') return Number(value).toLocaleString('pt-BR');
        if (format === 'percent') return `${Number(value).toFixed(1)}%`;

        return String(value);
    }

    async function exportPDF() {
        const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
            import('jspdf'),
            import('jspdf-autotable'),
        ]);
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const decoratedPages = new Set<number>();
        const periodLabel = periodo ? (PERIOD_LABELS[periodo] ?? periodo) : null;
        const exportDate = new Intl.DateTimeFormat('pt-BR').format(new Date());

        function fitText(text: string, maxWidth: number, initialSize: number, minimumSize: number) {
            let size = initialSize;
            doc.setFontSize(size);

            while (size > minimumSize && doc.getTextWidth(text) > maxWidth) {
                size -= 0.5;
                doc.setFontSize(size);
            }

            return size;
        }

        function drawPageBase(firstPage = false) {
            const currentPage = doc.getCurrentPageInfo().pageNumber;

            doc.setFillColor(...COLORS.background);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');
            doc.setFillColor(...COLORS.header);
            doc.rect(0, 0, pageWidth, firstPage ? 48 : 24, 'F');

            doc.setTextColor(...COLORS.green);
            doc.setFont('helvetica', 'bold');
            const headerTitle = title.toUpperCase();
            fitText(headerTitle, pageWidth - margin * 2, firstPage ? 22 : 13, firstPage ? 14 : 10);
            doc.text(headerTitle, margin, firstPage ? 23 : 15);

            if (firstPage) {
                doc.setTextColor(...COLORS.muted);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                const metadata = [periodLabel ? `Período: ${periodLabel}` : null, `Exportado em: ${exportDate}`]
                    .filter(Boolean)
                    .join('  |  ');
                doc.text(metadata, margin, 35);
            }

            doc.setDrawColor(...COLORS.green);
            doc.setLineWidth(0.8);
            doc.line(margin, firstPage ? 44 : 21, pageWidth - margin, firstPage ? 44 : 21);
            decoratedPages.add(currentPage);
        }

        function ensurePageDecorated() {
            const currentPage = doc.getCurrentPageInfo().pageNumber;

            if (!decoratedPages.has(currentPage)) drawPageBase(false);
        }

        function drawSectionTitle(sectionTitle: string, y: number) {
            doc.setTextColor(...COLORS.text);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(13);
            doc.text(sectionTitle, margin, y);
        }

        drawPageBase(true);

        const columnCount = cards.length >= 5 ? 3 : 2;
        const cardGap = 5;
        const cardWidth = (pageWidth - margin * 2 - cardGap * (columnCount - 1)) / columnCount;
        const cardHeight = 23;
        const cardRows = Math.ceil(cards.length / columnCount);

        cards.forEach((card, index) => {
            const column = index % columnCount;
            const row = Math.floor(index / columnCount);
            const x = margin + column * (cardWidth + cardGap);
            const y = 56 + row * (cardHeight + cardGap);
            const color = COLORS[card.tone ?? 'neutral'];
            const value = formatValue(card.value, card.format);

            doc.setFillColor(...COLORS.panel);
            doc.setDrawColor(...COLORS.border);
            doc.roundedRect(x, y, cardWidth, cardHeight, 2.5, 2.5, 'FD');
            doc.setFillColor(...color);
            doc.roundedRect(x, y, cardWidth, 2, 2.5, 2.5, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(...COLORS.muted);
            doc.text(card.label.toUpperCase(), x + 4, y + 9);

            doc.setTextColor(...color);
            doc.setFont('helvetica', 'bold');
            fitText(value, cardWidth - 8, 11.5, 7);
            doc.text(value, x + 4, y + 18);
        });

        let cursorY = 56 + cardRows * (cardHeight + cardGap) + 8;

        sections.forEach((section) => {
            if (cursorY > pageHeight - 55) {
                doc.addPage();
                drawPageBase(false);
                cursorY = 34;
            }

            drawSectionTitle(section.title, cursorY);

            const rows =
                section.rows.length > 0
                    ? section.rows.map((row) =>
                          Object.fromEntries(
                              section.columns.map((column) => [
                                  column.dataKey,
                                  formatValue(row[column.dataKey], column.format),
                              ])
                          )
                      )
                    : [
                          Object.fromEntries(
                              section.columns.map((column, index) => [
                                  column.dataKey,
                                  index === 0 ? (section.emptyMessage ?? 'Nenhum registro encontrado.') : '-',
                              ])
                          ),
                      ];

            const columnStyles = Object.fromEntries(
                section.columns.map((column) => [
                    column.dataKey,
                    {
                        halign: column.align ?? 'left',
                        ...(column.tone ? { textColor: COLORS[column.tone] } : {}),
                    },
                ])
            );

            autoTable(doc, {
                startY: cursorY + 7,
                columns: section.columns.map((column) => ({
                    header: column.header,
                    dataKey: column.dataKey,
                })),
                body: rows,
                theme: 'plain',
                styles: {
                    fontSize: section.columns.length >= 6 ? 7.5 : 9,
                    cellPadding: section.columns.length >= 6 ? 3 : 4.5,
                    textColor: COLORS.text,
                    lineColor: COLORS.border,
                    lineWidth: 0.15,
                    overflow: 'linebreak',
                },
                headStyles: {
                    fillColor: COLORS.panelAlternate,
                    textColor: COLORS.muted,
                    fontStyle: 'bold',
                    fontSize: section.columns.length >= 6 ? 7 : 8.5,
                },
                bodyStyles: { fillColor: COLORS.panel },
                alternateRowStyles: { fillColor: COLORS.panelAlternate },
                columnStyles,
                margin: { left: margin, right: margin, top: 31, bottom: 22 },
                willDrawPage: ensurePageDecorated,
                didParseCell(data) {
                    if (data.section !== 'body') return;

                    const column = section.columns[data.column.index];
                    const originalValue = section.rows[data.row.index]?.[column?.dataKey];

                    if (column?.format === 'currency' && typeof originalValue === 'number' && originalValue < 0) {
                        data.cell.styles.textColor = COLORS.red;
                    }
                },
            });

            cursorY =
                ((doc as typeof doc & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? cursorY + 30) +
                13;
        });

        const totalPages = doc.getNumberOfPages();

        for (let page = 1; page <= totalPages; page += 1) {
            doc.setPage(page);
            doc.setFillColor(...COLORS.header);
            doc.rect(0, pageHeight - 16, pageWidth, 16, 'F');
            doc.setTextColor(113, 113, 122);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.text('Documento gerado automaticamente pelo Sistema de Fluxo de Caixa', margin, pageHeight - 7);
            doc.text(`${page}/${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
        }

        const date = new Date().toISOString().slice(0, 10);
        doc.save(`${safeFileName(fileName ?? title)}_${date}.pdf`);
    }

    return <ReportExport reportTitle={title} onExportPDF={exportPDF} />;
}
