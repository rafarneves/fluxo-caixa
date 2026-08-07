'use client';

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
} from 'lucide-react';

import { logout } from '@/app/login/actions';

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
    const userName = userEmail.includes('@') ? userEmail.split('@')[0] : userEmail;
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <aside className="flex h-screen w-72 shrink-0 flex-col overflow-hidden border-r border-zinc-900 bg-[#06080B]">
            {/* LOGO */}
            <div className="shrink-0 border-b border-zinc-900 py-2">
                <img
                    src="/logo-altuza-horizontal.png"
                    alt="Altuza"
                    className="mx-auto w-[145px] select-none"
                    draggable={false}
                />
            </div>

            {/* MENU */}
            <nav className="min-h-0 flex-1 space-y-4 overflow-hidden px-3 py-3">
                {grupos.map((grupo) => (
                    <div key={grupo.titulo}>
                        <p className="mb-1.5 px-3 text-[10px] font-bold tracking-[0.22em] text-zinc-600">
                            {grupo.titulo}
                        </p>

                        <div className="space-y-0.5">
                            {grupo.itens.map((item) => {
                                const Icon = item.icon;

                                const ativo = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onMouseEnter={() => router.prefetch(item.href)}
                                        onFocus={() => router.prefetch(item.href)}
                                        className={`relative flex items-center gap-3 rounded-xl border px-3 py-2 transition-all duration-300 ${
                                            ativo
                                                ? `border-green-500/30 bg-green-500/10 text-green-400 shadow-lg shadow-green-500/10`
                                                : `border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white`
                                        } `}
                                    >
                                        {ativo && (
                                            <div className="absolute top-2 bottom-2 left-0 w-1 rounded-r-full bg-green-400" />
                                        )}

                                        <Icon size={18} strokeWidth={2} />

                                        <span className="text-sm font-medium">{item.nome}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* RODAPÉ */}
            <div className="shrink-0 border-t border-zinc-900 p-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-black">
                        {userInitial}
                    </div>

                    <div>
                        <p className="max-w-40 truncate text-sm font-semibold text-white capitalize">{userName}</p>

                        <p className="max-w-40 truncate text-xs text-zinc-500">{userEmail}</p>
                    </div>
                </div>

                <div className="mt-3 border-t border-zinc-900 pt-3">
                    <p className="text-xs text-zinc-600">Altuza ERP</p>

                    <p className="text-xs text-zinc-700">Versão 1.0.0</p>

                    <form action={logout} className="mt-2">
                        <button
                            type="submit"
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-red-400"
                        >
                            <LogOut size={15} />
                            Sair do sistema
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    );
}
