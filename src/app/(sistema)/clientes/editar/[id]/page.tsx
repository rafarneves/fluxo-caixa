'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SaveRounded from '@mui/icons-material/SaveRounded';
import { Alert, Button, Card, CardContent, Stack, TextField } from '@mui/material';
import PageHeader from '@/components/ui/PageHeader';
import PageLoading from '@/components/ui/PageLoading';
import { createClient } from '@/lib/supabase/client';

type Cliente = { nome: string | null; telefone: string | null };

export default function EditarCliente() {
    const router = useRouter();
    const id = useParams<{ id: string }>().id;
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);
    useEffect(() => {
        const supabase = createClient();
        void supabase
            .from('clientes')
            .select('nome,telefone')
            .eq('id', id)
            .single()
            .then(({ data, error }) => {
                if (error) setErro(error.message);
                setCliente(data as Cliente | null);
            });
    }, [id]);
    if (!cliente) return erro ? <Alert severity="error">{erro}</Alert> : <PageLoading />;
    async function salvar() {
        setErro(null);
        setSalvando(true);
        const supabase = createClient();
        const { error } = await supabase
            .from('clientes')
            .update({ nome: cliente?.nome, telefone: cliente?.telefone })
            .eq('id', id);
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
            <PageHeader title="Editar Cliente" description="Altere as informações cadastrais do cliente." />
            <Card sx={{ maxWidth: 760 }}>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                    <Stack spacing={2.5}>
                        {erro && (
                            <Alert severity="error" variant="outlined">
                                {erro}
                            </Alert>
                        )}
                        <TextField
                            label="Nome"
                            value={cliente.nome ?? ''}
                            onChange={(event) => setCliente({ ...cliente, nome: event.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Telefone"
                            value={cliente.telefone ?? ''}
                            onChange={(event) => setCliente({ ...cliente, telefone: event.target.value })}
                            fullWidth
                        />
                        <Button
                            onClick={salvar}
                            disabled={salvando}
                            startIcon={<SaveRounded />}
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            {salvando ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </main>
    );
}
