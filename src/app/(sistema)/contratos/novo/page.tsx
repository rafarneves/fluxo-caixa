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
import CurrencyField from '@/components/ui/CurrencyField';
import PageHeader from '@/components/ui/PageHeader';
import { createClient } from '@/lib/supabase/client';

type Opcao = { id: string; nome: string };

const MESES_FIDELIDADE = Array.from({ length: 24 }, (_, indice) => indice + 1);

export default function NovoContratoPage() {
    const router = useRouter();
    const [clientes, setClientes] = useState<Opcao[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState(false);
    const [criando, setCriando] = useState(false);
    useEffect(() => {
        const supabase = createClient();
        void supabase
            .from('clientes')
            .select('id,nome')
            .order('nome')
            .then((clientesResult) => {
                if (clientesResult.error) {
                    setMensagem('Não foi possível carregar os clientes.');
                    setErro(true);
                } else {
                    setClientes(clientesResult.data ?? []);
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
                        <Grid size={{ xs: 12, md: 6 }}>
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
                                name="loja"
                                label="Nome da loja"
                                required
                                fullWidth
                                placeholder="Ex.: Loja Centro"
                                slotProps={{ htmlInput: { maxLength: 120 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                name="plano"
                                label="Plano"
                                required
                                fullWidth
                                placeholder="Ex.: Plano Performance"
                                slotProps={{ htmlInput: { maxLength: 120 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <CurrencyField name="valor" label="Valor mensal" required fullWidth />
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
                            <TextField
                                select
                                name="fidelidade_meses"
                                label="Fidelidade contratual"
                                defaultValue={12}
                                required
                                fullWidth
                            >
                                {MESES_FIDELIDADE.map((meses) => (
                                    <MenuItem key={meses} value={meses}>
                                        {meses} {meses === 1 ? 'mês' : 'meses'}
                                    </MenuItem>
                                ))}
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
