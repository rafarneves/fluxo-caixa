export type Configuracoes = {
    empresa: string;
    email: string;
    telefone: string;
    moeda: 'BRL' | 'USD' | 'EUR';
    fusoHorario: string;
    notificacoesVencimento: boolean;
    resumoSemanal: boolean;
    alertasFinanceiros: boolean;
    interfaceCompacta: boolean;
};

export type ConfiguracoesRow = {
    usuario_id: string;
    empresa: string;
    email: string | null;
    telefone: string | null;
    moeda: Configuracoes['moeda'];
    fuso_horario: string;
    notificacoes_vencimento: boolean;
    resumo_semanal: boolean;
    alertas_financeiros: boolean;
    interface_compacta: boolean;
};

export const configuracoesIniciais: Configuracoes = {
    empresa: 'Altuza',
    email: '',
    telefone: '',
    moeda: 'BRL',
    fusoHorario: 'America/Sao_Paulo',
    notificacoesVencimento: true,
    resumoSemanal: true,
    alertasFinanceiros: true,
    interfaceCompacta: false,
};

export function rowParaConfiguracoes(row: Partial<ConfiguracoesRow> | null | undefined): Configuracoes {
    if (!row) return configuracoesIniciais;

    return {
        empresa: row.empresa ?? configuracoesIniciais.empresa,
        email: row.email ?? '',
        telefone: row.telefone ?? '',
        moeda: row.moeda ?? configuracoesIniciais.moeda,
        fusoHorario: row.fuso_horario ?? configuracoesIniciais.fusoHorario,
        notificacoesVencimento: row.notificacoes_vencimento ?? configuracoesIniciais.notificacoesVencimento,
        resumoSemanal: row.resumo_semanal ?? configuracoesIniciais.resumoSemanal,
        alertasFinanceiros: row.alertas_financeiros ?? configuracoesIniciais.alertasFinanceiros,
        interfaceCompacta: row.interface_compacta ?? configuracoesIniciais.interfaceCompacta,
    };
}

export function configuracoesParaRow(configuracoes: Configuracoes, usuarioId: string) {
    return {
        usuario_id: usuarioId,
        empresa: configuracoes.empresa,
        email: configuracoes.email || null,
        telefone: configuracoes.telefone || null,
        moeda: configuracoes.moeda,
        fuso_horario: configuracoes.fusoHorario,
        notificacoes_vencimento: configuracoes.notificacoesVencimento,
        resumo_semanal: configuracoes.resumoSemanal,
        alertas_financeiros: configuracoes.alertasFinanceiros,
        interface_compacta: configuracoes.interfaceCompacta,
    };
}
