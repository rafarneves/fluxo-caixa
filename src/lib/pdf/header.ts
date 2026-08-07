import jsPDF from 'jspdf';
import { PDF_THEME } from './theme';

type HeaderOptions = {
    title: string;
    logo?: HTMLImageElement;
};

export async function drawHeader(pdf: jsPDF, options: HeaderOptions) {
    const pageWidth = pdf.internal.pageSize.getWidth();

    const headerHeight = 38;

    // ==========================
    // FUNDO CABEÇALHO
    // ==========================

    pdf.setFillColor(...PDF_THEME.colors.primary);

    pdf.rect(0, 0, pageWidth, headerHeight, 'F');

    // ==========================
    // LOGO
    // ==========================

    if (options.logo) {
        const larguraLogo = 58;

        const proporcao = options.logo.height / options.logo.width;

        const alturaLogo = larguraLogo * proporcao;

        pdf.addImage(
            options.logo,
            'PNG',
            PDF_THEME.page.margin,
            (headerHeight - alturaLogo) / 2,
            larguraLogo,
            alturaLogo
        );
    }

    // ==========================
    // TEXTO DIREITO
    // ==========================

    const direita = pageWidth - PDF_THEME.page.margin;

    pdf.setTextColor(255, 255, 255);

    pdf.setFont('helvetica', 'bold');

    pdf.setFontSize(20);

    pdf.text(options.title.toUpperCase(), direita, 15, {
        align: 'right',
    });

    // Subtítulo

    pdf.setFont('helvetica', 'normal');

    pdf.setFontSize(9);

    pdf.text('ERP Financeiro Altuza Automotivo', direita, 21, {
        align: 'right',
    });

    // Data

    pdf.setFontSize(8);

    pdf.text(`Emitido em ${new Date().toLocaleString('pt-BR')}`, direita, 28, {
        align: 'right',
    });

    // ==========================
    // LINHA VERDE
    // ==========================

    pdf.setDrawColor(...PDF_THEME.colors.secondary);

    pdf.setLineWidth(1.2);

    pdf.line(0, headerHeight, pageWidth, headerHeight);
}
