"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
} from "lucide-react";

const grupos = [
  {
    titulo: "DASHBOARD",
    itens: [
      {
        nome: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    titulo: "FINANCEIRO",
    itens: [
      {
        nome: "Cobranças",
        href: "/recebimentos",
        icon: BadgeDollarSign,
      },
      {
        nome: "Fluxo de Caixa",
        href: "/fluxo-caixa",
        icon: ArrowLeftRight,
      },
      {
        nome: "DRE",
        href: "/dre",
        icon: BarChart3,
      },
      {
        nome: "Despesas",
        href: "/despesas",
        icon: Receipt,
      },
    ],
  },
  {
    titulo: "OPERAÇÃO",
    itens: [
      {
        nome: "Clientes",
        href: "/clientes",
        icon: Users,
      },
      {
        nome: "Contratos",
        href: "/contratos",
        icon: FileText,
      },
      {
        nome: "Indicações",
        href: "/indicacoes",
        icon: Handshake,
      },
    ],
  },
  {
    titulo: "GESTÃO",
    itens: [
      {
        nome: "Relatórios",
        href: "/relatorios",
        icon: FileBarChart2,
      },
      {
        nome: "Configurações",
        href: "/configuracoes",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        w-72
        min-h-screen
        bg-[#06080B]
        border-r
        border-zinc-900
        flex
        flex-col
      "
    >
      {/* LOGO */}
      <div className="flex justify-center py-3 border-b border-zinc-900">
        <img
          src="/logo-altuza-horizontal.png"
          alt="Altuza"
          className="w-[170px] -ml-3 select-none"
          draggable={false}
        />
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-8">
        {grupos.map((grupo) => (
          <div key={grupo.titulo}>
            <p className="px-3 mb-3 text-[11px] font-bold tracking-[0.22em] text-zinc-600">
              {grupo.titulo}
            </p>

            <div className="space-y-1">
              {grupo.itens.map((item) => {
                const Icon = item.icon;

                const ativo = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-4
                      py-3
                      border
                      transition-all
                      duration-300

                      ${
                        ativo
                          ? `
                            bg-green-500/10
                            border-green-500/30
                            text-green-400
                            shadow-lg
                            shadow-green-500/10
                          `
                          : `
                            border-transparent
                            text-zinc-400
                            hover:bg-zinc-900
                            hover:text-white
                          `
                      }
                    `}
                  >
                    {ativo && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-green-400" />
                    )}

                    <Icon
                      size={20}
                      strokeWidth={2}
                    />

                    <span className="text-[16px] font-medium">
                      {item.nome}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* RODAPÉ */}
      <div className="border-t border-zinc-900 p-5">
        <div className="flex items-center gap-3">
          <div
            className="
              w-10
              h-10
              rounded-full
              bg-green-500
              flex
              items-center
              justify-center
              font-bold
              text-black
            "
          >
            R
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Rodrigo
            </p>

            <p className="text-xs text-zinc-500">
              Administrador
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-900">
          <p className="text-xs text-zinc-600">
            Altuza ERP
          </p>

          <p className="text-xs text-zinc-700">
            Versão 1.0.0
          </p>
        </div>
      </div>
    </aside>
  );
}