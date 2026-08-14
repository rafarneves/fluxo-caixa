'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
    LayoutDashboard,
    Users,
    FileText,
    BadgeDollarSign,
    ArrowLeftRight,
    Receipt,
    BarChart3,
    Handshake,
    Settings,
    FileBarChart2,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
} from 'lucide-react';

import { logout } from '@/app/login/actions';

const SIDEBAR_STORAGE_KEY = 'altuza-sidebar-recolhida';

const grupos = [
    {
        titulo: 'DASHBOARD',
        itens: [
            {
                nome: 'Dashboard',
                href: '/',
                icon: LayoutDashboard,
            },
        ],
    },
    {
        titulo: 'FINANCEIRO',
        itens: [
            {
                nome: 'Cobranças',
                href: '/recebimentos',
                icon: BadgeDollarSign,
            },
            {
                nome: 'Fluxo de Caixa',
                href: '/fluxo-caixa',
                icon: ArrowLeftRight,
            },
            {
                nome: 'DRE',
                href: '/dre',
                icon: BarChart3,
            },
            {
                nome: 'Despesas',
                href: '/despesas',
                icon: Receipt,
            },
        ],
    },
    {
        titulo: 'OPERAÇÃO',
        itens: [
            {
                nome: 'Clientes',
                href: '/clientes',
                icon: Users,
            },
            {
                nome: 'Contratos',
                href: '/contratos',
                icon: FileText,
            },
            {
                nome: 'Indicações',
                href: '/indicacoes',
                icon: Handshake,
            },
        ],
    },
    {
        titulo: 'GESTÃO',
        itens: [
            {
                nome: 'Relatórios',
                href: '/relatorios',
                icon: FileBarChart2,
            },
            {
                nome: 'Configurações',
                href: '/configuracoes',
                icon: Settings,
            },
        ],
    },
];

export default function Sidebar({ userEmail }: { userEmail: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const [recolhida, setRecolhida] = useState(false);
    const userName = userEmail.includes('@') ? userEmail.split('@')[0] : userEmail;
    const userInitial = userName.charAt(0).toUpperCase();

    useEffect(() => {
        const mediaTelaMenor = window.matchMedia('(max-width: 1099px)');

        function ajustarAoTamanhoDaTela() {
            const preferenciaSalva = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
            setRecolhida(mediaTelaMenor.matches || preferenciaSalva === 'true');
        }

        ajustarAoTamanhoDaTela();
        mediaTelaMenor.addEventListener('change', ajustarAoTamanhoDaTela);

        return () => mediaTelaMenor.removeEventListener('change', ajustarAoTamanhoDaTela);
    }, []);

    function alternarSidebar() {
        setRecolhida((estadoAtual) => {
            const proximoEstado = !estadoAtual;
            window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(proximoEstado));
            return proximoEstado;
        });
    }

    return (
        <aside
            className={`relative z-30 flex h-screen shrink-0 flex-col overflow-hidden border-r border-zinc-900 bg-[#06080B] transition-[width] duration-300 ease-out ${
                recolhida ? 'w-20' : 'w-72'
            }`}
        >
            {/* LOGO */}
            <div
                className={`flex h-[72px] shrink-0 items-center border-b border-zinc-900 ${
                    recolhida ? 'justify-center px-2' : 'justify-between gap-3 px-4'
                }`}
            >
                {!recolhida && (
                    <Image
                        src="/logo-altuza-horizontal.png"
                        alt="Altuza"
                        width={135}
                        height={48}
                        className="w-[135px] select-none"
                        draggable={false}
                    />
                )}

                <button
                    type="button"
                    onClick={alternarSidebar}
                    aria-label={recolhida ? 'Expandir menu lateral' : 'Recolher menu lateral'}
                    aria-expanded={!recolhida}
                    title={recolhida ? 'Expandir menu' : 'Recolher menu'}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 text-zinc-500 transition-colors hover:border-green-500/30 hover:bg-green-500/10 hover:text-green-400"
                >
                    {recolhida ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                </button>
            </div>

            {/* MENU */}
            <nav
                aria-label="Menu principal"
                className={`sidebar-scroll min-h-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto overscroll-contain py-3 ${
                    recolhida ? 'px-2' : 'px-3'
                }`}
            >
                {grupos.map((grupo) => (
                    <div key={grupo.titulo}>
                        {recolhida ? (
                            <div className="mx-2 mb-2 h-px bg-zinc-900" aria-hidden="true" />
                        ) : (
                            <p className="mb-1.5 px-3 text-[10px] font-bold tracking-[0.22em] text-zinc-600">
                                {grupo.titulo}
                            </p>
                        )}

                        <div className="space-y-0.5">
                            {grupo.itens.map((item) => {
                                const Icon = item.icon;
                                const ativo =
                                    pathname === item.href ||
                                    (item.href !== '/' && pathname.startsWith(`${item.href}/`));

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onMouseEnter={() => router.prefetch(item.href)}
                                        onFocus={() => router.prefetch(item.href)}
                                        title={recolhida ? item.nome : undefined}
                                        aria-label={recolhida ? item.nome : undefined}
                                        className={`relative flex h-10 items-center rounded-xl border transition-all duration-300 ${
                                            recolhida ? 'justify-center px-2' : 'gap-3 px-3'
                                        } ${
                                            ativo
                                                ? `border-green-500/30 bg-green-500/10 text-green-400 shadow-lg shadow-green-500/10`
                                                : `border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white`
                                        } `}
                                    >
                                        {ativo && (
                                            <div className="absolute top-2 bottom-2 left-0 w-1 rounded-r-full bg-green-400" />
                                        )}

                                        <Icon className="shrink-0" size={19} strokeWidth={2} />

                                        {!recolhida && <span className="truncate text-sm font-medium">{item.nome}</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* RODAPÉ */}
            <div className={`shrink-0 border-t border-zinc-900 ${recolhida ? 'p-2' : 'p-3'}`}>
                <div className={`flex items-center ${recolhida ? 'justify-center' : 'gap-3'}`}>
                    <div
                        title={recolhida ? userEmail : undefined}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-black"
                    >
                        {userInitial}
                    </div>

                    {!recolhida && (
                        <div className="min-w-0">
                            <p className="max-w-40 truncate text-sm font-semibold text-white capitalize">{userName}</p>

                            <p className="max-w-40 truncate text-xs text-zinc-500">{userEmail}</p>
                        </div>
                    )}
                </div>

                <div className={`${recolhida ? 'mt-2 pt-2' : 'mt-3 pt-3'} border-t border-zinc-900`}>
                    {!recolhida && (
                        <>
                            <p className="text-xs text-zinc-600">Altuza ERP</p>

                            <p className="text-xs text-zinc-700">Versão 1.0.0</p>
                        </>
                    )}

                    <form action={logout} className={recolhida ? '' : 'mt-2'}>
                        <button
                            type="submit"
                            title={recolhida ? 'Sair do sistema' : undefined}
                            aria-label={recolhida ? 'Sair do sistema' : undefined}
                            className={`flex h-10 items-center rounded-lg text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-red-400 ${
                                recolhida ? 'w-full justify-center' : 'w-full gap-2 px-2'
                            }`}
                        >
                            <LogOut className="shrink-0" size={16} />
                            {!recolhida && 'Sair do sistema'}
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    );
}
