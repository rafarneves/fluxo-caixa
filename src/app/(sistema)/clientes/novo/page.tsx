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
const mascaraCep = (valor: string) => valor.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2');

export default function NovoClientePage() {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [loja, setLoja] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cep, setCep] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [erro, setErro] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);
    async function buscarCep(valor: string) {
        const cepLimpo = valor.replace(/\D/g, '');
        if (cepLimpo.length !== 8) return;
        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const dados = (await resposta.json()) as {
                erro?: boolean;
                logradouro?: string;
                bairro?: string;
                localidade?: string;
                uf?: string;
            };
            if (dados.erro) {
                setErro('CEP não encontrado.');
                return;
            }
            setRua(dados.logradouro ?? '');
            setBairro(dados.bairro ?? '');
            setCidade(dados.localidade ?? '');
            setEstado(dados.uf ?? '');
        } catch {
            setErro('Erro ao consultar CEP.');
        }
    }
    async function salvarCliente() {
        setErro(null);
        const telefoneLimpo = telefone.replace(/\D/g, '');
        const cepLimpo = cep.replace(/\D/g, '');
        if (nome.trim().length < 3) {
            setErro('Informe um nome válido.');
            return;
        }
        if (telefoneLimpo.length !== 11) {
            setErro('Informe um telefone válido com DDD.');
            return;
        }
        if (cepLimpo.length !== 8 || cidade.trim().length < 2) {
            setErro('Informe e busque um CEP válido antes de salvar.');
            return;
        }
        setSalvando(true);
        const supabase = createClient();
        const { error } = await supabase
            .from('clientes')
            .insert({
                nome,
                loja,
                telefone: telefoneLimpo,
                cep: cepLimpo,
                rua,
                numero,
                bairro,
                cidade,
                estado,
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
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="CEP"
                                    value={cep}
                                    onChange={(event) => {
                                        const valor = mascaraCep(event.target.value);
                                        setCep(valor);
                                        void buscarCep(valor);
                                    }}
                                    placeholder="00000-000"
                                    fullWidth
                                    slotProps={{ htmlInput: { maxLength: 9 } }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Número"
                                    value={numero}
                                    onChange={(event) => setNumero(event.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="Rua" value={rua} fullWidth disabled />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="Bairro" value={bairro} fullWidth disabled />
                            </Grid>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <TextField label="Cidade" value={cidade} fullWidth disabled />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Estado" value={estado} fullWidth disabled />
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
