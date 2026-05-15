import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
} from "@/components/ui/sheet"
import { capitalize } from "../helpers/capitalize"
import { downloadFunction } from "../utils/downloadTCC";

type props = {
    isOpen: boolean,
    onClose: () => void,
    itemSelected: any
}

export default function DetailsWork({ onClose, isOpen, itemSelected }: props) {


    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen} >

                <SheetContent style={{ minWidth: '35%' }} className="pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none">
                    <div className="flex justify-between items-center w-full ">
                        <SheetHeader className="text-[#2B3674] text-lg p-0 font-semibold">Detalhes do trabalho</SheetHeader>
                        <SheetClose className=" cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300"><svg width="25" height="25" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="25" height="25" rx="8" />
                            <path d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z" fill="#143163" stroke="#143163" />
                        </svg>
                        </SheetClose>
                    </div>

                    <div className="w-full mt-10 space-y-6">

                        {/* Informações principais */}
                        <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-4">

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 text-sm md:text-base">

                                <div className="space-y-1">
                                    <p className="text-zinc-500 font-medium">Tema</p>
                                    <p className="font-semibold text-[#0B1437]">
                                        {itemSelected?.titulo || "N/A"}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-zinc-500 font-medium">Autor</p>
                                    <p className="font-semibold text-[#0B1437]">
                                        {itemSelected?.autor?.nome || "N/A"}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-zinc-500 font-medium">Especialidade</p>
                                    <p className="font-semibold text-[#0B1437]">
                                        {itemSelected?.especialidades?.[0]?.nome || "N/A"}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-zinc-500 font-medium">
                                        Estado do trabalho
                                    </p>

                                    <div
                                        className={`
                                                w-fit
                                                rounded-full
                                                px-3 py-1
                                                text-xs font-semibold
                                                border
                                                ${itemSelected?.status === "APROVADO"
                                                ? "bg-green-100 text-green-700 border-green-200"

                                                : itemSelected?.status === "RECUSADO"
                                                    ? "bg-red-100 text-red-700 border-red-200"

                                                    : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                            }
          `}
                                    >
                                        {capitalize(itemSelected?.status?.toLowerCase() || "")}
                                    </div>
                                </div>

                                <div className="space-y-1 md:col-span-2">
                                    <p className="text-zinc-500 font-medium">
                                        Data de criação
                                    </p>

                                    <p className="font-semibold text-[#0B1437]">
                                        {itemSelected?.createdAt
                                            ? new Date(itemSelected.createdAt).toLocaleDateString(
                                                "pt-BR",
                                                {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Motivo da recusa */}
                        {itemSelected?.status === "RECUSADO" && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                                <p className="font-semibold text-red-700 mb-2">
                                    Motivo da recusa
                                </p>

                                <p className="text-sm text-red-600 leading-relaxed">
                                    {itemSelected?.motivoRejeicao ||
                                        "Nenhum motivo informado"}
                                </p>
                            </div>
                        )}

                        {/* Resumo */}
                        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4">
                            <p className="font-semibold text-[#0B1437] mb-2">
                                Resumo do trabalho
                            </p>

                            <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
                                {itemSelected?.resumo || "N/A"}
                            </p>
                        </div>

                        {/* Botões */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">

                            <button
                                className="
                                    flex-1
                                    flex items-center justify-center gap-2
                                    rounded-xl
                                    bg-[#141b59]
                                    px-4 py-3
                                    text-white
                                    font-semibold
                                    hover:opacity-90
                                    duration-200
                                    cursor-pointer
                                "
                                type="button"
                                onClick={() => downloadFunction(itemSelected)}
                            >
                                <span>Ver arquivo</span>

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 15V3" />
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <path d="m7 10 5 5 5-5" />
                                </svg>
                            </button>

                            <button
                                className="
                                    flex-1
                                    rounded-xl
                                    bg-[#FC9500]
                                    px-4 py-3
                                    text-white
                                    font-semibold
                                    hover:opacity-90
                                    duration-200
                                    cursor-pointer
                                "
                                type="button"
                                onClick={onClose}
                            >
                                Concluído
                            </button>
                        </div>
                    </div>

                </SheetContent>

            </Sheet>
        </>
    )
}