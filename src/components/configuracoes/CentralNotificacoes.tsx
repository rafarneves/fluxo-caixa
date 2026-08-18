'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AccountBalanceWalletRounded from '@mui/icons-material/AccountBalanceWalletRounded';
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded';
import NotificationsNoneRounded from '@mui/icons-material/NotificationsNoneRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import {
    Avatar,
    Badge,
    Box,
    ButtonBase,
    CircularProgress,
    Divider,
    IconButton,
    Popover,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';

import type { NotificacaoSistema, SeveridadeNotificacao, TipoNotificacao } from '@/lib/notificacoes';

const cores: Record<SeveridadeNotificacao, string> = {
    info: '#22d3ee',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
};

function IconeNotificacao({ tipo }: { tipo: TipoNotificacao }) {
    if (tipo === 'alerta') return <ErrorOutlineRounded fontSize="small" />;
    if (tipo === 'resumo') return <AccountBalanceWalletRounded fontSize="small" />;
    return <ScheduleRounded fontSize="small" />;
}

export default function CentralNotificacoes({ iniciais }: { iniciais: NotificacaoSistema[] }) {
    const pathname = usePathname();
    const [notificacoes, setNotificacoes] = useState(iniciais);
    const [ancora, setAncora] = useState<HTMLElement | null>(null);
    const [atualizando, setAtualizando] = useState(false);

    useEffect(() => {
        setNotificacoes(iniciais);
    }, [iniciais]);

    const atualizar = useCallback(async (mostrarProgresso = false) => {
        if (mostrarProgresso) setAtualizando(true);

        try {
            const resposta = await fetch('/api/notificacoes', { cache: 'no-store' });
            if (!resposta.ok) return;
            const dados = (await resposta.json()) as { notificacoes: NotificacaoSistema[] };
            setNotificacoes(dados.notificacoes);
        } finally {
            if (mostrarProgresso) setAtualizando(false);
        }
    }, []);

    useEffect(() => {
        void atualizar();
    }, [atualizar, pathname]);

    useEffect(() => {
        const intervalo = window.setInterval(() => void atualizar(), 60_000);
        const aoFocar = () => void atualizar();
        window.addEventListener('focus', aoFocar);

        return () => {
            window.clearInterval(intervalo);
            window.removeEventListener('focus', aoFocar);
        };
    }, [atualizar]);

    return (
        <>
            <Tooltip
                title={
                    notificacoes.length > 0
                        ? `${notificacoes.length} notificação${notificacoes.length === 1 ? '' : 'ões'}`
                        : 'Nenhuma notificação'
                }
            >
                <IconButton
                    color="inherit"
                    aria-label="Abrir central de notificações"
                    aria-haspopup="dialog"
                    aria-expanded={Boolean(ancora)}
                    onClick={(event) => setAncora(event.currentTarget)}
                >
                    <Badge badgeContent={notificacoes.length} color="error" max={9}>
                        <NotificationsNoneRounded />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Popover
                open={Boolean(ancora)}
                anchorEl={ancora}
                onClose={() => setAncora(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        sx: {
                            width: 390,
                            maxWidth: 'calc(100vw - 24px)',
                            mt: 1,
                            overflow: 'hidden',
                            border: 1,
                            borderColor: 'divider',
                        },
                    },
                }}
            >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', px: 2, py: 1.5 }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ fontWeight: 800 }}>Notificações</Typography>
                        <Typography variant="caption" color="text.secondary">
                            Atualizadas automaticamente
                        </Typography>
                    </Box>
                    <Tooltip title="Atualizar agora">
                        <span>
                            <IconButton
                                size="small"
                                disabled={atualizando}
                                aria-label="Atualizar notificações"
                                onClick={() => void atualizar(true)}
                            >
                                {atualizando ? <CircularProgress size={18} /> : <RefreshRounded fontSize="small" />}
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Configurar notificações">
                        <IconButton
                            component={Link}
                            href="/configuracoes"
                            size="small"
                            aria-label="Configurar notificações"
                            onClick={() => setAncora(null)}
                        >
                            <SettingsRounded fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Divider />

                <Box sx={{ maxHeight: 430, overflowY: 'auto' }}>
                    {notificacoes.length === 0 ? (
                        <Stack sx={{ alignItems: 'center', px: 3, py: 5, textAlign: 'center' }}>
                            <Avatar sx={{ color: 'text.secondary', bgcolor: 'rgba(148,163,184,.1)' }}>
                                <NotificationsNoneRounded />
                            </Avatar>
                            <Typography sx={{ mt: 1.5, fontWeight: 750 }}>Tudo em dia</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Não há alertas ativos com as preferências atuais.
                            </Typography>
                        </Stack>
                    ) : (
                        notificacoes.map((notificacao, indice) => (
                            <Box key={notificacao.id}>
                                {indice > 0 && <Divider />}
                                <ButtonBase
                                    component={Link}
                                    href={notificacao.href}
                                    onClick={() => setAncora(null)}
                                    sx={{ width: '100%', px: 2, py: 1.75, textAlign: 'left', alignItems: 'flex-start' }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 38,
                                            height: 38,
                                            mr: 1.5,
                                            color: cores[notificacao.severidade],
                                            bgcolor: `${cores[notificacao.severidade]}18`,
                                        }}
                                    >
                                        <IconeNotificacao tipo={notificacao.tipo} />
                                    </Avatar>
                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 750 }}>
                                            {notificacao.titulo}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ display: 'block', mt: 0.35, lineHeight: 1.5 }}
                                        >
                                            {notificacao.descricao}
                                        </Typography>
                                    </Box>
                                </ButtonBase>
                            </Box>
                        ))
                    )}
                </Box>
            </Popover>
        </>
    );
}
