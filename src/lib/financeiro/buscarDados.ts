import { createClient } from '@/lib/supabase/server';
import { obterPeriodo } from '@/lib/periodo';

type BuscarDadosFinanceirosOptions = {
    periodo?: string;
};

export type ClienteFinanceiro = {
    id: string;
    nome: string;
    telefone?: string | null;
    email?: string | null;
    created_at: string;
    status: string | null;
};

export type ContratoFinanceiro = {
    id: string;
    cliente_id?: string | null;
    nome: string;
    valor: number | string;
    status?: string | null;
    clientes?: { nome?: string | null } | null;
};

export type RecebimentoFinanceiroDetalhado = {
    id: string;
    contrato_id?: string | null;
    valor: number;
    valor_recebido: number | null;
    vencimento: string;
    competencia?: string | null;
    status: string | null;
    contratos?: {
        nome?: string | null;
        clientes?: { nome?: string | null } | null;
    } | null;
};

export type DespesaFinanceira = {
    id: string;
    categoria?: string | null;
    descricao?: string | null;
    data?: string | null;
    valor: number | string;
};

export type CustoContratoFinanceiro = {
    id: string;
    contrato_id?: string | null;
    categoria?: string | null;
    descricao?: string | null;
    tipo?: string | null;
    data?: string | null;
    created_at?: string | null;
    valor: number | string;
    contratos?: {
        id?: string;
        nome?: string | null;
        clientes?: { nome?: string | null } | null;
    } | null;
};

function dataLocalISO(data: Date) {
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}

export async function buscarDadosFinanceiros({ periodo = 'todos' }: BuscarDadosFinanceirosOptions = {}) {
    const supabase = await createClient();
    const [
        { data: clientes, error: clientesError },
        { data: contratos, error: contratosError },
        { data: recebimentos, error: recebimentosError },
        { data: despesas, error: despesasError },
        { data: custosContrato, error: custosError },
    ] = await Promise.all([
        supabase.from('clientes').select('*').order('created_at', { ascending: false }),

        supabase.from('contratos').select(`
        *,
        clientes(nome)
      `),

        supabase
            .from('recebimentos')
            .select(
                `
        *,
        contratos(
          nome,
          clientes(nome)
        )
      `
            )
            .order('vencimento', { ascending: true }),

        supabase.from('despesas').select('*'),

        supabase.from('custos_contrato').select(`
        *,
        contratos(
          id,
          nome,
          clientes(nome)
        )
      `),
    ]);

    if (clientesError || contratosError || recebimentosError || despesasError || custosError) {
        throw new Error('Erro ao buscar informações financeiras do sistema.');
    }

    const dados = {
        clientes: (clientes ?? []) as ClienteFinanceiro[],
        contratos: (contratos ?? []) as ContratoFinanceiro[],
        recebimentos: (recebimentos ?? []) as RecebimentoFinanceiroDetalhado[],
        despesas: (despesas ?? []) as DespesaFinanceira[],
        custosContrato: (custosContrato ?? []) as CustoContratoFinanceiro[],
    };

    if (periodo === 'todos') return dados;

    const { inicio, fim } = obterPeriodo(periodo);
    const inicioISO = dataLocalISO(inicio);
    const fimISO = dataLocalISO(fim);
    const dentroDoPeriodo = (value?: string | null) => {
        const data = value?.slice(0, 10);

        return Boolean(data && data >= inicioISO && data <= fimISO);
    };

    return {
        ...dados,
        recebimentos: dados.recebimentos.filter((item) => dentroDoPeriodo(item.vencimento)),
        despesas: dados.despesas.filter((item) => dentroDoPeriodo(item.data)),
        custosContrato: dados.custosContrato.filter((item) => dentroDoPeriodo(item.data)),
    };
}
