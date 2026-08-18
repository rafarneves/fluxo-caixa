import { NextResponse } from 'next/server';

import { getContextoConfiguracoes } from '@/lib/configuracoes-server';
import { getNotificacoesSistema } from '@/lib/notificacoes-server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const { user, configuracoes } = await getContextoConfiguracoes();

    if (!user) {
        return NextResponse.json({ notificacoes: [] }, { status: 401 });
    }

    const notificacoes = await getNotificacoesSistema(configuracoes);

    return NextResponse.json(
        { notificacoes },
        {
            headers: {
                'Cache-Control': 'private, no-store, max-age=0',
            },
        }
    );
}
