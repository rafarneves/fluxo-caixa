import type { Key, ReactNode } from 'react';
import {
    Box,
    Card,
    CardContent,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';

export type ReportColumn<T> = {
    key: keyof T | string;
    title: string;
    align?: 'left' | 'center' | 'right';
    render?: (item: T) => ReactNode;
};
type ReportTableProps<T> = {
    title: string;
    description?: string;
    columns: ReportColumn<T>[];
    data: T[];
    actions?: ReactNode;
    emptyMessage?: string;
    rowKey?: (item: T, index: number) => Key;
};

export default function ReportTable<T>({
    title,
    description,
    columns,
    data,
    actions,
    emptyMessage = 'Nenhum registro encontrado.',
    rowKey,
}: ReportTableProps<T>) {
    const getRowKey = (item: T, index: number) => {
        if (rowKey) return rowKey(item, index);
        if (typeof item === 'object' && item !== null && 'id' in item) return String(item.id);
        return index;
    };

    return (
        <Card component="section">
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, '&:last-child': { pb: { xs: 2.5, md: 3.5 } } }}>
                <Stack
                    direction={{ xs: 'column', lg: 'row' }}
                    spacing={2}
                    sx={{ justifyContent: 'space-between', alignItems: { lg: 'center' } }}
                >
                    <Box>
                        <Typography
                            variant="overline"
                            color="text.secondary"
                            sx={{ fontWeight: 800, letterSpacing: '.18em' }}
                        >
                            Relatório
                        </Typography>
                        <Typography component="h2" variant="h5" sx={{ mt: 0.5, fontWeight: 800 }}>
                            {title}
                        </Typography>
                        {description && (
                            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                                {description}
                            </Typography>
                        )}
                    </Box>
                    {actions && <Box>{actions}</Box>}
                </Stack>
            </CardContent>
            <Divider />
            <TableContainer>
                <Table sx={{ minWidth: 680 }}>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={String(column.key)}
                                    align={column.align}
                                    data-export-ignore={column.key === 'acoes' ? '' : undefined}
                                >
                                    {column.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    align="center"
                                    sx={{ py: 7, color: 'text.secondary' }}
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, index) => (
                                <TableRow key={getRowKey(item, index)} hover>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={String(column.key)}
                                            align={column.align}
                                            data-export-ignore={column.key === 'acoes' ? '' : undefined}
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            {column.render
                                                ? column.render(item)
                                                : ((item as Record<string, unknown>)[String(column.key)] as ReactNode)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Divider />
            <Box sx={{ px: { xs: 2.5, md: 3.5 }, py: 2, bgcolor: 'rgba(2,6,23,.24)' }}>
                <Typography variant="body2" color="text.secondary">
                    Total de registros:{' '}
                    <Box component="strong" sx={{ color: 'text.primary' }}>
                        {data.length}
                    </Box>
                </Typography>
            </Box>
        </Card>
    );
}
