'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonAddRounded from '@mui/icons-material/PersonAddRounded';
import { Alert, Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';
import PageHeader from '@/components/ui/PageHeader';
import { createClient } from '@/lib/supabase/client';

const mascaraTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    return numeros.length <= 10
        ? numeros.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
        : numeros.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
};
export default function NovoClientePage() {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [loja, setLoja] = useState('');
    const [telefone, setTelefone] = useState('');
    const [erro, setErro] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);
    async function salvarCliente() {
        setErro(null);
        const telefoneLimpo = telefone.replace(/\D/g, '');
        if (nome.trim().length < 3) {
            setErro('Informe um nome válido.');
            return;
        }
        if (telefoneLimpo.length !== 11) {
            setErro('Informe um telefone válido com DDD.');
            return;
        }
        setSalvando(true);
        const supabase = createClient();
        const { error } = await supabase.from('clientes').insert({
            nome,
            loja,
            telefone: telefoneLimpo,
            status: 'Ativo',
        });
        setSalvando(false);
        if (error) {
            setErro(error.message);
            return;
        }
        router.push('/clientes');
        router.refresh();
    }
    return (
        <main>
            <PageHeader title="Novo Cliente" description="Cadastro de novo cliente." />
            <Card sx={{ maxWidth: 840 }}>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                    <Typography component="h2" variant="h5" sx={{ mb: 3, fontWeight: 800 }}>
                        Informações do Cliente
                    </Typography>
                    <Stack spacing={2.5}>
                        {erro && (
                            <Alert severity="error" variant="outlined">
                                {erro}
                            </Alert>
                        )}
                        <Grid container spacing={2.25}>
                            <Grid size={12}>
                                <TextField
                                    label="Nome"
                                    value={nome}
                                    onChange={(event) => setNome(event.target.value)}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Nome da loja"
                                    value={loja}
                                    onChange={(event) => setLoja(event.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Telefone"
                                    value={telefone}
                                    onChange={(event) => setTelefone(mascaraTelefone(event.target.value))}
                                    placeholder="(41) 99999-9999"
                                    fullWidth
                                    slotProps={{ htmlInput: { maxLength: 15 } }}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            onClick={salvarCliente}
                            disabled={salvando}
                            startIcon={<PersonAddRounded />}
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            {salvando ? 'Salvando...' : 'Salvar Cliente'}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </main>
    );
}
