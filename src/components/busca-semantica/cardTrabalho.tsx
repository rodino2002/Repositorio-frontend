import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface TrabalhoCardProps {
  item: any;
  onPreview: (url: string) => void;
  onDownload: (item: any) => void;
}

export const TrabalhoCard = ({ item, onPreview, onDownload }: TrabalhoCardProps) => {

    
  return (
    <div className="bg-white rounded-[24px] border border-zinc-100 p-6 transition-all hover:shadow-lg hover:border-blue-100 flex flex-col gap-4">
      {/* Header do Card com o Azul Institucional */}
      <div className="bg-[#141B59] text-white p-4 rounded-xl">
        <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">
          {item.departamento?.nome}
        </span>
        <h3 className="text-lg font-bold mt-1 line-clamp-2">{item.titulo}</h3>
      </div>
      
      <div className="flex-1 space-y-4">
         {/* Detalhes... */}
      </div>

      <div className="flex gap-2">
        <button onClick={() => onPreview(item.fileUrl)} className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 font-semibold text-sm transition">
           Visualizar
        </button>
        <button onClick={() => onDownload(item)} className="flex-1 py-2.5 rounded-xl bg-[#FC9500] text-white font-semibold text-sm transition hover:bg-[#E88900]">
           Download
        </button>
      </div>
    </div>
  );
};