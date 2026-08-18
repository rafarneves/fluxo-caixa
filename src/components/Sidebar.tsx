'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    ArticleRounded,
    AssessmentRounded,
    BarChartRounded,
    ChevronLeftRounded,
    ChevronRightRounded,
    CloseRounded,
    DashboardRounded,
    HandshakeRounded,
    LogoutRounded,
    MenuRounded,
    PaymentsRounded,
    PeopleAltRounded,
    ReceiptLongRounded,
    SettingsRounded,
    SwapHorizRounded,
} from '@mui/icons-material';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Stack,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';

import { logout } from '@/app/login/actions';
import CentralNotificacoes from '@/components/configuracoes/CentralNotificacoes';
import { useConfiguracoes } from '@/components/configuracoes/ConfiguracoesProvider';
import type { NotificacaoSistema } from '@/lib/notificacoes';

const SIDEBAR_STORAGE_KEY = 'altuza-sidebar-recolhida';
const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED_WIDTH = 76;

const grupos = [
    {
        titulo: 'DASHBOARD',
        itens: [{ nome: 'Dashboard', href: '/', icon: DashboardRounded }],
    },
    {
        titulo: 'FINANCEIRO',
        itens: [
            { nome: 'Cobranças', href: '/recebimentos', icon: PaymentsRounded },
            { nome: 'Fluxo de Caixa', href: '/fluxo-caixa', icon: SwapHorizRounded },
            { nome: 'DRE', href: '/dre', icon: BarChartRounded },
            { nome: 'Despesas', href: '/despesas', icon: ReceiptLongRounded },
        ],
    },
    {
        titulo: 'OPERAÇÃO',
        itens: [
            { nome: 'Clientes', href: '/clientes', icon: PeopleAltRounded },
            { nome: 'Contratos', href: '/contratos', icon: ArticleRounded },
            { nome: 'Indicações', href: '/indicacoes', icon: HandshakeRounded },
        ],
    },
    {
        titulo: 'GESTÃO',
        itens: [
            { nome: 'Relatórios', href: '/relatorios', icon: AssessmentRounded },
            { nome: 'Configurações', href: '/configuracoes', icon: SettingsRounded },
        ],
    },
];

const rotasAuxiliares = [
    { nome: 'Dashboard', href: '/dashboard', grupo: 'DASHBOARD' },
    { nome: 'Contas a Pagar', href: '/contas-pagar', grupo: 'FINANCEIRO' },
    { nome: 'Custos', href: '/custos', grupo: 'FINANCEIRO' },
    { nome: 'Custos por Contrato', href: '/custos-contrato', grupo: 'FINANCEIRO' },
];

function rotaAtiva(pathname: string, href: string) {
    return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
}

