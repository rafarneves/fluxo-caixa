export const planos = {
    performance: {
        nome: 'Plano Performance',
        descricao:
            '12 vídeos mensais;\nRoteirização e direção de captação;\nTráfego pago;\nReunião semanal de alinhamento;\n4 visitas mensais.',
    },

    altaPerformance: {
        nome: 'Plano Alta Performance',
        descricao:
            'Tudo do Plano Performance;\n4 artes mensais;\nAtendimento com IA;\nCRM completo;\nReuniões semanais de alinhamento.',
    },

    pro: {
        nome: 'Plano PRO',
        descricao:
            '10 artes/mês;\n15 vídeos/mês (câmera);\nIncluso imagens aéreas;\nConteúdo institucional + trend;\nApresentador profissional (4 vídeos);\nCRM + Gestão de Performance;\nAtendimento com IA;\nCRM completo;\nGestão completa de redes sociais;\nReuniões semanais de alinhamento.',
    },

    personalizado: {
        nome: 'Plano Personalizado',
        descricao: '',
    },
};

export type ContagemPlanos = {
    performance: number;
    altaPerformance: number;
    pro: number;
    personalizado: number;
    outros: number;
};

function normalizarNomePlano(nome: string | null) {
    return (nome ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase()
        .replace(/^plano\s+/, '')
        .replace(/\s+/g, ' ');
}

export function contarContratosPorPlano(contratos: Array<{ nome: string | null }>): ContagemPlanos {
    return contratos.reduce<ContagemPlanos>(
        (contagem, contrato) => {
            const nome = normalizarNomePlano(contrato.nome);

            if (nome === 'performance') {
                contagem.performance += 1;
            } else if (nome === 'alta performance') {
                contagem.altaPerformance += 1;
            } else if (nome === 'pro') {
                contagem.pro += 1;
            } else if (nome === 'personalizado') {
                contagem.personalizado += 1;
            } else {
                contagem.outros += 1;
            }

            return contagem;
        },
        {
            performance: 0,
            altaPerformance: 0,
            pro: 0,
            personalizado: 0,
            outros: 0,
        }
    );
}
