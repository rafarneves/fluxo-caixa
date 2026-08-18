'use client';

import { forwardRef } from 'react';
import { TextField, type TextFieldProps } from '@mui/material';

type Props = Omit<TextFieldProps, 'error'> & {
    error?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className, ...props }, ref) => (
    <TextField
        {...props}
        inputRef={ref}
        label={label}
        error={Boolean(error)}
        helperText={error}
        fullWidth
        size="small"
        className={className}
        slotProps={{ htmlInput: { 'aria-invalid': Boolean(error) } }}
    />
));

Input.displayName = 'Input';

export default Input;
