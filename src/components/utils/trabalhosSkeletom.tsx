export const ResultsSkeleton = () => (
    <section className="mt-8">
        <div className="mb-6 flex items-center justify-between">
            <div className="space-y-2">
                <div className="h-5 w-48 animate-pulse rounded bg-zinc-200" />
                <div className="h-4 w-72 animate-pulse rounded bg-zinc-100" />
            </div>

            <div className="h-6 w-24 animate-pulse rounded-full bg-zinc-200" />
        </div>

        <div className="border-t border-zinc-200">
            {Array.from({ length: 5 }).map((_, index) => (
                <article
                    key={index}
                    className="py-6 border-b border-zinc-200"
                >
                    <div className="flex gap-4">
                        {/* Número */}
                        <div className="hidden sm:flex shrink-0 w-8 pt-1 justify-center">
                            <div className="h-4 w-5 animate-pulse rounded bg-zinc-200" />
                        </div>

                        <div className="min-w-0 flex-1">
                            {/* Título */}
                            <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200" />

                            {/* Autor + ano */}
                            <div className="mt-2 flex gap-2">
                                <div className="h-4 w-32 animate-pulse rounded bg-zinc-100" />
                                <div className="h-4 w-12 animate-pulse rounded bg-zinc-100" />
                            </div>

                            {/* Metadados */}
                            <div className="mt-4 flex gap-3">
                                <div className="h-3 w-28 animate-pulse rounded bg-zinc-100" />
                                <div className="h-3 w-24 animate-pulse rounded bg-zinc-100" />
                                <div className="h-3 w-32 animate-pulse rounded bg-zinc-100" />
                            </div>

                            {/* Resumo */}
                            <div className="mt-4 space-y-2">
                                <div className="h-3 w-full animate-pulse rounded bg-zinc-100" />
                                <div className="h-3 w-11/12 animate-pulse rounded bg-zinc-100" />
                                <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-100" />
                            </div>

                            {/* Botões */}
                            <div className="mt-5 flex gap-4">
                                <div className="h-4 w-20 animate-pulse rounded bg-zinc-100" />
                                <div className="h-4 w-16 animate-pulse rounded bg-zinc-100" />
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    </section>
)