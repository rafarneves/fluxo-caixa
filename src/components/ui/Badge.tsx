import type { ReactNode } from 'react';
import { Chip } from '@mui/material';

type Props = {
    children: ReactNode;
    color?: 'green' | 'red' | 'yellow' | 'blue' | 'gray';
};

const cores = {
    green: { color: '#4ade80', borderColor: 'rgba(34,197,94,.24)', bgcolor: 'rgba(34,197,94,.11)' },
    red: { color: '#f87171', borderColor: 'rgba(239,68,68,.24)', bgcolor: 'rgba(239,68,68,.11)' },
    yellow: { color: '#fbbf24', borderColor: 'rgba(234,179,8,.24)', bgcolor: 'rgba(234,179,8,.11)' },
    blue: { color: '#22d3ee', borderColor: 'rgba(6,182,212,.24)', bgcolor: 'rgba(6,182,212,.11)' },
    gray: { color: '#d4d4d8', borderColor: 'rgba(113,113,122,.3)', bgcolor: 'rgba(39,39,42,.72)' },
};

export default function Badge({ children, color = 'gray' }: Props) {
    return <Chip label={children} size="small" variant="outlined" sx={{ height: 26, ...cores[color] }} />;
}
