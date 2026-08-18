'use client';

import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import { Button } from '@mui/material';
import { marcarComoPago } from './actions';

export default function MarcarPago({ id }: { id: string }) {
    return (
        <form
            action={async () => {
                await marcarComoPago(id);
            }}
        >
            <Button type="submit" size="small" startIcon={<CheckCircleRounded />}>
                Marcar Pago
            </Button>
        </form>
    );
}
