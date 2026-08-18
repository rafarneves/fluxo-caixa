'use client';

import SaveRounded from '@mui/icons-material/SaveRounded';
import { Button, Card, CardContent, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { criarCustoContrato } from '@/actions/criarCustoContrato';

const custos = ['Tráfego Pago', 'Designer', 'Social Media', 'Planejamento', 'Combustível', 'Alimentação'];

export default function NovoCustoContrato({ contratoId }: { contratoId: string }) {
    return (
        <Card component="form" action={criarCustoContrato}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Typography component="h2" variant="h5" sx={{ mb: 3, fontWeight: 800 }}>
                    Adicionar Custo
                </Typography>
                <input type="hidden" name="contrato_id" value={contratoId} />
                <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField select name="descricao" label="Descrição" required defaultValue="" fullWidth>
                            {custos.map((custo) => (
                                <MenuItem key={custo} value={custo}>
                                    {custo}
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
                </Grid>
                <Button type="submit" startIcon={<SaveRounded />} sx={{ mt: 3 }}>
                    Salvar Custo
                </Button>
            </CardContent>
        </Card>
    );
}
