'use client';

import DeleteRounded from '@mui/icons-material/DeleteRounded';
import { Button } from '@mui/material';
import { excluirDespesa } from './actions';

export default function ExcluirDespesa({ id }: { id: string }) {
    const excluir = excluirDespesa.bind(null, id);
    return (
        <form action={excluir}>
            <Button type="submit" variant="outlined" color="error" startIcon={<DeleteRounded />}>
                Excluir
            </Button>
        </form>
    );
}
