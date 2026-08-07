import Link from "next/link";
import { Plus } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";

export default function DashboardHeader() {
  return (
    <PageHeader
      title="Dashboard"
      description="Bem-vindo ao ERP Altuza. Acompanhe em tempo real os principais indicadores financeiros e operacionais da empresa."
      actions={
        <Link href="/clientes/novo" prefetch={false}>
          <Button type="button" icon={<Plus size={18} />}>
            Novo Cliente
          </Button>
        </Link>
      }
    />
  );
}
