'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SaveRounded from '@mui/icons-material/SaveRounded';
import { Alert, Button, Card, CardContent, Stack, TextField } from '@mui/material';
import PageHeader from '@/components/ui/PageHeader';
import { createClient } from '@/lib/supabase/client';

export default function NovaContaPage() {
    const router = useRouter();
    const [descricao, setDescricao] = useState('');
    const [categoria, setCategoria] = useState('');
    const [valor, setValor] = useState('');
    const [vencimento, setVencimento] = useState('');
    const [erro, setErro] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);
    async function salvarConta() {
        setErro(null);
        setSalvando(true);
        const supabase = createClient();
        const { error } = await supabase
            .from('contas_pagar')
            .insert({ descricao, categoria, valor: Number(valor), vencimento: Number(vencimento), status: 'Pendente' });
        setSalvando(false);
        if (error) {
            setErro(error.message);
            return;
        }
        router.push('/contas-pagar');
        router.refresh();
    }
    return (
        <main>
            <PageHeader title="Nova Conta" description="Cadastre uma nova despesa." />
            <Card sx={{ maxWidth: 680 }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                    <Stack spacing={2.25}>
                        {erro && (
                            <Alert severity="error" variant="outlined">
                                {erro}
                            </Alert>
                        )}
                        <TextField
                            label="Descrição"
                            value={descricao}
                            onChange={(event) => setDescricao(event.target.value)}
                            required
                        />
                        <TextField
                            label="Categoria"
                            value={categoria}
                            onChange={(event) => setCategoria(event.target.value)}
                            required
                        />
                        <TextField
                            type="number"
                            label="Valor"
                            value={valor}
                            onChange={(event) => setValor(event.target.value)}
                            required
                            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                        />
                        <TextField
                            type="number"
                            label="Dia do vencimento"
                            value={vencimento}
                            onChange={(event) => setVencimento(event.target.value)}
                            required
                            slotProps={{ htmlInput: { min: 1, max: 31 } }}
                        />
                        <Button
                            onClick={salvarConta}
                            disabled={salvando}
                            startIcon={<SaveRounded />}
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            {salvando ? 'Salvando...' : 'Salvar Conta'}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </main>
    );
}
