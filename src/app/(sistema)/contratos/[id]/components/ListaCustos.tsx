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
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';

type Custo = { id: string; categoria: string; descricao: string | null; valor: number; competencia: string | null };

export default function ListaCustos({ custos }: { custos: Custo[] }) {
    const formatMoney = useConfiguracoes().formatarMoeda;
    return (
        <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography component="h2" variant="h5" sx={{ fontWeight: 800 }}>
                    Custos do Contrato
                </Typography>
                <Typography color="text.secondary">{custos.length} registros</Typography>
            </CardContent>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Categoria</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Competência</TableCell>
                            <TableCell align="right">Valor</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {custos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                    Nenhum custo cadastrado para este contrato.
                                </TableCell>
                            </TableRow>
                        ) : (
                            custos.map((custo) => (
                                <TableRow key={custo.id} hover>
                                    <TableCell>{custo.categoria}</TableCell>
                                    <TableCell>{custo.descricao || '-'}</TableCell>
                                    <TableCell>{custo.competencia || '-'}</TableCell>
                                    <TableCell align="right" sx={{ color: 'error.main', fontWeight: 800 }}>
                                        {formatMoney(Number(custo.valor))}
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
