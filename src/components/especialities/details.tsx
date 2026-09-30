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

export default function DetailsEspeciality({ onClose, isOpen, itemSelected }: props) {


return (
    <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
            className="
                w-full
                sm:max-w-xl
                lg:max-w-2xl
                px-5
                sm:px-8
                lg:px-12
                pt-6
                sm:pt-8
                overflow-y-auto
                scrollbar-none
            "
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <SheetHeader className="p-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-[#143163]">
                        Detalhes da especialidade
                    </h2>
                </SheetHeader>

                <SheetClose
                    className="
                        shrink-0
                        flex
                        items-center
                        justify-center
                        w-9
                        h-9
                        rounded-lg
                        bg-[#DBDEE3]
                        hover:bg-[#C5C9CE]
                        transition-colors
                        cursor-pointer
                    "
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 42 42"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 28.6853 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.3173 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z"
                            fill="#143163"
                            stroke="#143163"
                        />
                    </svg>
                </SheetClose>
            </div>

            {/* Content */}
            <div className="mt-10 sm:mt-12 space-y-6">
                {/* Nome */}
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-[#0B1437]">
                        Nome da especialidade
                    </p>

                    <div
                        className="
                            w-full
                            min-h-11
                            flex
                            items-center
                            px-4
                            py-2.5
                            rounded-lg
                            bg-zinc-100
                            border
                            border-zinc-200
                            text-sm
                            sm:text-base
                            text-zinc-700
                        "
                    >
                        {itemSelected?.nome || "Não informado"}
                    </div>
                </div>

                {/* Departamento */}
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-[#0B1437]">
                        Departamento
                    </p>

                    <div
                        className="
                            w-full
                            min-h-11
                            flex
                            items-center
                            px-4
                            py-2.5
                            rounded-lg
                            bg-zinc-100
                            border
                            border-zinc-200
                            text-sm
                            sm:text-base
                            text-zinc-700
                        "
                    >
                        {itemSelected?.departamento?.nome ||
                            itemSelected?.departamentoId ||
                            "Não informado"}
                    </div>
                </div>

                {/* Data de criação */}
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-[#0B1437]">
                        Data de criação
                    </p>

                    <div
                        className="
                            w-full
                            min-h-11
                            flex
                            items-center
                            px-4
                            py-2.5
                            rounded-lg
                            bg-zinc-100
                            border
                            border-zinc-200
                            text-sm
                            sm:text-base
                            text-zinc-700
                        "
                    >
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
                            : "Não informado"}
                    </div>
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-[#0B1437]">
                        Descrição
                    </p>

                    <div
                        className="
                            w-full
                            min-h-28
                            p-4
                            rounded-lg
                            bg-zinc-100
                            border
                            border-zinc-200
                            text-sm
                            sm:text-base
                            leading-relaxed
                            text-zinc-700
                            break-words
                        "
                    >
                        {itemSelected?.descricao ||
                            "Sem descrição disponível."}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-10 sm:mt-14 pb-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="
                        w-full
                        min-h-11
                        px-4
                        py-3
                        rounded-lg
                        bg-[#FC9500]
                        hover:bg-[#E98700]
                        active:scale-[0.99]
                        transition-all
                        cursor-pointer
                        text-white
                        font-semibold
                        text-sm
                        sm:text-base
                    "
                >
                    Concluído
                </button>
            </div>
        </SheetContent>
    </Sheet>
)


}