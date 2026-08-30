import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
} from "@/components/ui/sheet"

type props = {
    isOpen: boolean,
    onClose: () => void,
    itemSelected: any
}

export default function DetailsUser({ onClose, isOpen, itemSelected }: props) {

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
                className="
                w-full
                sm:max-w-xl
                lg:max-w-2xl
                px-4
                sm:px-8
                lg:px-12
                pt-6
                sm:pt-8
                flex
                flex-col
                overflow-y-auto
                scrollbar-none
            "
            >
                {/* Header */}
                <div className="flex justify-between items-center w-full">
                    <SheetHeader className="text-[#143163] text-base sm:text-lg p-0 font-semibold">
                        Detalhes da conta
                    </SheetHeader>

                    <SheetClose
                        className="
                        cursor-pointer
                        bg-[#DBDEE3]
                        hover:bg-[#C5C9CE]
                        rounded-lg
                        duration-300
                        shrink-0
                    "
                    >
                        <svg
                            width="25"
                            height="25"
                            viewBox="0 0 42 42"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect width="25" height="25" rx="8" />

                            <path
                                d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.293 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z"
                                fill="#143163"
                                stroke="#143163"
                            />
                        </svg>
                    </SheetClose>
                </div>

                {/* Conteúdo */}
                <div className="w-full mt-8 sm:mt-12 space-y-6">

                    {/* Informações pessoais */}
                    <div className="space-y-4">
                        <h3 className="text-[#143163] font-semibold text-sm sm:text-base">
                            Informações pessoais
                        </h3>

                        <div className="rounded-xl border border-[#E2E6EF] bg-white p-4 sm:p-5 space-y-4">

                            {/* Nome */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                                <span className="text-[#7D8CA6] text-sm">
                                    Nome
                                </span>

                                <span className="text-[#0B1437] text-sm font-semibold sm:text-right break-words">
                                    {itemSelected?.nome || "—"}
                                </span>
                            </div>

                            {/* Email */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                                <span className="text-[#7D8CA6] text-sm">
                                    Email
                                </span>

                                <span className="text-[#0B1437] text-sm font-semibold sm:text-right break-all">
                                    {itemSelected?.email || "—"}
                                </span>
                            </div>

                            {/* BI */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                                <span className="text-[#7D8CA6] text-sm">
                                    Bilhete de identidade
                                </span>

                                <span className="text-[#0B1437] text-sm font-semibold sm:text-right">
                                    {itemSelected?.bi_number || "—"}
                                </span>
                            </div>

                            {/* Tipo de conta */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                                <span className="text-[#7D8CA6] text-sm">
                                    Tipo de conta
                                </span>

                                <span
                                    className="
                                    inline-flex
                                    w-fit
                                    sm:ml-auto
                                    px-3
                                    py-1
                                    rounded-full
                                    bg-[#E6EEFC]
                                    text-[#143163]
                                    text-xs
                                    font-semibold
                                "
                                >
                                    {itemSelected?.role || "—"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Informações académicas */}
                    <div className="space-y-4">
                        <h3 className="text-[#143163] font-semibold text-sm sm:text-base">
                            Informações académicas
                        </h3>

                        <div className="rounded-xl border border-[#E2E6EF] bg-white p-4 sm:p-5 space-y-4">

                            {/* Departamento */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                                <span className="text-[#7D8CA6] text-sm">
                                    Departamento
                                </span>

                                <span className="text-[#0B1437] text-sm font-semibold sm:text-right">
                                    {itemSelected?.departamento?.nome || "—"}
                                </span>
                            </div>

                            {/* Especialidades */}
                            <div className="flex justify-between items-center gap-2">
                                <span className="text-[#7D8CA6] text-sm">
                                    Especialidade
                                </span>

                                {itemSelected?.especialidades?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {itemSelected.especialidades.map(
                                            (especialidade: any) => (
                                                <span
                                                    key={especialidade.id}
                                                    className="
                                                    px-3
                                                    py-1.5
                                                    rounded-lg
                                                    bg-[#F3F5F9]
                                                    text-[#143163]
                                                    text-xs
                                                    font-medium
                                                "
                                                >
                                                    {especialidade.nome}
                                                </span>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-[#0B1437] text-sm">
                                        —
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Data */}
                    <div className="space-y-4">
                        <h3 className="text-[#143163] font-semibold text-sm sm:text-base">
                            Informações da conta
                        </h3>

                        <div className="rounded-xl border border-[#E2E6EF] bg-white p-4 sm:p-5">

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                                <span className="text-[#7D8CA6] text-sm">
                                    Data de criação
                                </span>

                                <span className="text-[#0B1437] text-sm font-semibold sm:text-right">
                                    {itemSelected?.createdAt
                                        ? new Date(
                                            itemSelected.createdAt
                                        ).toLocaleString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                        : "—"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Botão */}
                    <button
                        className="
                        w-full
                        p-3
                        rounded-[10px]
                        cursor-pointer
                        bg-[#FC9500]
                        hover:bg-[#e98700]
                        transition
                        duration-150
                        text-white
                        font-semibold
                        mb-6
                    "
                        type="button"
                        onClick={onClose}
                    >
                        Concluído
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    )
}