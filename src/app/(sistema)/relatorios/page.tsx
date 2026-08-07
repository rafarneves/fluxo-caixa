import Link from "next/link";
import {
  LayoutDashboard,
  BarChart3,
  Wallet,
  BadgeDollarSign,
  Receipt,
  Landmark,
  BriefcaseBusiness,
  Users,
  FileText,
  ArrowRight,
} from "lucide-react";

const relatorios = [
  {
    titulo: "Dashboard Executivo",
    descricao: "Visão geral dos principais indicadores financeiros da empresa.",
    icon: LayoutDashboard,
    href: "/relatorios/dashboard-executivo",
  },
  {
    titulo: "DRE Resumido",
    descricao: "Demonstrativo resumido dos resultados do período.",
    icon: BarChart3,
    href: "/relatorios/dre-resumido",
  },
  {
    titulo: "DRE Completo",
    descricao: "Demonstrativo completo com todas as categorias financeiras.",
    icon: Landmark,
    href: "/relatorios/dre-completo",
  },
  {
    titulo: "Fluxo de Caixa",
    descricao: "Entradas, saídas e saldo financeiro por período.",
    icon: Wallet,
    href: "/relatorios/fluxo-caixa",
  },
  {
    titulo: "Recebimentos",
    descricao: "Relatório completo de cobranças e valores recebidos.",
    icon: BadgeDollarSign,
    href: "/relatorios/recebimentos",
  },
  {
    titulo: "Despesas",
    descricao: "Resumo detalhado de todas as despesas cadastradas.",
    icon: Receipt,
    href: "/relatorios/despesas",
  },
  {
    titulo: "Custos",
    descricao: "Custos gerais registrados no ERP.",
    icon: BriefcaseBusiness,
    href: "/relatorios/custos",
  },
  {
    titulo: "Custos por Contrato",
    descricao: "Custos organizados individualmente por contrato.",
    icon: FileText,
    href: "/relatorios/custos-contrato",
  },
  {
    titulo: "Clientes",
    descricao: "Lista completa de clientes cadastrados.",
    icon: Users,
    href: "/relatorios/clientes",
  },
  {
    titulo: "Contratos",
    descricao: "Relatório geral dos contratos ativos e encerrados.",
    icon: FileText,
    href: "/relatorios/contratos",
  },
];

export default function RelatoriosPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Relatórios
        </h1>

        <p className="mt-2 text-zinc-400">
          Central de relatórios e exportações do ERP.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {relatorios.map((relatorio) => {
          const Icon = relatorio.icon;

          return (
            <div
              key={relatorio.titulo}
              className="
                rounded-2xl
                border
                border-zinc-800
                bg-[#111315]
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-green-500/40
                hover:shadow-xl
                hover:shadow-green-500/10
              "
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10">
                <Icon
                  className="text-green-400"
                  size={28}
                />
              </div>

              <h2 className="mt-6 text-xl font-semibold text-white">
                {relatorio.titulo}
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {relatorio.descricao}
              </p>

              <Link
                href={relatorio.href}
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-green-500
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-black
                  transition-all
                  duration-300
                  hover:scale-105
                "
              >
                Abrir
                <ArrowRight size={18} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}