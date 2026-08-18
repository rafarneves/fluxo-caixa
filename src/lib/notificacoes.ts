export type TipoNotificacao = 'vencimento' | 'resumo' | 'alerta';

export type SeveridadeNotificacao = 'info' | 'success' | 'warning' | 'error';

export type NotificacaoSistema = {
    id: string;
    tipo: TipoNotificacao;
    severidade: SeveridadeNotificacao;
    titulo: string;
    descricao: string;
    href: string;
};
