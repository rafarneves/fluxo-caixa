'use client';

import DeleteRounded from '@mui/icons-material/DeleteRounded';
import { IconButton, Tooltip } from '@mui/material';
import { removerCusto } from '../actions';

export default function ExcluirCusto({ id }: { id: string }) {
    return (
        <Tooltip title="Excluir custo">
            <IconButton
                color="error"
                aria-label="Excluir custo"
                onClick={async () => {
                    const confirmar = confirm('Deseja realmente excluir este custo?');
                    if (!confirmar) return;
                    await removerCusto(id);
                    window.location.reload();
                }}
            >
                <DeleteRounded />
            </IconButton>
        </Tooltip>
    );
}
