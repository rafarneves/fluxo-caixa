'use client';

import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import Badge from '@/components/ui/Badge';

type Contrato = {
    id: string;
    valor: number;
    nome: string | null;
    status: string;
    data_fim: string | null;
    clientes: { nome: string } | null;
};

export default function FinalizingContractsTable({ contratos }: { contratos: Contrato[] }) {
    const { formatarMoeda, formatarData } = useConfiguracoes();
    return (
        <Card component="section" sx={{ borderColor: 'rgba(245,158,11,.22)' }}>
            <CardContent>
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography
                            variant="overline"
                            color="warning.main"
                            sx={{ fontWeight: 800, letterSpacing: '.18em' }}
                        >
                            Atenção
                        </Typography>
                        <Typography component="h2" variant="h5" sx={{ mt: 0.5, fontWeight: 800 }}>
                            Contratos em Finalização
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            {contratos.length} contrato(s) vencendo nos próximos 30 dias
                        </Typography>
                    </Box>
                    <Avatar variant="rounded" sx={{ color: 'warning.main', bgcolor: 'rgba(245,158,11,.1)' }}>
                        <WarningAmberRounded />
                    </Avatar>
                </Stack>
            </CardContent>
            <TableContainer>
                <Table sx={{ minWidth: 760 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Plano</TableCell>
                            <TableCell>Valor</TableCell>
                            <TableCell>Finalização</TableCell>
                            <TableCell align="right">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contratos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                    Nenhum contrato vencendo nos próximos 30 dias.
                                </TableCell>
                            </TableRow>
                        ) : (
                            contratos.map((contrato) => (
                                <TableRow key={contrato.id} hover>
                                    <TableCell sx={{ fontWeight: 700 }}>
                                        {contrato.clientes?.nome ?? 'Cliente não informado'}
                                    </TableCell>
                                    <TableCell>{contrato.nome ?? 'Plano personalizado'}</TableCell>
                                    <TableCell sx={{ color: 'warning.main', fontWeight: 750 }}>
                                        {formatarMoeda(Number(contrato.valor))}
                                    </TableCell>
                                    <TableCell>
                                        {contrato.data_fim ? formatarData(contrato.data_fim) : 'Data não informada'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Badge color="yellow">Próximo do vencimento</Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}
