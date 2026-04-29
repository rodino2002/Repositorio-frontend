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

export default function DetailsDepartament({ onClose, isOpen, itemSelected }: props) {

    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen} >

                <SheetContent style={{ minWidth: '35%' }} className="pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none">
                    <div className="flex justify-between items-center w-full ">
                        <SheetHeader className="text-[#2B3674] text-lg p-0 font-semibold">Detalhes do departamento</SheetHeader>
                        <SheetClose className=" cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300"><svg width="25" height="25" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="25" height="25" rx="8" />
                            <path d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z" fill="#143163" stroke="#143163" />
                        </svg>
                        </SheetClose>
                    </div>

                    <form className="w-full mt-14">

                        <div className=" items-center space-x-4">
                            <div className="text-[0B1437] space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">Nome do departamento: </p>
                                    <p>{itemSelected?.nome}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">Data de criação: </p>
                                    <p>{(new Date(itemSelected?.createdAt))?.toLocaleDateString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })} </p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-semibold">Descrição: </p>
                                    <div className="bg-zinc-200 ring-1 ring-zinc-400 text-zinc-700 p-2 rounded-lg">{itemSelected?.descricao}</div>
                                </div>
                            </div>

                            <button className=" w-full p-2 py-3 mt-[60px] rounded-[10px] cursor-pointer bg-[#FC9500] duration-150 text-[#fff] font-semibold"
                                type="button" onClick={onClose}>
                                Concluido
                            </button>
                        </div>
                    </form>

                </SheetContent>

            </Sheet>
        </>
    )
}