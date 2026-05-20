// components/EmptyState.tsx
export const EmptyState = () => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
        {/* Seu SVG aqui */}
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-[#0B1437]">Nenhum resultado encontrado</h3>
      <p className="text-zinc-500 mt-2 max-w-md leading-relaxed">
        Tente ajustar os filtros ou utilizar palavras-chave diferentes na pesquisa semântica.
      </p>
    </div>
  );
};