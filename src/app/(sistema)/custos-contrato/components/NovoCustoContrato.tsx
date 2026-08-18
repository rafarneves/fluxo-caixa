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
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { criarCustoContrato } from '../actions';

type Contrato = { id: string; cliente: string };
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

export default function NovoCustoContrato({ contratos }: { contratos: Contrato[] }) {
    const [pending, setPending] = useState(false);
    return (
        <Card
            component="form"
            action={async (formData) => {
                setPending(true);
                try {
                    await criarCustoContrato(formData);
                    window.location.reload();
                } finally {
                    setPending(false);
                }
            }}
        >
            <CardContent>
                <Stack spacing={2.1}>
                    <Typography component="h2" variant="h5" sx={{ fontWeight: 800 }}>
                        Novo Custo do Contrato
                    </Typography>
                    <TextField select name="contrato_id" label="Contrato" required defaultValue="">
                        {contratos.map((contrato) => (
                            <MenuItem key={contrato.id} value={contrato.id}>
                                {contrato.cliente}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField select name="categoria" label="Categoria" required defaultValue="">
                        {categorias.map((categoria) => (
                            <MenuItem key={categoria} value={categoria}>
                                {categoria}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField name="descricao" label="Descrição" />
                    <TextField
                        name="valor"
                        type="number"
                        label="Valor"
                        required
                        slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                    />
                    <TextField
                        name="competencia"
                        type="month"
                        label="Competência"
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <FormControlLabel control={<Checkbox name="recorrente" />} label="Custo recorrente" />
                    <TextField name="observacao" label="Observações" multiline rows={4} />
                    <Button
                        type="submit"
                        disabled={pending}
                        startIcon={pending ? <CircularProgress size={17} color="inherit" /> : <SaveRounded />}
                    >
                        {pending ? 'Salvando...' : 'Salvar Custo'}
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
