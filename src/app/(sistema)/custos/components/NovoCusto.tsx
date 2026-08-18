'use client';

import { useState } from 'react';
import SaveRounded from '@mui/icons-material/SaveRounded';
import { Button, Card, CardContent, CircularProgress, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { criarCusto } from '../actions';

type Contrato = { id: string; cliente: string };
const custos = ['Tráfego Pago', 'Designer', 'Social Media', 'Planejamento', 'Combustível', 'Alimentação'];

export default function NovoCusto({ contratos }: { contratos: Contrato[] }) {
    const [pending, setPending] = useState(false);
    return (
        <Card
            component="form"
            action={async (formData) => {
                setPending(true);
                try {
                    await criarCusto(formData);
                    window.location.reload();
                } finally {
                    setPending(false);
                }
            }}
        >
            <CardContent>
                <Stack spacing={2.25}>
                    <Typography component="h2" variant="h5" sx={{ fontWeight: 800 }}>
                        Novo Custo
                    </Typography>
                    <TextField select name="contrato_id" label="Contrato" required defaultValue="" fullWidth>
                        {contratos.map((contrato) => (
                            <MenuItem key={contrato.id} value={contrato.id}>
                                {contrato.cliente}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField select name="descricao" label="Custo" required defaultValue="" fullWidth>
                        {custos.map((custo) => (
                            <MenuItem key={custo} value={custo}>
                                {custo}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        type="number"
                        name="valor"
                        label="Valor"
                        required
                        fullWidth
                        slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                    />
                    <Button
                        type="submit"
                        disabled={pending}
                        startIcon={pending ? <CircularProgress size={17} color="inherit" /> : <SaveRounded />}
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        {pending ? 'Salvando...' : 'Salvar Custo'}
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
