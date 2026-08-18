'use client';

import { useState } from 'react';
import SaveRounded from '@mui/icons-material/SaveRounded';
import { Box, Button, Divider, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { criarDespesa } from './actions';

const categorias = [
    'Pró-labore',
    'Salários',
    'Estrutura',
    'Softwares',
    'Marketing',
    'Transporte',
    'Comercial',
    'Telefonia',
    'Equipamentos',
    'Informática',
    'Capacitação',
    'Contabilidade e Jurídico',
    'Impostos',
    'Financeiro',
    'Materiais',
    'Benefícios',
    'Eventos',
    'Outros',
];

export default function FormDespesa() {
    const [tipo, setTipo] = useState('Fixa');
    return (
        <Box component="form" action={criarDespesa}>
            <Grid container spacing={2.5}>
                <Grid size={12}>
                    <TextField
                        name="descricao"
                        label="Descrição"
                        placeholder="Ex: Assinatura ChatGPT"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField select name="categoria" label="Categoria" defaultValue="Softwares" fullWidth>
                        {categorias.map((categoria) => (
                            <MenuItem key={categoria} value={categoria}>
                                {categoria}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        select
                        name="tipo"
                        label="Tipo da despesa"
                        value={tipo}
                        onChange={(event) => setTipo(event.target.value)}
                        fullWidth
                    >
                        <MenuItem value="Fixa">Fixa</MenuItem>
                        <MenuItem value="Variável">Variável</MenuItem>
                    </TextField>
                </Grid>
                {tipo === 'Fixa' ? (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            name="dia_vencimento"
                            type="number"
                            label="Dia do vencimento"
                            placeholder="Ex: 5"
                            fullWidth
                            slotProps={{ htmlInput: { min: 1, max: 31 } }}
                        />
                    </Grid>
                ) : (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            name="data"
                            type="date"
                            label="Data"
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                    </Grid>
                )}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        name="valor"
                        type="number"
                        label="Valor"
                        placeholder="Ex: 120,00"
                        required
                        fullWidth
                        slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                    />
                </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                <Button type="submit" size="large" startIcon={<SaveRounded />}>
                    Salvar Despesa
                </Button>
            </Stack>
        </Box>
    );
}
