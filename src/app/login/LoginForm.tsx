'use client';

import { useActionState } from 'react';
import { LockKeyhole, LogIn, Mail } from 'lucide-react';

import Button from '@/components/ui/Button';
import { login, type LoginState } from './actions';

const initialState: LoginState = {};

export default function LoginForm() {
    const [state, formAction, pending] = useActionState(login, initialState);

    return (
        <form action={formAction} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-zinc-300">
                E-mail
                <span className="relative mt-2 block">
                    <Mail
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500"
                        size={18}
                    />
                    <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        autoFocus
                        className="w-full rounded-xl border border-zinc-800 bg-[#0B0F14] py-3.5 pr-4 pl-11 text-white transition-colors outline-none placeholder:text-zinc-600 focus:border-green-500"
                        placeholder="admin@empresa.com"
                    />
                </span>
            </label>

            <label className="block text-sm font-medium text-zinc-300">
                Senha
                <span className="relative mt-2 block">
                    <LockKeyhole
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500"
                        size={18}
                    />
                    <input
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        minLength={6}
                        className="w-full rounded-xl border border-zinc-800 bg-[#0B0F14] py-3.5 pr-4 pl-11 text-white transition-colors outline-none placeholder:text-zinc-600 focus:border-green-500"
                        placeholder="Sua senha"
                    />
                </span>
            </label>

            {state.error && (
                <p
                    role="alert"
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                    {state.error}
                </p>
            )}

            <Button type="submit" disabled={pending} className="w-full" icon={<LogIn size={18} />}>
                {pending ? 'Entrando...' : 'Entrar no sistema'}
            </Button>
        </form>
    );
}
