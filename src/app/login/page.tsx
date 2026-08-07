import Image from 'next/image';

import LoginForm from './LoginForm';

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#080B0F] px-6 py-12">
            <div className="w-full max-w-md">
                <div className="mb-7 flex justify-center">
                    <Image
                        src="/logo-altuza-horizontal.png"
                        alt="Altuza"
                        width={210}
                        height={70}
                        priority
                        className="h-auto w-[190px]"
                    />
                </div>

                <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#151B24] to-[#0F131A] p-8 shadow-2xl shadow-black/30">
                    <p className="text-xs font-semibold tracking-[0.22em] text-green-400 uppercase">Acesso seguro</p>
                    <h1 className="mt-3 text-3xl font-bold text-white">Bem-vindo de volta</h1>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                        Entre com o usuário administrador cadastrado no Supabase.
                    </p>

                    <LoginForm />
                </section>

                <p className="mt-6 text-center text-xs text-zinc-600">Altuza ERP · Ambiente administrativo</p>
            </div>
        </main>
    );
}
