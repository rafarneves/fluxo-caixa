import type { ReactNode } from 'react';
import { Box } from '@mui/material';

export default function ResponsiveGrid({ children, columns = 4 }: { children: ReactNode; columns?: 2 | 3 | 4 | 5 }) {
    return (
        <Box
            component="section"
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: 'minmax(0, 1fr)',
                    md: 'repeat(2, minmax(0, 1fr))',
                    xl: `repeat(${columns}, minmax(0, 1fr))`,
                },
                gap: 3,
            }}
        >
            {children}
        </Box>
    );
}
