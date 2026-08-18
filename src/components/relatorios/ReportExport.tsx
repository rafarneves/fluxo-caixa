'use client';

import { useState } from 'react';
import DownloadRounded from '@mui/icons-material/DownloadRounded';
import PictureAsPdfRounded from '@mui/icons-material/PictureAsPdfRounded';
import TableViewRounded from '@mui/icons-material/TableViewRounded';
import { Alert, Button, CircularProgress, Stack } from '@mui/material';

import { exportPDF } from '@/lib/export/exportPDF';

type ReportExportProps = {
    reportId?: string;
    reportTitle?: string;
    onExportPDF?: () => void | Promise<void>;
    onExportExcel?: () => void | Promise<void>;
    loadingExcel?: boolean;
    disabledPDF?: boolean;
    disabledExcel?: boolean;
};

export default function ReportExport({
    reportId = 'report-content',
    reportTitle,
    onExportPDF,
    onExportExcel,
    loadingExcel = false,
    disabledPDF = false,
    disabledExcel = false,
}: ReportExportProps) {
    const [loadingPDF, setLoadingPDF] = useState(false);
    const [loadingSpreadsheet, setLoadingSpreadsheet] = useState(false);
    const [loadingAll, setLoadingAll] = useState(false);
    const [error, setError] = useState<string | null>(null);
    function getReport() {
        const report = document.getElementById(reportId);
        if (!report) throw new Error('Não foi possível localizar o conteúdo do relatório para exportação.');
        return report;
    }
    function getTitle() {
        return reportTitle ?? getReport().querySelector('h1')?.textContent?.trim() ?? 'Relatório';
    }
    const csvCell = (value: string) => `"${value.replace(/\s+/g, ' ').trim().replace(/"/g, '""')}"`;
    function downloadSpreadsheet() {
        const report = getReport();
        const tables = Array.from(report.querySelectorAll('table'));
        if (!tables.length) throw new Error('Este relatório não possui uma tabela para exportar ao Excel.');
        const lines: string[] = [];
        tables.forEach((table, tableIndex) => {
            const sectionTitle = table.closest('section')?.querySelector('h2')?.textContent?.trim();
            if (sectionTitle) lines.push(csvCell(sectionTitle));
            Array.from(table.rows).forEach((row) => {
                const cells = Array.from(row.cells).filter((cell) => !cell.hasAttribute('data-export-ignore'));
                lines.push(cells.map((cell) => csvCell(cell.textContent ?? '')).join(';'));
            });
            if (tableIndex < tables.length - 1) lines.push('');
        });
        const blob = new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const fileName = getTitle()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9-_ ]/g, '')
            .trim()
            .replace(/\s+/g, '-');
        link.href = url;
        link.download = `${fileName || 'relatorio'}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }
    async function run(setLoading: (value: boolean) => void, action: () => void | Promise<void>, fallback: string) {
        try {
            setError(null);
            setLoading(true);
            await action();
        } catch (caught) {
            console.error(caught);
            setError(caught instanceof Error ? caught.message : fallback);
        } finally {
            setLoading(false);
        }
    }
    const handleExportPDF = () =>
        run(
            setLoadingPDF,
            () => (onExportPDF ? onExportPDF() : exportPDF(reportId, { title: getTitle(), fileName: getTitle() })),
            'Não foi possível exportar o PDF.'
        );
    const handleExportExcel = () =>
        run(
            setLoadingSpreadsheet,
            () => (onExportExcel ? onExportExcel() : downloadSpreadsheet()),
            'Não foi possível exportar a planilha.'
        );
    const handleExportAll = () =>
        run(
            setLoadingAll,
            async () => {
                if (!disabledPDF) {
                    if (onExportPDF) await onExportPDF();
                    else await exportPDF(reportId, { title: getTitle(), fileName: getTitle() });
                }
                if (!disabledExcel) {
                    if (onExportExcel) await onExportExcel();
                    else downloadSpreadsheet();
                }
            },
            'Não foi possível concluir as exportações.'
        );
    const spinner = <CircularProgress size={17} color="inherit" />;

    return (
        <Stack
            data-export-ignore
            direction="row"
            spacing={1.25}
            sx={{ alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap' }}
        >
            <Button
                type="button"
                onClick={handleExportPDF}
                disabled={disabledPDF || loadingPDF}
                variant="outlined"
                color="error"
                startIcon={loadingPDF ? spinner : <PictureAsPdfRounded />}
            >
                Exportar PDF
            </Button>
            <Button
                type="button"
                onClick={handleExportExcel}
                disabled={disabledExcel || loadingExcel || loadingSpreadsheet}
                variant="outlined"
                color="primary"
                startIcon={loadingExcel || loadingSpreadsheet ? spinner : <TableViewRounded />}
            >
                Exportar Excel
            </Button>
            <Button
                type="button"
                onClick={handleExportAll}
                disabled={(disabledPDF && disabledExcel) || loadingAll}
                variant="outlined"
                color="inherit"
                startIcon={loadingAll ? spinner : <DownloadRounded />}
                sx={{ color: 'text.secondary', borderColor: 'divider' }}
            >
                Exportar Tudo
            </Button>
            {error && (
                <Alert severity="error" variant="outlined" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            )}
        </Stack>
    );
}
