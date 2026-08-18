'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';
import { Alert, Button, Card, CardContent, CircularProgress, MenuItem, Stack, TextField } from '@mui/material';
import PageHeader from '@/components/ui/PageHeader';
import PageLoading from '@/components/ui/PageLoading';
import { createClient } from '@/lib/supabase/client';

type Cliente = { id: string; nome: string };

export default function EditarIndicacaoPage() {
    const router = useRouter();
    const id = useParams().id as string;
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [clienteIndicador, setClienteIndicador] = useState('');
    const [clienteIndicado, setClienteIndicado] = useState('');
    const [valorDesconto, setValorDesconto] = useState('200');
    const [status, setStatus] = useState('Ativo');
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    useEffect(() => {
        const supabase = createClient();
        void Promise.all([
            supabase.from('clientes').select('id,nome').eq('status', 'Ativo').order('nome'),
            supabase.from('indicacoes').select('*').eq('id', id).single(),
        ]).then(([clientesResult, indicacaoResult]) => {
            setClientes((clientesResult.data as Cliente[] | null) ?? []);
            const indicacao = indicacaoResult.data;
            if (indicacao) {
                setClienteIndicador(indicacao.cliente_indicador);
                setClienteIndicado(indicacao.cliente_indicado);
                setValorDesconto(String(indicacao.valor_desconto));
                setStatus(indicacao.status);
            }
            setCarregando(false);
        });
    }, [id]);
    async function salvar() {
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
            .update({
                cliente_indicador: clienteIndicador,
                cliente_indicado: clienteIndicado,
                valor_desconto: Number(valorDesconto),
                status,
            })
            .eq('id', id);
        setSalvando(false);
        if (error) {
            setErro(error.message);
            return;
        }
        router.push('/indicacoes');
        router.refresh();
    }
    if (carregando) return <PageLoading />;
    return (
        <main>
            <PageHeader
                title="Editar Indicação"
                description="Atualize os dados da indicação."
                actions={
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowBackRounded />}
                        onClick={() => router.push('/indicacoes')}
                    >
                        Voltar
                    </Button>
                }
            />
            <Card>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
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
                            <MenuItem value="">Selecione</MenuItem>
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
                            <MenuItem value="">Selecione</MenuItem>
                            {clientes.map((cliente) => (
                                <MenuItem key={cliente.id} value={cliente.id}>
                                    {cliente.nome}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            type="number"
                            label="Benefício Mensal"
                            value={valorDesconto}
                            onChange={(event) => setValorDesconto(event.target.value)}
                            fullWidth
                            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                        />
                        <TextField
                            select
                            label="Status"
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                            fullWidth
                        >
                            <MenuItem value="Ativo">Ativo</MenuItem>
                            <MenuItem value="Suspenso">Suspenso</MenuItem>
                        </TextField>
                        <Button
                            onClick={salvar}
                            disabled={salvando}
                            startIcon={salvando ? <CircularProgress size={17} color="inherit" /> : <SaveRounded />}
                            sx={{ alignSelf: { sm: 'flex-end' } }}
                        >
                            {salvando ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </main>
    );
}
