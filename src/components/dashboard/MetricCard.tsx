import { Box, Card, CardContent, Typography } from '@mui/material';

type Props = { title: string; value: string | number; subtitle: string; color?: string };

const cores: Record<string, string> = {
    'text-green-400': '#4ade80',
    'text-red-400': '#f87171',
    'text-cyan-400': '#22d3ee',
    'text-yellow-400': '#fbbf24',
    'text-white': '#f8fafc',
};

export default function MetricCard({ title, value, subtitle, color = 'text-white' }: Props) {
    return (
        <Card
            sx={{
                minHeight: 220,
                '&:hover': { transform: 'translateY(-3px)', borderColor: 'rgba(34,197,94,.38)' },
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 160,
                    height: 160,
                    borderRadius: '50%',
                    bgcolor: 'rgba(34,197,94,.06)',
                    filter: 'blur(25px)',
                }}
            />
            <CardContent
                sx={{
                    position: 'relative',
                    display: 'flex',
                    minHeight: 220,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 4,
                    '&:last-child': { pb: 4 },
                }}
            >
                <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '.2em' }}>
                        {title}
                    </Typography>
                    <Typography
                        sx={{
                            mt: 2.5,
                            color: cores[color] ?? color,
                            fontSize: { xs: 36, sm: 46 },
                            lineHeight: 1,
                            fontWeight: 800,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {value}
                    </Typography>
                </Box>
                <Typography color="text.secondary" sx={{ fontSize: 17 }}>
                    {subtitle}
                </Typography>
            </CardContent>
        </Card>
    );
}
