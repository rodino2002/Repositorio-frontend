import { DialogClose } from "@radix-ui/react-dialog"
import { useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { api } from "../config/api"
import { capitalize } from "../helpers/capitalize"

type props = {
    id: string,
    action: string,
    name: string,
}

export default function ModalValidateWork({ id, action, name }: props) {

    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false)
    const closeRef = useRef<HTMLButtonElement>(null)
    const [motivo, setMotivo] = useState("")



    const validateWork = async (action: string, id: string) => {
        if (!action) return toast.error(`Ação inválida!`)

        if (action === "recusar" && !motivo.trim()) {
            return toast.error(`O motivo da recusa é obrigatório!`)
        }

        try {
            setLoading(true)

            const payload =
                action === "recusar"
                    ? { motivo }
                    : undefined;

            await api.patch(
                `trabalhos/${id}/${action}`,
                payload
            );

            queryClient.invalidateQueries({
                queryKey: ['worksList'],
            })

            setLoading(false)

            toast.success(`Operação realizada com sucesso!`, {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.53 7.53075L11.53 17.5308C11.389 17.6718 11.198 17.7508 11 17.7508C10.999 17.7508 10.998 17.7508 10.997 17.7508C10.797 17.7498 10.606 17.6698 10.465 17.5268L6.46497 13.4647C6.17397 13.1697 6.17799 12.6948 6.47299 12.4038C6.76799 12.1138 7.24397 12.1168 7.53397 12.4118L11.003 15.9358L20.469 6.46975C20.762 6.17675 21.237 6.17675 21.53 6.46975C21.823 6.76275 21.823 7.23875 21.53 7.53075ZM11 13.7508C11.192 13.7508 11.384 13.6778 11.53 13.5308L17.53 7.53075C17.823 7.23775 17.823 6.76275 17.53 6.46975C17.237 6.17675 16.762 6.17675 16.469 6.46975L10.469 12.4697C10.176 12.7628 10.176 13.2378 10.469 13.5308C10.616 13.6778 10.808 13.7508 11 13.7508ZM3.53397 12.4148C3.24397 12.1198 2.76899 12.1158 2.47299 12.4068C2.17799 12.6978 2.17397 13.1718 2.46497 13.4678L6.46497 17.5278C6.61097 17.6768 6.80497 17.7518 6.99897 17.7518C7.18897 17.7518 7.37897 17.6798 7.52497 17.5358C7.81997 17.2448 7.82398 16.7708 7.53298 16.4748L3.53397 12.4148Z" fill="#45B369" />
                </svg>
                ,
                style: {
                    borderLeft: "8px solid #45B369", // Tailwind emerald-500
                },
                duration: 2000
            })
            //onClose()
            closeRef.current?.click()
        } catch (error) {
            setLoading(false)
            if (isAxiosError(error)) {
                const message = error?.response?.data?.message || "Ocorreu um erro inesperado!"

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
        <>

            <div className="">
                <div className="space-y-2">

                    {/* Header */}
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {capitalize(action)} Trabalho
                        </h2>
                        <p className="text-sm text-zinc-400 -mt-2"><strong> Tema: </strong> {name || "-Nome do trabalho-"}</p>
                        <hr/>
                        <p className="text-sm text-gray-500 font-semibold">
                            {action === "publicar"
                                ? "Tem certeza que deseja aprovar este trabalho?"
                                : "Informe o motivo da recusa deste trabalho."}
                        </p>
                    </div>

                    {/* Motivo */}
                    {action === "recusar" && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">
                                Motivo da recusa
                            </label>

                            <textarea
                                rows={4}
                                placeholder="Digite o motivo..."
                                className="
            w-full rounded-lg border border-gray-300
            bg-white px-3 py-2 text-sm
            outline-none transition
            focus:border-blue-500
            focus:ring-4 focus:ring-blue-100
            resize-none
          "
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2 ">

                        <DialogClose asChild>
                            <button
                                className="
            rounded-lg border border-gray-300
            bg-white px-4 py-2 text-sm font-medium
            text-gray-700 transition
            hover:bg-gray-100
          "
                            >
                                Cancelar
                            </button>
                        </DialogClose>

                        <button
                            type="button"
                            onClick={() => validateWork(action, id)}
                            className={`
                                    min-w-13.5
                                    rounded-lg px-4 py-2
                                    text-sm font-semibold text-white
                                    transition duration-300
                                    flex items-center justify-center

                                    ${action === "aprovar"
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-red-600 hover:bg-red-700"
                                }
                             `}
                        >
                            {loading ? (
                                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            ) : (
                                capitalize(action)
                            )}
                        </button>
                    </div>

                    <DialogClose asChild>
                        <button ref={closeRef} className="hidden">
                            Fechar
                        </button>
                    </DialogClose>

                </div>
            </div>
        </>
    )
}