'use client';

import { useState } from 'react';
import SaveRounded from '@mui/icons-material/SaveRounded';
import {
    Button,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Grid,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import { adicionarCustoContrato } from '../actions';

const categorias = [
    'Editor',
    'Designer',
    'Tráfego Pago',
    'Combustível',
    'Pedágio',
    'Alimentação',
    'Hospedagem',
    'Hotel',
    'Freelancer',
    'Impressão',
    'Equipamentos',
    'Outros',
];

export default function NovoCustoContrato({ contratoId }: { contratoId: string }) {
    const [pending, setPending] = useState(false);
    return (
        <Card
            component="form"
            action={async (formData) => {
                setPending(true);
                try {
                    await adicionarCustoContrato(contratoId, formData);
                    window.location.reload();
                } finally {
                    setPending(false);
                }
            }}
        >
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Typography component="h2" variant="h5" sx={{ mb: 3, fontWeight: 800 }}>
                    Adicionar Custo
                </Typography>
                <Grid container spacing={2.25}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField select name="categoria" label="Categoria" required defaultValue="" fullWidth>
                            {categorias.map((categoria) => (
                                <MenuItem key={categoria} value={categoria}>
                                    {categoria}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            type="number"
                            name="valor"
                            label="Valor"
                            required
                            fullWidth
                            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField name="descricao" label="Descrição" fullWidth />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            type="month"
                            name="competencia"
                            label="Competência"
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel control={<Checkbox name="recorrente" />} label="Custo recorrente" />
                    </Grid>
                    <Grid size={12}>
                        <TextField name="observacao" label="Observações" multiline rows={4} fullWidth />
                    </Grid>
                    <Grid size={12}>
                        <Button
                            type="submit"
                            disabled={pending}
                            fullWidth
                            startIcon={pending ? <CircularProgress size={17} color="inherit" /> : <SaveRounded />}
                        >
                            {pending ? 'Salvando...' : 'Salvar Custo'}
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