export default function Sidebar({
    children,
    userEmail,
    notificacoesIniciais,
}: {
    children: ReactNode;
    userEmail: string;
    notificacoesIniciais: NotificacaoSistema[];
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { empresa } = useConfiguracoes();
    const [menuMobileAberto, setMenuMobileAberto] = useState(false);
    const [recolhida, setRecolhida] = useState(false);
    const userName = userEmail.includes('@') ? userEmail.split('@')[0] : userEmail;
    const userInitial = userName.charAt(0).toUpperCase();
    const empresaInicial = empresa.trim().charAt(0).toUpperCase() || 'A';

    const paginaAtual = useMemo(() => {
        const itens = grupos.flatMap((grupo) => grupo.itens.map((item) => ({ ...item, grupo: grupo.titulo })));
        return (
            [...itens, ...rotasAuxiliares]
                .sort((a, b) => b.href.length - a.href.length)
                .find((item) => rotaAtiva(pathname, item.href)) ?? itens[0]
        );
    }, [pathname]);

    useEffect(() => {
        setRecolhida(window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true');
    }, []);

    useEffect(() => {
        setMenuMobileAberto(false);
    }, [pathname]);

    function alternarSidebar() {
        setRecolhida((estadoAtual) => {
            const proximoEstado = !estadoAtual;
            window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(proximoEstado));
            return proximoEstado;
        });
    }

    function conteudoDrawer(menuRecolhido: boolean, mobile = false) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    height: '100%',
                    minHeight: 0,
                    flexDirection: 'column',
                    overflow: 'hidden',
                    bgcolor: '#06090d',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        minHeight: 68,
                        alignItems: 'center',
                        justifyContent: menuRecolhido ? 'center' : 'space-between',
                        gap: 1,
                        px: menuRecolhido ? 1 : 2,
                    }}
                >
                    {menuRecolhido ? (
                        <Avatar
                            variant="rounded"
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                fontWeight: 900,
                            }}
                        >
                            {empresaInicial}
                        </Avatar>
                    ) : (
                        <Image
                            src="/logo-altuza-horizontal.png"
                            alt={empresa}
                            width={135}
                            height={48}
                            priority
                            draggable={false}
                            style={{ width: 135, height: 'auto', objectFit: 'contain' }}
                        />
                    )}

                    {!mobile && !menuRecolhido && (
                        <Tooltip title="Recolher menu" placement="right">
                            <IconButton
                                size="small"
                                onClick={alternarSidebar}
                                aria-label="Recolher menu lateral"
                                aria-expanded="true"
                                sx={{ color: 'text.secondary' }}
                            >
                                <ChevronLeftRounded />
                            </IconButton>
                        </Tooltip>
                    )}

                    {mobile && (
                        <IconButton
                            size="small"
                            onClick={() => setMenuMobileAberto(false)}
                            aria-label="Fechar menu principal"
                            sx={{ color: 'text.secondary' }}
                        >
                            <CloseRounded />
                        </IconButton>
                    )}
                </Box>

                <Divider />

                <Box
                    component="nav"
                    aria-label="Menu principal"
                    className="sidebar-scroll"
                    sx={{ flex: 1, minHeight: 0, overflowY: 'auto', py: 1.25 }}
                >
                    {grupos.map((grupo) => (
                        <List
                            key={grupo.titulo}
                            disablePadding
                            subheader={
                                menuRecolhido ? undefined : (
                                    <ListSubheader
                                        component="div"
                                        disableSticky
                                        sx={{
                                            bgcolor: 'transparent',
                                            color: 'text.disabled',
                                            fontSize: 10,
                                            fontWeight: 800,
                                            lineHeight: '30px',
                                            letterSpacing: '0.2em',
                                            px: 2.25,
                                        }}
                                    >
                                        {grupo.titulo}
                                    </ListSubheader>
                                )
                            }
                            sx={{ mb: menuRecolhido ? 1 : 0.75, px: 1 }}
                        >
                            {menuRecolhido && <Divider sx={{ mx: 1, mb: 0.75 }} />}

                            {grupo.itens.map((item) => {
                                const Icon = item.icon;
                                const ativo = rotaAtiva(pathname, item.href);
                                const link = (
                                    <ListItemButton
                                        component={Link}
                                        href={item.href}
                                        prefetch
                                        selected={ativo}
                                        aria-current={ativo ? 'page' : undefined}
                                        aria-label={menuRecolhido ? item.nome : undefined}
                                        onClick={() => mobile && setMenuMobileAberto(false)}
                                        onMouseEnter={() => router.prefetch(item.href)}
                                        onFocus={() => router.prefetch(item.href)}
                                        sx={{
                                            position: 'relative',
                                            minHeight: 44,
                                            justifyContent: menuRecolhido ? 'center' : 'flex-start',
                                            border: '1px solid transparent',
                                            borderRadius: 2.5,
                                            px: menuRecolhido ? 1 : 1.5,
                                            mb: 0.5,
                                            color: ativo ? 'primary.light' : 'text.secondary',
                                            transition: (theme) =>
                                                theme.transitions.create([
                                                    'background-color',
                                                    'border-color',
                                                    'color',
                                                    'transform',
                                                ]),
                                            '&::before': ativo
                                                ? {
                                                      position: 'absolute',
                                                      top: 10,
                                                      bottom: 10,
                                                      left: -9,
                                                      width: 3,
                                                      borderRadius: '0 8px 8px 0',
                                                      bgcolor: 'primary.main',
                                                      content: '""',
                                                  }
                                                : undefined,
                                            '&.Mui-selected': {
                                                borderColor: 'rgba(34, 197, 94, 0.24)',
                                                bgcolor: 'rgba(34, 197, 94, 0.11)',
                                            },
                                            '&.Mui-selected:hover': { bgcolor: 'rgba(34, 197, 94, 0.16)' },
                                            '&:hover': {
                                                color: 'text.primary',
                                                bgcolor: 'rgba(148, 163, 184, 0.08)',
                                                transform: menuRecolhido ? 'none' : 'translateX(2px)',
                                            },
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: menuRecolhido ? 0 : 38,
                                                justifyContent: 'center',
                                                color: 'inherit',
                                            }}
                                        >
                                            <Icon fontSize="small" />
                                        </ListItemIcon>

                                        {!menuRecolhido && (
                                            <ListItemText
                                                primary={item.nome}
                                                slotProps={{
                                                    primary: {
                                                        noWrap: true,
                                                        sx: {
                                                            fontSize: 14,
                                                            fontWeight: ativo ? 650 : 500,
                                                        },
                                                    },
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                );

                                return menuRecolhido ? (
                                    <Tooltip key={item.href} title={item.nome} placement="right">
                                        {link}
                                    </Tooltip>
                                ) : (
                                    <Box key={item.href}>{link}</Box>
                                );
                            })}
                        </List>
                    ))}
                </Box>

                <Divider />

                <Box sx={{ p: menuRecolhido ? 1 : 1.5 }}>
                    <Stack
                        direction="row"
                        spacing={1.25}
                        sx={{
                            alignItems: 'center',
                            justifyContent: menuRecolhido ? 'center' : 'flex-start',
                        }}
                    >
                        <Tooltip title={menuRecolhido ? userEmail : ''} placement="right">
                            <Avatar
                                sx={{
                                    width: 38,
                                    height: 38,
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    fontSize: 15,
                                    fontWeight: 800,
                                }}
                            >
                                {userInitial}
                            </Avatar>
                        </Tooltip>

                        {!menuRecolhido && (
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography
                                    noWrap
                                    variant="body2"
                                    sx={{ color: 'text.primary', fontWeight: 700, textTransform: 'capitalize' }}
                                >
                                    {userName}
                                </Typography>
                                <Typography noWrap variant="caption" color="text.secondary">
                                    {userEmail}
                                </Typography>
                            </Box>
                        )}
                    </Stack>

                    <Divider sx={{ my: 1.25 }} />

                    <form action={logout}>
                        <Tooltip title={menuRecolhido ? 'Sair do sistema' : ''} placement="right">
                            <Button
                                type="submit"
                                color="error"
                                fullWidth
                                startIcon={menuRecolhido ? undefined : <LogoutRounded fontSize="small" />}
                                aria-label="Sair do sistema"
                                sx={{
                                    minWidth: 0,
                                    justifyContent: menuRecolhido ? 'center' : 'flex-start',
                                    px: menuRecolhido ? 1 : 1.25,
                                    color: 'text.secondary',
                                }}
                            >
                                {menuRecolhido ? <LogoutRounded fontSize="small" /> : 'Sair do sistema'}
                            </Button>
                        </Tooltip>
                    </form>

                    {!menuRecolhido && (
                        <Typography
                            variant="caption"
                            color="text.disabled"
                            sx={{ display: 'block', mt: 0.75, px: 1.25 }}
                        >
                            {empresa} · v1.0.0
                        </Typography>
                    )}
                </Box>
            </Box>
        );
    }

    const larguraDesktop = recolhida ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                height: '100dvh',
                overflow: 'hidden',
                bgcolor: 'background.default',
            }}
        >
            <Drawer
                id="menu-lateral-mobile"
                variant="temporary"
                open={menuMobileAberto}
                onClose={() => setMenuMobileAberto(false)}
                ModalProps={{ keepMounted: true }}
                slotProps={{
                    paper: {
                        sx: {
                            display: { xs: 'block', md: 'none' },
                            width: DRAWER_WIDTH,
                            maxWidth: 'calc(100vw - 48px)',
                            borderRight: 1,
                            borderColor: 'divider',
                            backgroundImage: 'none',
                        },
                    },
                }}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                {conteudoDrawer(false, true)}
            </Drawer>

            <Drawer
                variant="permanent"
                open
                slotProps={{
                    paper: {
                        sx: {
                            position: 'relative',
                            width: larguraDesktop,
                            height: '100dvh',
                            overflowX: 'hidden',
                            borderRight: 1,
                            borderColor: 'divider',
                            backgroundImage: 'none',
                            transition: (theme) => theme.transitions.create('width'),
                        },
                    },
                }}
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: larguraDesktop,
                    flexShrink: 0,
                    transition: (theme) => theme.transitions.create('width'),
                }}
            >
                {conteudoDrawer(recolhida)}
            </Drawer>

            <Box
                sx={{
                    display: 'flex',
                    minWidth: 0,
                    flex: 1,
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <AppBar
                    position="static"
                    color="transparent"
                    elevation={0}
                    sx={{
                        zIndex: (theme) => theme.zIndex.appBar,
                        flexShrink: 0,
                        borderBottom: 1,
                        borderColor: 'divider',
                        bgcolor: 'rgba(11, 15, 20, 0.86)',
                        backdropFilter: 'blur(18px)',
                    }}
                >
                    <Toolbar sx={{ minHeight: { xs: 60, sm: 64 }, gap: 1.5, px: { xs: 1.5, sm: 2.5 } }}>
                        <IconButton
                            onClick={() => setMenuMobileAberto(true)}
                            aria-label="Abrir menu principal"
                            aria-controls="menu-lateral-mobile"
                            aria-expanded={menuMobileAberto}
                            sx={{ display: { xs: 'inline-flex', md: 'none' }, color: 'text.primary' }}
                        >
                            <MenuRounded />
                        </IconButton>

                        {recolhida && (
                            <Tooltip title="Expandir menu">
                                <IconButton
                                    onClick={alternarSidebar}
                                    aria-label="Expandir menu lateral"
                                    aria-expanded="false"
                                    sx={{ display: { xs: 'none', md: 'inline-flex' }, color: 'text.secondary' }}
                                >
                                    <ChevronRightRounded />
                                </IconButton>
                            </Tooltip>
                        )}

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="overline"
                                color="primary.light"
                                sx={{
                                    display: { xs: 'none', sm: 'block' },
                                    lineHeight: 1.15,
                                    letterSpacing: '0.13em',
                                    fontWeight: 800,
                                }}
                            >
                                {paginaAtual.grupo}
                            </Typography>
                            <Typography
                                component="p"
                                noWrap
                                sx={{
                                    color: 'text.primary',
                                    fontSize: { xs: 16, sm: 18 },
                                    lineHeight: 1.25,
                                    fontWeight: 750,
                                }}
                            >
                                {paginaAtual.nome}
                            </Typography>
                        </Box>

                        <Box sx={{ flex: 1 }} />

                        <CentralNotificacoes iniciais={notificacoesIniciais} />

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: { xs: 'none', lg: 'block' } }}
                        >
                            {empresa}
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Box
                    component="main"
                    className="erp-content"
                    sx={{
                        minWidth: 0,
                        flex: 1,
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        overscrollBehavior: 'contain',
                        p: { xs: 2, sm: 3, lg: 4 },
                    }}
                >
                    <Box key={pathname} className="route-content">
                        {children}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
