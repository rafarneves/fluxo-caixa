'use client';

import { type FormEvent, type ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import BusinessRounded from '@mui/icons-material/BusinessRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import CloudDoneRounded from '@mui/icons-material/CloudDoneRounded';
import EmailRounded from '@mui/icons-material/EmailRounded';
import NotificationsRounded from '@mui/icons-material/NotificationsRounded';
import PaletteRounded from '@mui/icons-material/PaletteRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';
import SecurityRounded from '@mui/icons-material/SecurityRounded';
import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    MenuItem,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';

import Button from '@/components/ui/Button';
import PageHeader from '@/components/ui/PageHeader';
import { configuracoesParaRow, type Configuracoes } from '@/lib/configuracoes';
import { createClient } from '@/lib/supabase/client';

export default function ConfiguracoesForm({ configuracoesIniciais }: { configuracoesIniciais: Configuracoes }) {
    const router = useRouter();
    const [configuracoes, setConfiguracoes] = useState(configuracoesIniciais);
    const [salvo, setSalvo] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    function atualizar<K extends keyof Configuracoes>(campo: K, valor: Configuracoes[K]) {
        setConfiguracoes((atual) => ({ ...atual, [campo]: valor }));

        if (campo === 'interfaceCompacta') {
            document.documentElement.dataset.interfaceCompacta = String(valor);
        }

        setSalvo(false);
    }
    async function salvar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSalvando(true);
        setErro(null);
        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            setErro('Sua sessão expirou. Entre novamente no sistema.');
            setSalvando(false);
            return;
        }
        const { error } = await supabase
            .from('configuracoes')
            .upsert(configuracoesParaRow(configuracoes, user.id), { onConflict: 'usuario_id' });
        if (error) {
            setErro('Não foi possível salvar. Verifique a tabela e as políticas RLS no Supabase.');
            setSalvando(false);
            return;
        }
        setSalvo(true);
        setSalvando(false);
        router.refresh();
    }

    return (
        <Box component="form" onSubmit={salvar}>
            <PageHeader
                title="Configurações"
                description="Gerencie os dados da empresa e as preferências de uso do sistema."
                actions={
                    <Button type="submit" disabled={salvando} icon={salvo ? <CheckCircleRounded /> : <SaveRounded />}>
                        {salvando ? 'Salvando...' : salvo ? 'Alterações salvas' : 'Salvar alterações'}
                    </Button>
                }
            />
            <Stack spacing={2} sx={{ mb: 3 }}>
                {salvo && (
                    <Alert severity="success" variant="outlined" icon={<CheckCircleRounded />}>
                        Preferências salvas e aplicadas ao sistema.
                    </Alert>
                )}
                {erro && (
                    <Alert severity="error" variant="outlined">
                        {erro}
                    </Alert>
                )}
            </Stack>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, xl: 7 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                            <SectionTitle
                                icon={<BusinessRounded />}
                                title="Dados da empresa"
                                description="Informações usadas na identificação e nos relatórios do ERP."
                            />
                            <Divider sx={{ my: 3 }} />
                            <Grid container spacing={2.25}>
                                <Grid size={12}>
                                    <TextField
                                        label="Nome da empresa"
                                        value={configuracoes.empresa}
                                        onChange={(event) => atualizar('empresa', event.target.value)}
                                        placeholder="Nome da empresa"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="E-mail administrativo"
                                        type="email"
                                        value={configuracoes.email}
                                        onChange={(event) => atualizar('email', event.target.value)}
                                        placeholder="financeiro@empresa.com"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Telefone"
                                        value={configuracoes.telefone}
                                        onChange={(event) => atualizar('telefone', event.target.value)}
                                        placeholder="(41) 99999-9999"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        select
                                        label="Moeda"
                                        value={configuracoes.moeda}
                                        onChange={(event) =>
                                            atualizar('moeda', event.target.value as Configuracoes['moeda'])
                                        }
                                        fullWidth
                                    >
                                        <MenuItem value="BRL">Real brasileiro (BRL)</MenuItem>
                                        <MenuItem value="USD">Dólar americano (USD)</MenuItem>
                                        <MenuItem value="EUR">Euro (EUR)</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        select
                                        label="Fuso horário"
                                        value={configuracoes.fusoHorario}
                                        onChange={(event) => atualizar('fusoHorario', event.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem value="America/Sao_Paulo">Brasília (GMT-3)</MenuItem>
                                        <MenuItem value="America/Manaus">Manaus (GMT-4)</MenuItem>
                                        <MenuItem value="America/Rio_Branco">Rio Branco (GMT-5)</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, xl: 5 }}>
                    <Stack spacing={3}>
                        <Card>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <SectionTitle icon={<NotificationsRounded />} title="Notificações" />
                                <Divider sx={{ my: 2 }} />
                                <Toggle
                                    label="Vencimentos próximos"
                                    description="Exibe contas e recebimentos dos próximos 7 dias."
                                    checked={configuracoes.notificacoesVencimento}
                                    onChange={(checked) => atualizar('notificacoesVencimento', checked)}
                                />
                                <Toggle
                                    label="Resumo semanal"
                                    description="Mostra entradas, saídas e saldo da semana atual."
                                    checked={configuracoes.resumoSemanal}
                                    onChange={(checked) => atualizar('resumoSemanal', checked)}
                                />
                                <Toggle
                                    label="Alertas financeiros"
                                    description="Destaca valores vencidos e riscos financeiros."
                                    checked={configuracoes.alertasFinanceiros}
                                    onChange={(checked) => atualizar('alertasFinanceiros', checked)}
                                />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <SectionTitle icon={<PaletteRounded />} title="Aparência" />
                                <Divider sx={{ my: 2 }} />
                                <Toggle
                                    label="Interface compacta"
                                    description="Reduz cards, tabelas, campos e navegação de forma consistente."
                                    checked={configuracoes.interfaceCompacta}
                                    onChange={(checked) => atualizar('interfaceCompacta', checked)}
                                />
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>

            <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <InfoCard
                        icon={<SecurityRounded />}
                        title="Ambiente seguro"
                        description="As credenciais ficam protegidas pelas variáveis de ambiente."
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <InfoCard
                        icon={<CloudDoneRounded />}
                        title="Banco de dados"
                        description="Integração com Supabase configurada e disponível."
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <InfoCard
                        icon={<EmailRounded />}
                        title="Suporte"
                        description="Use o e-mail administrativo para comunicações do sistema."
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

function SectionTitle({ icon, title, description }: { icon: ReactNode; title: string; description?: string }) {
    return (
        <Stack direction="row" spacing={1.75} sx={{ alignItems: 'flex-start' }}>
            <Avatar variant="rounded" sx={{ color: 'primary.light', bgcolor: 'rgba(34,197,94,.1)' }}>
                {icon}
            </Avatar>
            <Box>
                <Typography component="h2" variant="h6" sx={{ fontWeight: 800 }}>
                    {title}
                </Typography>
                {description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                        {description}
                    </Typography>
                )}
            </Box>
        </Stack>
    );
}

function Toggle({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
            <Box>
                <Typography variant="body2" sx={{ fontWeight: 650 }}>
                    {label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {description}
                </Typography>
            </Box>
            <Switch
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                slotProps={{ input: { 'aria-label': label } }}
            />
        </Stack>
    );
}

function InfoCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Stack direction="row" spacing={1.75}>
                    <Avatar variant="rounded" sx={{ color: 'primary.light', bgcolor: 'rgba(34,197,94,.1)' }}>
                        {icon}
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontWeight: 750 }}>{title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                            {description}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}
