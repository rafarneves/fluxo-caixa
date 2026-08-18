'use client';

import { useState } from 'react';
import PictureAsPdfRounded from '@mui/icons-material/PictureAsPdfRounded';
import { Button, CircularProgress } from '@mui/material';

import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import { gerarPDFFluxoCaixa } from '@/lib/relatorios/fluxoCaixa';

type Linha = { tipo: string; descricao: string; valor: number };
type Props = { linhas: Linha[]; entradas: number; saidas: number; custos: number; saldo: number };

export default function ExportFluxoCaixaButton({ linhas, entradas, saidas, custos, saldo }: Props) {
    const [loading, setLoading] = useState(false);
    const { moeda } = useConfiguracoes();
    async function handleExport() {
        try {
            setLoading(true);
            gerarPDFFluxoCaixa(linhas, entradas, saidas, custos, saldo, moeda);
        } finally {
            setLoading(false);
        }
    }
    return (
        <Button
            type="button"
            onClick={handleExport}
            disabled={loading}
            variant="outlined"
            color="error"
            startIcon={loading ? <CircularProgress size={17} color="inherit" /> : <PictureAsPdfRounded />}
        >
            Exportar PDF
        </Button>
    );
}
