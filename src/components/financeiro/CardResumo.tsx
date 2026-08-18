'use client';

import { Card, CardContent, Typography } from '@mui/material';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

const cores: Record<string, string> = {
    'text-green-400': '#4ade80',
    'text-red-400': '#f87171',
    'text-yellow-400': '#fbbf24',
    'text-cyan-400': '#22d3ee',
};

export default function CardResumo({ titulo, valor, cor }: { titulo: string; valor: number; cor: string }) {
    const { formatarMoeda } = useConfiguracoes();
    return (
        <Card>
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {titulo}
                </Typography>
                <Typography sx={{ mt: 1, color: cores[cor] ?? cor, fontSize: 28, fontWeight: 800 }}>
                    {formatarMoeda(valor)}
                </Typography>
            </CardContent>
        </Card>
    );
}
