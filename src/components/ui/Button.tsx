'use client';

import type { ReactNode } from 'react';
import { Button as MuiButton, type ButtonProps as MuiButtonProps } from '@mui/material';

type Props = Omit<MuiButtonProps, 'variant' | 'color' | 'startIcon'> & {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    icon?: ReactNode;
};

export default function Button({ children, variant = 'primary', icon, sx, ...props }: Props) {
    const outlined = variant === 'secondary' || variant === 'ghost';

    return (
        <MuiButton
            {...props}
            variant={outlined ? 'outlined' : 'contained'}
            color={variant === 'danger' ? 'error' : 'primary'}
            startIcon={icon}
            sx={[
                {
                    color: variant === 'secondary' ? 'text.primary' : undefined,
                    borderColor: variant === 'secondary' ? 'divider' : undefined,
                    bgcolor: variant === 'ghost' ? 'transparent' : undefined,
                    colorScheme: 'dark',
                    '&:active': { transform: 'scale(0.98)' },
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            {children}
        </MuiButton>
    );
}
