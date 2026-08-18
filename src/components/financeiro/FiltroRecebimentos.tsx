'use client';

import { useState } from 'react';
import SearchRounded from '@mui/icons-material/SearchRounded';
import { InputAdornment, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import NovoRecebimentoModal from './NovoRecebimentoModal';

export default function FiltroRecebimentos({ contratoId }: { contratoId: string }) {
    const [status, setStatus] = useState('todos');
    return (
        <Paper variant="outlined" sx={{ mb: 3, p: 2, borderRadius: 3 }}>
            <Stack
                direction={{ xs: 'column', lg: 'row' }}
                spacing={2}
                sx={{ alignItems: { lg: 'center' }, justifyContent: 'space-between' }}
            >
                <TextField
                    size="small"
                    type="search"
                    placeholder="Pesquisar cliente..."
                    aria-label="Pesquisar cliente"
                    sx={{ width: { xs: '100%', lg: 320 } }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRounded fontSize="small" />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                    <ToggleButtonGroup
                        value={status}
                        exclusive
                        onChange={(_, value) => value && setStatus(value)}
                        size="small"
                    >
                        <ToggleButton value="todos">Todos</ToggleButton>
                        <ToggleButton value="pendentes">Pendentes</ToggleButton>
                        <ToggleButton value="pagos">Pagos</ToggleButton>
                        <ToggleButton value="atrasados">Atrasados</ToggleButton>
                    </ToggleButtonGroup>
                    <NovoRecebimentoModal contratoId={contratoId} />
                </Stack>
            </Stack>
        </Paper>
    );
}
