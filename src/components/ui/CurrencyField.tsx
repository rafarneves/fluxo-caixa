'use client';

import { useState } from 'react';
import { InputAdornment, TextField, type TextFieldProps } from '@mui/material';

const formatador = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const somenteDigitos = (valor: string) => valor.replace(/\D/g, '').slice(0, 15);

const formatarDigitos = (digitos: string) => (digitos ? formatador.format(Number(digitos) / 100) : '');

type Props = Omit<TextFieldProps, 'value' | 'onChange' | 'name' | 'type'> & {
    /** Nome enviado no FormData, sempre como número simples (ex.: 1234.56). */
    name: string;
    defaultValue?: number;
};

/** Campo monetário em reais: aceita apenas números e formata como R$ 1.234,56. */
export default function CurrencyField({ name, defaultValue, required, ...props }: Props) {
    const [digitos, setDigitos] = useState(() =>
        defaultValue === undefined ? '' : String(Math.round(defaultValue * 100))
    );

    return (
        <>
            <TextField
                {...props}
                required={required}
                value={formatarDigitos(digitos)}
                onChange={(event) => setDigitos(somenteDigitos(event.target.value))}
                slotProps={{
                    ...props.slotProps,
                    input: {
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        ...props.slotProps?.input,
                    },
                    htmlInput: {
                        inputMode: 'numeric',
                        autoComplete: 'off',
                        ...props.slotProps?.htmlInput,
                    },
                }}
            />
            <input type="hidden" name={name} value={digitos ? String(Number(digitos) / 100) : ''} />
        </>
    );
}
