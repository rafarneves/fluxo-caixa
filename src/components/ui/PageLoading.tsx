export default function PageLoading() {
    return (
        <main className="animate-pulse space-y-8" aria-busy="true" aria-label="Carregando página">
            <div className="space-y-3">
                <div className="h-10 w-64 rounded-lg bg-zinc-800" />
                <div className="h-5 w-96 max-w-full rounded bg-zinc-900" />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-44 rounded-2xl bg-[#161B22]" />
                ))}
            </div>

            <div className="h-72 rounded-3xl bg-[#161B22]" />
        </main>
    );
}
