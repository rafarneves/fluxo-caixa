'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import HandshakeRounded from '@mui/icons-material/HandshakeRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import PageHeader from '@/components/ui/PageHeader';
import { createClient } from '@/lib/supabase/client';

type Cliente = { id: string; nome: string };

export default function NovaIndicacaoPage() {
    const router = useRouter();
    const { moeda } = useConfiguracoes();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [clienteIndicador, setClienteIndicador] = useState('');
    const [clienteIndicado, setClienteIndicado] = useState('');
    const [valorDesconto, setValorDesconto] = useState('200');
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    useEffect(() => {
        const supabase = createClient();
        void supabase
            .from('clientes')
            .select('id,nome')
            .eq('status', 'Ativo')
            .order('nome')
            .then(({ data }) => setClientes((data as Cliente[] | null) ?? []));
    }, []);
    async function salvarIndicacao() {
        setErro(null);
        if (!clienteIndicador || !clienteIndicado) {
            setErro('Selecione os clientes.');
            return;
        }
        if (clienteIndicador === clienteIndicado) {
            setErro('O cliente indicador não pode ser o mesmo cliente indicado.');
            return;
        }
        setSalvando(true);
        const supabase = createClient();
        const { error } = await supabase
            .from('indicacoes')
            .insert({
                cliente_indicador: clienteIndicador,
                cliente_indicado: clienteIndicado,
                valor_desconto: Number(valorDesconto),
                status: 'Ativo',
            });
        setSalvando(false);
        if (error) {
            setErro(error.message);
            return;
        }
        router.push('/indicacoes');
        router.refresh();
    }
    return (
        <Box>
            <PageHeader
                title="Nova Indicação"
                description="Cadastre uma nova indicação e configure o benefício mensal."
                actions={
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowBackRounded />}
                        onClick={() => router.back()}
                    >
                        Voltar
                    </Button>
                }
            />
            <Card>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                    <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
                        <Avatar
                            variant="rounded"
                            sx={{ width: 52, height: 52, color: 'primary.light', bgcolor: 'rgba(34,197,94,.12)' }}
                        >
                            <HandshakeRounded />
                        </Avatar>
                        <Box>
                            <Typography component="h2" variant="h5" sx={{ fontWeight: 800 }}>
                                Cadastro da Indicação
                            </Typography>
                            <Typography color="text.secondary">
                                Informe os clientes participantes da indicação.
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack spacing={2.5}>
                        {erro && (
                            <Alert severity="error" variant="outlined">
                                {erro}
                            </Alert>
                        )}
                        <TextField
                            select
                            label="Cliente Indicador"
                            value={clienteIndicador}
                            onChange={(event) => setClienteIndicador(event.target.value)}
                            fullWidth
                        >
                            <MenuItem value="">Selecione quem indicou</MenuItem>
                            {clientes.map((cliente) => (
                                <MenuItem key={cliente.id} value={cliente.id}>
                                    {cliente.nome}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Cliente Indicado"
                            value={clienteIndicado}
                            onChange={(event) => setClienteIndicado(event.target.value)}
                            fullWidth
                        >
                            <MenuItem value="">Selecione o cliente indicado</MenuItem>
                            {clientes.map((cliente) => (
                                <MenuItem key={cliente.id} value={cliente.id}>
                                    {cliente.nome}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            type="number"
                            label={`Benefício Mensal (${moeda})`}
                            value={valorDesconto}
                            onChange={(event) => setValorDesconto(event.target.value)}
                            fullWidth
                            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                        />
                        <Button
                            onClick={salvarIndicacao}
                            disabled={salvando}
                            startIcon={salvando ? <CircularProgress size={17} color="inherit" /> : <SaveRounded />}
                            sx={{ alignSelf: { sm: 'flex-end' } }}
                        >
                            {salvando ? 'Salvando...' : 'Salvar Indicação'}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
