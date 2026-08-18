'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import {
    Alert,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { criarContrato } from '@/actions/contratos';
import PageHeader from '@/components/ui/PageHeader';
import { createClient } from '@/lib/supabase/client';

type Opcao = { id: string; nome: string };

export default function NovoContratoPage() {
    const router = useRouter();
    const [clientes, setClientes] = useState<Opcao[]>([]);
    const [planos, setPlanos] = useState<Opcao[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState(false);
    const [criando, setCriando] = useState(false);
    useEffect(() => {
        const supabase = createClient();
        void Promise.all([
            supabase.from('clientes').select('id,nome').order('nome'),
            supabase.from('planos').select('id,nome').eq('ativo', true).order('ordem'),
        ]).then(([clientesResult, planosResult]) => {
            if (clientesResult.error || planosResult.error) {
                setMensagem('Não foi possível carregar os clientes e planos.');
                setErro(true);
            } else {
                setClientes(clientesResult.data ?? []);
                setPlanos(planosResult.data ?? []);
            }
            setCarregando(false);
        });
    }, []);
    async function enviarContrato(formData: FormData) {
        setCriando(true);
        setMensagem('');
        try {
            const resultado = await criarContrato(formData);
            if (resultado?.success) {
                setErro(false);
                setMensagem('Contrato criado com sucesso! Recebimento gerado.');
                setTimeout(() => {
                    router.push(`/contratos/${resultado.contratoId}`);
                    router.refresh();
                }, 1200);
            }
        } catch {
            setErro(true);
            setMensagem('Não foi possível criar o contrato. Confira os dados e tente novamente.');
            setCriando(false);
        }
    }
    return (
        <main>
            <PageHeader
                title="Novo Contrato"
                description="Crie um contrato e gere automaticamente o recebimento inicial."
            />
            {mensagem && (
                <Alert severity={erro ? 'error' : 'success'} variant="outlined" sx={{ mb: 3 }}>
                    {mensagem}
                </Alert>
            )}
            <Card component="form" action={enviarContrato} sx={{ maxWidth: 1040 }}>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                    <Typography component="h2" variant="h5" sx={{ mb: 3, fontWeight: 800 }}>
                        Informações do Contrato
                    </Typography>
                    <Grid container spacing={2.5}>
                        <Grid size={12}>
                            <TextField
                                select
                                name="cliente_id"
                                label="Cliente"
                                required
                                defaultValue=""
                                fullWidth
                                disabled={carregando}
                            >
                                <MenuItem value="">Selecione o cliente</MenuItem>
                                {clientes.map((cliente) => (
                                    <MenuItem key={cliente.id} value={cliente.id}>
                                        {cliente.nome}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                name="plano_id"
                                label="Plano"
                                required
                                defaultValue=""
                                fullWidth
                                disabled={carregando}
                            >
                                <MenuItem value="">
                                    {carregando ? 'Carregando planos...' : 'Selecione o plano'}
                                </MenuItem>
                                {planos.map((plano) => (
                                    <MenuItem key={plano.id} value={plano.id}>
                                        {plano.nome}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                name="valor"
                                type="number"
                                label="Valor mensal"
                                required
                                fullWidth
                                slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                name="vencimento"
                                type="number"
                                label="Dia vencimento"
                                required
                                fullWidth
                                slotProps={{ htmlInput: { min: 1, max: 31 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField select name="recorrencia" label="Recorrência" defaultValue="Mensal" fullWidth>
                                <MenuItem value="Mensal">Mensal</MenuItem>
                                <MenuItem value="Trimestral">Trimestral</MenuItem>
                                <MenuItem value="Anual">Anual</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                name="data_inicio"
                                type="date"
                                label="Data início"
                                required
                                fullWidth
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField name="descricao" label="Descrição" multiline rows={5} fullWidth />
                        </Grid>
                    </Grid>
                    <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                        <Button
                            type="submit"
                            disabled={criando || carregando}
                            startIcon={
                                criando ? <CircularProgress size={17} color="inherit" /> : <DescriptionRounded />
                            }
                        >
                            {criando ? 'Criando...' : 'Criar Contrato'}
                        </Button>
                        <Button component={Link} href="/contratos" variant="outlined" color="inherit">
                            Cancelar
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </main>
    );
}
