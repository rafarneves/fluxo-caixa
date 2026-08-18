'use client';

import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
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
    cliente_id: string;
    valor: number;
    vencimento: number;
    nome: string | null;
    status: string;
};

export default function ContractsTable({ contratos }: { contratos: Contrato[] }) {
    const { formatarMoeda } = useConfiguracoes();
    return (
        <Card component="section">
            <CardContent>
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography
                            variant="overline"
                            color="text.secondary"
                            sx={{ fontWeight: 800, letterSpacing: '.18em' }}
                        >
                            Operação
                        </Typography>
                        <Typography component="h2" variant="h5" sx={{ mt: 0.5, fontWeight: 800 }}>
                            Contratos Ativos
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            {contratos.length} contrato(s) ativo(s)
                        </Typography>
                    </Box>
                    <Avatar variant="rounded" sx={{ color: 'primary.light', bgcolor: 'rgba(34,197,94,.1)' }}>
                        <DescriptionRounded />
                    </Avatar>
                </Stack>
            </CardContent>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Plano</TableCell>
                            <TableCell>Valor</TableCell>
                            <TableCell>Vencimento</TableCell>
                            <TableCell align="right">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contratos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                    Nenhum contrato ativo encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            contratos.map((contrato) => (
                                <TableRow key={contrato.id} hover>
                                    <TableCell>
                                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    width: 38,
                                                    height: 38,
                                                    color: 'primary.light',
                                                    bgcolor: 'rgba(34,197,94,.1)',
                                                }}
                                            >
                                                {(contrato.nome ?? 'P').charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    {contrato.nome ?? 'Plano Personalizado'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Contrato ativo
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ color: 'primary.light', fontWeight: 750 }}>
                                        {formatarMoeda(Number(contrato.valor))}
                                    </TableCell>
                                    <TableCell>Dia {contrato.vencimento}</TableCell>
                                    <TableCell align="right">
                                        <Badge color="green">{contrato.status}</Badge>
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
