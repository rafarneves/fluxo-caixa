'use client';

import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import ExcluirCusto from '@/app/(sistema)/custos/components/ExcluirCusto';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

type Custo = { id: string; descricao: string; valor: number };

export default function HistoricoCustos({ custos }: { custos: Custo[] }) {
    const formatMoney = useConfiguracoes().formatarMoeda;
    return (
        <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography component="h2" variant="h5" sx={{ fontWeight: 800 }}>
                    Custos do Contrato
                </Typography>
                <Typography color="text.secondary">
                    {custos.length} lançamento{custos.length !== 1 ? 's' : ''}
                </Typography>
            </CardContent>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Descrição</TableCell>
                            <TableCell align="right">Valor</TableCell>
                            <TableCell align="center">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {custos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                    Nenhum custo cadastrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            custos.map((custo) => (
                                <TableRow key={custo.id} hover>
                                    <TableCell>{custo.descricao}</TableCell>
                                    <TableCell align="right" sx={{ color: 'error.main', fontWeight: 800 }}>
                                        {formatMoney(Number(custo.valor))}
                                    </TableCell>
                                    <TableCell align="center">
                                        <ExcluirCusto id={custo.id} />
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
