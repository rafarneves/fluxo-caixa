import jsPDF from 'jspdf';

import { PDF_THEME } from '@/lib/pdf/theme';
import { drawHeader } from '@/lib/pdf/header';
import { drawCards } from '@/lib/pdf/cards';
import { drawTable } from '@/lib/pdf/table';

export async function gerarPDFFluxoCaixa(
    linhas: any[],
    entradas: number,
    saidas: number,
    custos: number,
    saldo: number,
    moeda = 'BRL'
) {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    // Fundo

    pdf.setFillColor(...PDF_THEME.colors.background);

    pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');

    // ==========================
    // Logo
    // ==========================

    let logo: HTMLImageElement | undefined;

    try {
        logo = new Image();

        logo.src = '/logo/LOGO ALTUZA - HORIZONTAL.png';

        await new Promise((resolve, reject) => {
            logo!.onload = () => resolve(null);

            logo!.onerror = reject;
        });
    } catch {
        logo = undefined;
    }

    // ==========================
    // Cabeçalho
    // ==========================

    await drawHeader(pdf, {
        title: 'Fluxo de Caixa',
        logo,
    });

    // ==========================
    // KPIs
    // ==========================

    drawCards(pdf, [
        {
            title: 'Entradas',
            value: entradas.toLocaleString('pt-BR', {
                style: 'currency',
                currency: moeda,
            }),
            color: PDF_THEME.colors.success,
        },

        {
            title: 'Saídas',
            value: saidas.toLocaleString('pt-BR', {
                style: 'currency',
                currency: moeda,
            }),
            color: PDF_THEME.colors.danger,
        },

        {
            title: 'Custos',
            value: custos.toLocaleString('pt-BR', {
                style: 'currency',
                currency: moeda,
            }),
            color: PDF_THEME.colors.warning,
        },

        {
            title: 'Saldo',
            value: saldo.toLocaleString('pt-BR', {
                style: 'currency',
                currency: moeda,
            }),
            color: saldo >= 0 ? PDF_THEME.colors.success : PDF_THEME.colors.danger,
        },
    ]);

    // ==========================
    // Tabela
    // ==========================

    const rows = linhas.map((item) => ({
        tipo: item.tipo,
        descricao: item.descricao,

        valor: Number(item.valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: moeda,
        }),
    }));
    drawTable(
        pdf,
        [
            {
                header: 'Tipo',
                dataKey: 'tipo',
            },
            {
                header: 'Descrição',
                dataKey: 'descricao',
            },
            {
                header: 'Valor',
                dataKey: 'valor',
            },
        ],
        rows,
        82
    );

    // ==========================
    // Salvar PDF
    // ==========================

    pdf.save('Fluxo de Caixa.pdf');
}
