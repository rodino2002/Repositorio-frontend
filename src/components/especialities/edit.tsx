import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
} from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import { Spinner } from "../utils/spinner"
import { api } from "../config/api"
import { useDepartaments } from "../hooks/useDepartaments"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

type props = {
    isOpen: boolean,
    onClose: () => void,
    itemSelected: any

}

export default function EditEspeciality({ onClose, isOpen, itemSelected }: props) {

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        nome: "",
        descricao: "",
        departamentoId: ""

    })

    const queryClient = useQueryClient()
    const departaments = useDepartaments()
    console.log(formData)

    useEffect(() => {
        setFormData({
            ...formData,
            nome: itemSelected?.nome,
            descricao: itemSelected?.descricao,
            departamentoId: itemSelected?.departamento?.id
        })
    }, [itemSelected])

    const editDepartament = async (e: any) => {
        e.preventDefault()

        try {

            const body = {
                nome: formData?.nome,
                descricao: formData?.descricao,
                departamentoId: Number(formData?.departamentoId)
            }

            setLoading(true)

            await api.put(`especialidades/${itemSelected?.id}`, body)

            queryClient.invalidateQueries({ queryKey: [`especialidadesLista`] });


            setLoading(false)
            toast.success(`Especialidade editada com sucesso!`, {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#1AD598" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.8321 7C16.5318 7.01221 16.2495 7.146 16.05 7.37109C14.2501 9.31396 12.6081 11.2202 10.8801 13.1221L8.84906 11.3662C8.61801 11.1641 8.31168 11.0688 8.00647 11.1055C7.70126 11.1416 7.4259 11.3062 7.24905 11.5576C6.85696 12.0923 6.93347 12.8369 7.42606 13.2812L10.269 15.7314C10.7145 16.1216 11.3919 16.0791 11.785 15.6357C13.83 13.4272 15.662 11.2583 17.66 9.1001C18.1082 8.61133 18.1147 7.86328 17.675 7.36719C17.4612 7.12744 17.1532 6.99316 16.8321 7Z" fill="white" />
                </svg>
                ,
                style: {
                    background: "#C6FCE4",
                    color: "#2E1065",
                    fontWeight: "600",
                    fontSize: "12px",
                    padding: "14px 20px",
                    borderRadius: "12px",
                },
                duration: 3000,

            })

            onClose()
        } catch (error) {
            console.log(error)
            setLoading(false)
            if (isAxiosError(error)) {
                const message = error?.response?.data?.message ?? "Erro ao editar especialidade"

                toast.error(`${message}`, {
                    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.75 1C5.822 1 1 5.823 1 11.75C1 17.677 5.822 22.5 11.75 22.5C17.678 22.5 22.5 17.677 22.5 11.75C22.5 5.823 17.678 1 11.75 1ZM11.75 21C6.649 21 2.5 16.851 2.5 11.75C2.5 6.649 6.649 2.5 11.75 2.5C16.851 2.5 21 6.649 21 11.75C21 16.851 16.851 21 11.75 21ZM15.28 9.28003L12.81 11.75L15.28 14.22C15.573 14.513 15.573 14.988 15.28 15.281C15.134 15.427 14.942 15.501 14.75 15.501C14.558 15.501 14.366 15.428 14.22 15.281L11.75 12.811L9.28 15.281C9.134 15.427 8.942 15.501 8.75 15.501C8.558 15.501 8.366 15.428 8.22 15.281C7.927 14.988 7.927 14.513 8.22 14.22L10.69 11.75L8.22 9.28003C7.927 8.98703 7.927 8.51199 8.22 8.21899C8.513 7.92599 8.98801 7.92599 9.28101 8.21899L11.751 10.689L14.221 8.21899C14.514 7.92599 14.989 7.92599 15.282 8.21899C15.573 8.51199 15.573 8.98803 15.28 9.28003Z" fill="#FF5656" />
                    </svg>,
                    style: {
                        borderLeft: "8px solid #EF4A00", // Tailwind emerald-500
                    },
                    duration: 2000

                })
            }
        }
    }


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
                        Editar especialidade
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
                            d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z"
                            fill="#143163"
                            stroke="#143163"
                        />
                    </svg>
                </SheetClose>
            </div>

            {/* Form */}
            <form
                onSubmit={editDepartament}
                className="mt-10 sm:mt-12 space-y-6"
            >
                {/* Nome */}
                <div className="space-y-2">
                    <label
                        htmlFor="nome"
                        className="text-sm font-semibold text-[#143163]"
                    >
                        Nome da especialidade
                        <strong className="text-[#ED5656] ml-1">
                            *
                        </strong>
                    </label>

                    <input
                        id="nome"
                        type="text"
                        required
                        value={formData.nome}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                nome: e.target.value,
                            })
                        }
                        placeholder="Ex.: Telecomunicações"
                        className="
                            w-full
                            h-11
                            px-3
                            rounded-lg
                            border
                            border-[#D4D9EA]
                            bg-white
                            text-sm
                            text-[#143163]
                            placeholder:text-zinc-400
                            focus:outline-none
                            focus:border-[#FFC505]
                            focus:ring-1
                            focus:ring-[#FFC505]
                            transition-all
                        "
                    />
                </div>

                {/* Departamento */}
                <div className="space-y-2">
                    <label
                        htmlFor="departamento"
                        className="text-sm font-semibold text-[#143163]"
                    >
                        Departamento
                        <strong className="text-[#ED5656] ml-1">
                            *
                        </strong>
                    </label>

                    <Select
                        value={String(formData.departamentoId)}
                        required
                        onValueChange={(value) =>
                            setFormData({
                                ...formData,
                                departamentoId: value,
                            })
                        }
                    >
                        <SelectTrigger
                            id="departamento"
                            className="
                                w-full
                                h-11
                                rounded-lg
                                border
                                border-[#D4D9EA]
                                bg-white
                                text-sm
                                text-[#143163]
                                focus:border-[#FFC505]
                                focus:ring-1
                                focus:ring-[#FFC505]
                                focus:outline-none
                            "
                        >
                            <SelectValue placeholder="Selecione o departamento" />
                        </SelectTrigger>

                        <SelectContent>
                            {departaments?.length > 0 ? (
                                departaments.map((item: any) => (
                                    <SelectItem
                                        key={item.id}
                                        value={String(item.id)}
                                    >
                                        {item.nome}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-sm text-zinc-500">
                                    Nenhum departamento disponível
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                    <label
                        htmlFor="descricao"
                        className="text-sm font-semibold text-[#143163]"
                    >
                        Descrição
                    </label>

                    <textarea
                        id="descricao"
                        value={formData.descricao}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                descricao: e.target.value,
                            })
                        }
                        rows={5}
                        placeholder="Descreva brevemente esta especialidade..."
                        className="
                            w-full
                            min-h-32
                            px-3
                            py-3
                            rounded-lg
                            border
                            border-[#D4D9EA]
                            bg-white
                            text-sm
                            text-[#143163]
                            placeholder:text-zinc-400
                            resize-none
                            focus:outline-none
                            focus:border-[#FFC505]
                            focus:ring-1
                            focus:ring-[#FFC505]
                            transition-all
                        "
                    />
                </div>

                {/* Actions */}
                <div
                    className="
                        flex
                        flex-col-reverse
                        sm:flex-row
                        gap-3
                        pt-4
                        pb-4
                    "
                >
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            w-full
                            min-h-11
                            px-4
                            py-3
                            rounded-lg
                            bg-[#E6EEFC]
                            hover:bg-[#DCE7F8]
                            text-[#0B1437]
                            font-semibold
                            text-sm
                            transition-colors
                            cursor-pointer
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                        "
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            min-h-11
                            px-4
                            py-3
                            rounded-lg
                            bg-[#FC9500]
                            hover:bg-[#E98700]
                            text-white
                            font-semibold
                            text-sm
                            transition-all
                            cursor-pointer
                            disabled:opacity-70
                            disabled:cursor-not-allowed
                        "
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Spinner
                                    color="#0B1437"
                                    width="5"
                                    height="5"
                                />
                                <span>A guardar...</span>
                            </div>
                        ) : (
                            "Salvar alterações"
                        )}
                    </button>
                </div>
            </form>
        </SheetContent>
    </Sheet>
)

}