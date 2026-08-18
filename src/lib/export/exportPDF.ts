type ExportPDFOptions = {
    title?: string;
    fileName?: string;
};

function normalizarNomeArquivo(value: string) {
    return (
        value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9-_ ]/g, '')
            .trim()
            .replace(/\s+/g, '-') || 'relatorio'
    );
}

export async function exportPDF(reportId = 'report-content', options: ExportPDFOptions = {}) {
    const report = document.getElementById(reportId);

    if (!report) {
        throw new Error('Não foi possível localizar o conteúdo do relatório para exportação.');
    }

    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
    ]);

    const canvas = await html2canvas(report, {
        backgroundColor: '#09090b',
        // O renderer calculado do html2canvas 1.x não entende lab()/oklab(),
        // usados pelo Tailwind 4. O foreignObject delega essas cores ao navegador.
        foreignObjectRendering: true,
        scale: Math.min(window.devicePixelRatio || 1, 2),
        useCORS: true,
        logging: false,
        ignoreElements: (element) => element.hasAttribute('data-export-ignore'),
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const margin = 8;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const printableWidth = pageWidth - margin * 2;
    const printableHeight = pageHeight - margin * 2;
    const imageHeight = (canvas.height * printableWidth) / canvas.width;
    const image = canvas.toDataURL('image/jpeg', 0.92);
    let offset = 0;
    let page = 0;

    while (offset < imageHeight) {
        if (page > 0) pdf.addPage();

        pdf.setFillColor(9, 9, 11);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        pdf.addImage(image, 'JPEG', margin, margin - offset, printableWidth, imageHeight, undefined, 'FAST');

        offset += printableHeight;
        page += 1;
    }

    const title = options.fileName ?? options.title ?? report.querySelector('h1')?.textContent ?? 'Relatório';
    pdf.save(`${normalizarNomeArquivo(title)}.pdf`);
}
