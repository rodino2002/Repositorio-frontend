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
    <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
            className="
                w-full
                sm:max-w-xl
                lg:max-w-2xl
                p-0
                flex
                flex-col
                overflow-hidden
                border-l
                border-[#EDEFF6]
            "
        >
            {/* Header */}
            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    px-5
                    sm:px-6
                    lg:px-8
                    py-5
                    border-b
                    border-[#EDEFF6]
                    bg-white
                    shrink-0
                "
            >
                <div className="min-w-0">
                    <SheetHeader className="p-0">
                        <h2 className="text-lg sm:text-xl font-semibold text-[#2B3674] truncate">
                            Detalhes do trabalho
                        </h2>
                    </SheetHeader>

                    {itemSelected?.titulo && (
                        <p className="text-xs sm:text-sm text-zinc-500 mt-1 truncate max-w-[280px] sm:max-w-md">
                            {itemSelected.titulo}
                        </p>
                    )}
                </div>

                <SheetClose
                    className="
                        shrink-0
                        w-9
                        h-9
                        flex
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#F1F2F4]
                        hover:bg-[#E4E6EA]
                        text-[#143163]
                        transition-colors
                        cursor-pointer
                    "
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M6 6L18 18M6 18L18 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </SheetClose>
            </div>

            {/* Content */}
            <div
                className="
                    flex-1
                    overflow-y-auto
                    scrollbar-none
                    px-5
                    sm:px-6
                    lg:px-8
                    py-6
                    space-y-5
                "
            >
                {/* Informações principais */}
                <section
                    className="
                        rounded-2xl
                        border
                        border-[#EDEFF6]
                        bg-white
                        overflow-hidden
                    "
                >
                    <div className="px-4 sm:px-5 py-4 border-b border-[#EDEFF6]">
                        <h3 className="text-sm sm:text-base font-semibold text-[#0B1437]">
                            Informações do trabalho
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                            Informações principais do trabalho acadêmico
                        </p>
                    </div>

                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            gap-x-6
                            gap-y-5
                            p-4
                            sm:p-5
                        "
                    >
                        {/* Tema */}
                        <div className="sm:col-span-2 space-y-1">
                            <p className="text-xs text-zinc-500 font-medium">
                                Tema
                            </p>

                            <p className="text-sm sm:text-base font-semibold text-[#0B1437] break-words">
                                {itemSelected?.titulo || "N/A"}
                            </p>
                        </div>

                        {/* Autor */}
                        <div className="space-y-1 min-w-0">
                            <p className="text-xs text-zinc-500 font-medium">
                                Autor
                            </p>

                            <p className="text-sm font-semibold text-[#0B1437] break-words">
                                {itemSelected?.autor?.nome || "N/A"}
                            </p>
                        </div>

                        {/* Departamento */}
                        <div className="space-y-1 min-w-0">
                            <p className="text-xs text-zinc-500 font-medium">
                                Departamento
                            </p>

                            <p className="text-sm font-semibold text-[#0B1437] break-words">
                                {itemSelected?.departamento?.nome || "N/A"}
                            </p>
                        </div>

                        {/* Especialidade */}
                        <div className="space-y-1 min-w-0">
                            <p className="text-xs text-zinc-500 font-medium">
                                Especialidade
                            </p>

                            <p className="text-sm font-semibold text-[#0B1437] break-words">
                                {itemSelected?.especialidades?.[0]?.nome || "N/A"}
                            </p>
                        </div>

                        {/* Tipo */}
                        <div className="space-y-1 min-w-0">
                            <p className="text-xs text-zinc-500 font-medium">
                                Tipo de trabalho
                            </p>

                            <p className="text-sm font-semibold text-[#0B1437] break-words">
                                {itemSelected?.tipoTrabalho?.nome || "N/A"}
                            </p>
                        </div>

                        {/* Estado */}
                        <div className="space-y-1">
                            <p className="text-xs text-zinc-500 font-medium">
                                Estado do trabalho
                            </p>

                            <div
                                className={`
                                    inline-flex
                                    w-fit
                                    items-center
                                    rounded-full
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-semibold
                                    border
                                    ${
                                        itemSelected?.status === "APROVADO"
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : itemSelected?.status === "RECUSADO"
                                                ? "bg-red-50 text-red-700 border-red-200"
                                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    }
                                `}
                            >
                                {capitalize(
                                    itemSelected?.status?.toLowerCase() || ""
                                )}
                            </div>
                        </div>

                        {/* Data */}
                        <div className="space-y-1">
                            <p className="text-xs text-zinc-500 font-medium">
                                Data de criação
                            </p>

                            <p className="text-sm font-semibold text-[#0B1437]">
                                {itemSelected?.createdAt
                                    ? new Date(
                                        itemSelected.createdAt
                                    ).toLocaleDateString("pt-BR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Motivo da recusa */}
                {itemSelected?.status === "RECUSADO" && (
                    <section
                        className="
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            p-4
                            sm:p-5
                        "
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className="
                                    shrink-0
                                    w-9
                                    h-9
                                    rounded-full
                                    bg-red-100
                                    flex
                                    items-center
                                    justify-center
                                    text-red-600
                                "
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M18 6L6 18M6 6L18 18"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>

                            <div className="min-w-0">
                                <p className="font-semibold text-red-700 text-sm">
                                    Motivo da recusa
                                </p>

                                <p className="text-sm text-red-600 leading-relaxed mt-1 break-words">
                                    {itemSelected?.motivoRejeicao ||
                                        "Nenhum motivo informado"}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Resumo */}
                <section
                    className="
                        rounded-2xl
                        border
                        border-[#EDEFF6]
                        bg-[#F8FAFC]
                        p-4
                        sm:p-5
                    "
                >
                    <div className="flex items-center gap-2 mb-3">
                        <div
                            className="
                                w-8
                                h-8
                                rounded-lg
                                bg-[#EDF5FF]
                                text-[#0077FF]
                                flex
                                items-center
                                justify-center
                                shrink-0
                            "
                        >
                            <svg
                                width="17"
                                height="17"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4 5.5C4 4.67 4.67 4 5.5 4H18.5C19.33 4 20 4.67 20 5.5V18.5C20 19.33 19.33 20 18.5 20H5.5C4.67 20 4 19.33 4 18.5V5.5Z"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                />

                                <path
                                    d="M8 9H16M8 13H16M8 17H12"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <p className="font-semibold text-[#0B1437] text-sm sm:text-base">
                            Resumo do trabalho
                        </p>
                    </div>

                    <p className="text-sm text-zinc-600 leading-7 whitespace-pre-line break-words">
                        {itemSelected?.resumo || "N/A"}
                    </p>
                </section>
            </div>

            {/* Footer */}
            <div
                className="
                    shrink-0
                    border-t
                    border-[#EDEFF6]
                    bg-white
                    px-5
                    sm:px-6
                    lg:px-8
                    py-4
                "
            >
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex-1
                            h-11
                            flex
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-[#E1E5EE]
                            bg-white
                            text-[#143163]
                            text-sm
                            font-semibold
                            hover:bg-[#F7F8FA]
                            transition-colors
                            cursor-pointer
                        "
                    >
                        Concluído
                    </button>

                    <button
                        type="button"
                        onClick={() => downloadFunction(itemSelected)}
                        className="
                            flex-1
                            h-11
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-[#141B59]
                            text-white
                            text-sm
                            font-semibold
                            hover:bg-[#10164A]
                            transition-colors
                            cursor-pointer
                        "
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 15V3"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />

                            <path
                                d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />

                            <path
                                d="M7 10L12 15L17 10"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <span>Ver arquivo</span>
                    </button>
                </div>
            </div>
        </SheetContent>
    </Sheet>
)

}