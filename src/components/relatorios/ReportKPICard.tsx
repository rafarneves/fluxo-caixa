import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react';
import { Avatar, Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';

import ReportKPIValue from '@/components/relatorios/ReportKPIValue';

type ReportKPICardProps = {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    color?: 'green' | 'blue' | 'red' | 'yellow';
    trend?: number;
    isCurrency?: boolean;
};

const cores = {
    green: { main: '#4ade80', soft: 'rgba(34,197,94,.11)', border: 'rgba(34,197,94,.22)' },
    blue: { main: '#22d3ee', soft: 'rgba(6,182,212,.11)', border: 'rgba(6,182,212,.22)' },
    red: { main: '#f87171', soft: 'rgba(239,68,68,.11)', border: 'rgba(239,68,68,.22)' },
    yellow: { main: '#fbbf24', soft: 'rgba(234,179,8,.11)', border: 'rgba(234,179,8,.22)' },
};

export default function ReportKPICard({
    title,
    value,
    icon: Icon,
    description,
    color = 'green',
    trend,
    isCurrency = true,
}: ReportKPICardProps) {
    const tom = cores[color];
    const positivo = (trend ?? 0) >= 0;

    return (
        <Card
            sx={{
                height: '100%',
                borderColor: tom.border,
                '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 22px 55px ${tom.soft}` },
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: -45,
                    right: -35,
                    width: 130,
                    height: 130,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${tom.soft} 0%, transparent 70%)`,
                    pointerEvents: 'none',
                }}
            />
            <CardContent sx={{ position: 'relative', p: 3, '&:last-child': { pb: 3 } }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="overline"
                            color="text.secondary"
                            sx={{ fontSize: 10, fontWeight: 800, letterSpacing: '.16em' }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            component="div"
                            sx={{
                                mt: 1,
                                color: tom.main,
                                fontSize: { xs: 26, sm: 30 },
                                fontWeight: 800,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <ReportKPIValue value={value} isCurrency={isCurrency} />
                        </Typography>
                        {description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                                {description}
                            </Typography>
                        )}
                    </Box>
                    <Avatar
                        variant="rounded"
                        sx={{ color: tom.main, bgcolor: tom.soft, border: `1px solid ${tom.border}` }}
                    >
                        <Icon size={20} />
                    </Avatar>
                </Stack>
                {trend !== undefined && (
                    <Box sx={{ mt: 2.5, textAlign: 'right' }}>
                        <Chip
                            icon={positivo ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            label={`${Math.abs(trend).toFixed(1)}%`}
                            size="small"
                            sx={{
                                color: positivo ? '#4ade80' : '#f87171',
                                bgcolor: positivo ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)',
                                '& .MuiChip-icon': { color: 'inherit' },
                            }}
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
