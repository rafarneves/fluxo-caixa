'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Building2, CheckCircle2, Database, Mail, Palette, Save, ShieldCheck } from 'lucide-react';

import Button from '@/components/ui/Button';
import PageHeader from '@/components/ui/PageHeader';
import { configuracoesParaRow, type Configuracoes } from '@/lib/configuracoes';
import { createClient } from '@/lib/supabase/client';

const inputClassName =
    'mt-2 w-full rounded-xl border border-zinc-800 bg-[#0B0F14] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-green-500';

export default function ConfiguracoesForm({ configuracoesIniciais }: { configuracoesIniciais: Configuracoes }) {
    const router = useRouter();
    const [configuracoes, setConfiguracoes] = useState(configuracoesIniciais);
    const [salvo, setSalvo] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    function atualizar<K extends keyof Configuracoes>(campo: K, valor: Configuracoes[K]) {
        setConfiguracoes((configuracaoAtual) => ({
            ...configuracaoAtual,
            [campo]: valor,
        }));
        setSalvo(false);
    }

    async function salvar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSalvando(true);
        setErro(null);

        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            setErro('Sua sessão expirou. Entre novamente no sistema.');
            setSalvando(false);
            return;
        }

        const { error } = await supabase
            .from('configuracoes')
            .upsert(configuracoesParaRow(configuracoes, user.id), { onConflict: 'usuario_id' });

        if (error) {
            setErro('Não foi possível salvar. Verifique a tabela e as políticas RLS no Supabase.');
            setSalvando(false);
            return;
        }

        setSalvo(true);
        setSalvando(false);
        router.refresh();
    }

    return (
        <form className="space-y-8" onSubmit={salvar}>
            <PageHeader
                title="Configurações"
                description="Gerencie os dados da empresa e as preferências de uso do sistema."
                actions={
                    <Button
                        type="submit"
                        disabled={salvando}
                        icon={salvo ? <CheckCircle2 size={18} /> : <Save size={18} />}
                    >
                        {salvando ? 'Salvando...' : salvo ? 'Alterações salvas' : 'Salvar alterações'}
                    </Button>
                }
            />

            {salvo && (
                <div
                    role="status"
                    className="flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-sm text-green-400"
                >
                    <CheckCircle2 size={19} />
                    Preferências salvas no Supabase.
                </div>
            )}

            {erro && (
                <div
                    role="alert"
                    className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400"
                >
                    {erro}
                </div>
            )}

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
                <section className="rounded-3xl border border-zinc-800 bg-[#11151B] p-7">
                    <div className="flex items-start gap-4 border-b border-zinc-800 pb-6">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                            <Building2 size={23} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Dados da empresa</h2>
                            <p className="mt-1 text-sm leading-6 text-zinc-500">
                                Informações usadas na identificação e nos relatórios do ERP.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                        <label className="text-sm font-medium text-zinc-300 md:col-span-2">
                            Nome da empresa
                            <input
                                className={inputClassName}
                                value={configuracoes.empresa}
                                onChange={(event) => atualizar('empresa', event.target.value)}
                                placeholder="Nome da empresa"
                            />
                        </label>

                        <label className="text-sm font-medium text-zinc-300">
                            E-mail administrativo
                            <input
                                className={inputClassName}
                                type="email"
                                value={configuracoes.email}
                                onChange={(event) => atualizar('email', event.target.value)}
                                placeholder="financeiro@empresa.com"
                            />
                        </label>

                        <label className="text-sm font-medium text-zinc-300">
                            Telefone
                            <input
                                className={inputClassName}
                                value={configuracoes.telefone}
                                onChange={(event) => atualizar('telefone', event.target.value)}
                                placeholder="(41) 99999-9999"
                            />
                        </label>

                        <label className="text-sm font-medium text-zinc-300">
                            Moeda
                            <select
                                className={inputClassName}
                                value={configuracoes.moeda}
                                onChange={(event) => atualizar('moeda', event.target.value as Configuracoes['moeda'])}
                            >
                                <option value="BRL">Real brasileiro (BRL)</option>
                                <option value="USD">Dólar americano (USD)</option>
                                <option value="EUR">Euro (EUR)</option>
                            </select>
                        </label>

                        <label className="text-sm font-medium text-zinc-300">
                            Fuso horário
                            <select
                                className={inputClassName}
                                value={configuracoes.fusoHorario}
                                onChange={(event) => atualizar('fusoHorario', event.target.value)}
                            >
                                <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                                <option value="America/Manaus">Manaus (GMT-4)</option>
                                <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
                            </select>
                        </label>
                    </div>
                </section>

                <div className="space-y-6">
                    <section className="rounded-3xl border border-zinc-800 bg-[#11151B] p-7">
                        <div className="flex items-center gap-3">
                            <Bell className="text-green-400" size={22} />
                            <h2 className="text-lg font-semibold text-white">Notificações</h2>
                        </div>

                        <div className="mt-6 divide-y divide-zinc-800">
                            <Toggle
                                label="Vencimentos próximos"
                                description="Alertas sobre contas e recebimentos."
                                checked={configuracoes.notificacoesVencimento}
                                onChange={(checked) => atualizar('notificacoesVencimento', checked)}
                            />
                            <Toggle
                                label="Resumo semanal"
                                description="Visão consolidada da semana."
                                checked={configuracoes.resumoSemanal}
                                onChange={(checked) => atualizar('resumoSemanal', checked)}
                            />
                            <Toggle
                                label="Alertas financeiros"
                                description="Avisos sobre indicadores críticos."
                                checked={configuracoes.alertasFinanceiros}
                                onChange={(checked) => atualizar('alertasFinanceiros', checked)}
                            />
                        </div>
                    </section>

                    <section className="rounded-3xl border border-zinc-800 bg-[#11151B] p-7">
                        <div className="flex items-center gap-3">
                            <Palette className="text-green-400" size={22} />
                            <h2 className="text-lg font-semibold text-white">Aparência</h2>
                        </div>

                        <div className="mt-5">
                            <Toggle
                                label="Interface compacta"
                                description="Reduz o espaçamento entre os elementos."
                                checked={configuracoes.interfaceCompacta}
                                onChange={(checked) => atualizar('interfaceCompacta', checked)}
                            />
                        </div>
                    </section>
                </div>
            </div>

            <section className="grid gap-5 md:grid-cols-3">
                <InfoCard
                    icon={<ShieldCheck size={22} />}
                    title="Ambiente seguro"
                    description="As credenciais ficam protegidas pelas variáveis de ambiente."
                />
                <InfoCard
                    icon={<Database size={22} />}
                    title="Banco de dados"
                    description="Integração com Supabase configurada e disponível."
                />
                <InfoCard
                    icon={<Mail size={22} />}
                    title="Suporte"
                    description="Use o e-mail administrativo para comunicações do sistema."
                />
            </section>
        </form>
    );
}

type ToggleProps = {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
};

function Toggle({ label, description, checked, onChange }: ToggleProps) {
    return (
        <label className="flex cursor-pointer items-center justify-between gap-5 py-4 first:pt-0 last:pb-0">
            <span>
                <span className="block text-sm font-medium text-zinc-200">{label}</span>
                <span className="mt-1 block text-xs leading-5 text-zinc-500">{description}</span>
            </span>
            <input
                type="checkbox"
                className="peer sr-only"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
            />
            <span className="relative h-6 w-11 shrink-0 rounded-full bg-zinc-700 transition-colors peer-checked:bg-green-500 peer-focus-visible:ring-2 peer-focus-visible:ring-green-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#11151B] after:absolute after:top-1 after:left-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
        </label>
    );
}

type InfoCardProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
};

function InfoCard({ icon, title, description }: InfoCardProps) {
    return (
        <div className="flex gap-4 rounded-2xl border border-zinc-800 bg-[#11151B] p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>
            </div>
        </div>
    );
}
