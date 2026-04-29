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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { api } from "../config/api"
import { useDepartaments } from "../hooks/useDepartaments"
import { useEspecialities } from "../hooks/useEspecialities"
import type { Role } from "../types/role"




type props = {
    isOpen: boolean,
    onClose: () => void,
    role: Role
}

export default function CreateUser({ onClose, isOpen, role }: props) {

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmSenha: "",
        role: "",
        departamentoId: "",
        especialidadesIds: "",
        bi_number: ""
    })

    const [loading, setLoading] = useState(false)
    const [BiIsloading, setBiIsLoading] = useState(false)
    const [validBI, setValidBI] = useState(false)

    const queryClient = useQueryClient()

    // let roles = Role()
    // const rolesFiltered = roles.filter((role) => role != "ADMIN")

    const listDeparmatens = useDepartaments()
    const listEspecialities = useEspecialities()
    const [statusError, setStatusError] = useState(false)
    const [isShow, setIsShow] = useState(false)
    const [isShowConfirm, setIsShowConfirm] = useState(false)

    const clearInputs = () => {
        setFormData({
            ...formData,
            nome: "",
            email: "",
            senha: "",
            confirmSenha: "",
            role: "",
            departamentoId: "",
            especialidadesIds: "",
            bi_number: ""
        })
    }

    async function ValidateBINumber(bi: string) {

        if (!bi) return toast.warning("Insira o número do bilhete");

        if (bi?.length != 14) return toast.warning("O número do BI deve conter 14 caracteres");

        setBiIsLoading(true)
        try {
            const response = await api.get(`auth/validate_bi?bi=${bi?.trim()?.toUpperCase()}`)
            setValidBI(true)
            setFormData({ ...formData, nome: response?.data?.nome })

        } catch (error) {
            console.log("erro ao validar bi", error)
            if (isAxiosError(error)) {
                const message = error?.response?.data?.message
                console.log(error.response)
                toast.error(message)
                setFormData({ ...formData, nome: "" })
            }
        } finally {
            setBiIsLoading(false)
        }
    }


    const createStudent = async (e: any) => {
        e.preventDefault()

        if (formData?.senha != formData?.confirmSenha) {
            setStatusError(true)
            return;
        }

        if (!validBI) return toast.warning("Por favor, valide o bilhete de identidade!")

        if (!formData?.departamentoId && !formData?.especialidadesIds) {
            toast.warning(`Por favor, preencha todos os campos!`, {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.75 1C5.822 1 1 5.823 1 11.75C1 17.677 5.822 22.5 11.75 22.5C17.678 22.5 22.5 17.677 22.5 11.75C22.5 5.823 17.678 1 11.75 1ZM11.75 21C6.649 21 2.5 16.851 2.5 11.75C2.5 6.649 6.649 2.5 11.75 2.5C16.851 2.5 21 6.649 21 11.75C21 16.851 16.851 21 11.75 21ZM15.28 9.28003L12.81 11.75L15.28 14.22C15.573 14.513 15.573 14.988 15.28 15.281C15.134 15.427 14.942 15.501 14.75 15.501C14.558 15.501 14.366 15.428 14.22 15.281L11.75 12.811L9.28 15.281C9.134 15.427 8.942 15.501 8.75 15.501C8.558 15.501 8.366 15.428 8.22 15.281C7.927 14.988 7.927 14.513 8.22 14.22L10.69 11.75L8.22 9.28003C7.927 8.98703 7.927 8.51199 8.22 8.21899C8.513 7.92599 8.98801 7.92599 9.28101 8.21899L11.751 10.689L14.221 8.21899C14.514 7.92599 14.989 7.92599 15.282 8.21899C15.573 8.51199 15.573 8.98803 15.28 9.28003Z" fill="#FF5656" />
                </svg>,
                style: {
                    borderLeft: "8px solid #EF4A00", // Tailwind emerald-500
                },
                duration: 2000

            })
            return
        }

        let especialidadeArray = []

        especialidadeArray.push(Number(formData?.especialidadesIds))

        try {
            
            const body = {
                nome: formData?.nome,
                email: formData?.email,
                senha: formData?.senha,
                role: role?.toUpperCase(),
                departamentoId: Number(formData?.departamentoId),
                especialidadesIds: especialidadeArray,
                bi_number: formData?.bi_number,
            }

            setLoading(true)

            await api.post(`usuarios`, body)

            queryClient.invalidateQueries({ queryKey: [`${role?.toLocaleLowerCase()}Lista`] });
            

            setLoading(false)
            clearInputs()
            toast.success(`${role} criado com sucesso!`, {
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
                const message = error?.response?.data?.message ?? `Erro ao criar ${role}`

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

    useEffect(() => {
        if (!isOpen) {
            clearInputs()
        }
    }, [isOpen])

    //seta para false, sempre numero de BI mudar
    useEffect(() => {
        setValidBI(false)
    }, [formData?.bi_number])


    return (
        <>
            <Sheet onOpenChange={onClose} open={isOpen}>

                <SheetContent style={{ minWidth: '35%' }} className="pr-16 pl-16 pt-10 w-full flex-col overflow-y-auto scrollbar-none">
                    <div className="flex justify-between items-center w-full pb-14">
                        <SheetHeader className="text-[#143163] font-semibold text-lg p-0">Criar novo {role}</SheetHeader>
                        <SheetClose className=" cursor-pointer bg-[#DBDEE3] hover:bg-[#C5C9CE] rounded duration-300"><svg width="25" height="25" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="25" height="25" rx="8" />
                            <path d="M29.7067 28.2943C30.0973 28.685 30.0973 29.3183 29.7067 29.709C29.512 29.9037 29.256 30.0023 29 30.0023C28.744 30.0023 28.488 29.905 28.2933 29.709L21 22.4156L13.7067 29.709C13.512 29.9037 13.256 30.0023 13 30.0023C12.744 30.0023 12.488 29.905 12.2933 29.709C11.9027 29.3183 11.9027 28.685 12.2933 28.2943L19.5867 21.001L12.2933 13.7077C11.9027 13.317 11.9027 12.6837 12.2933 12.293C12.684 11.9023 13.3173 11.9023 13.708 12.293L21.0013 19.5864L28.2946 12.293C28.6853 11.9023 29.3187 11.9023 29.7093 12.293C30.1 12.6837 30.1 13.317 29.7093 13.7077L22.416 21.001L29.7067 28.2943Z" fill="#143163" stroke="#143163" />
                        </svg>
                        </SheetClose>
                    </div>

                    <form onSubmit={createStudent} className="">

                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] text-[14px] font-semibold">Número do bilhete de identidade<strong className="text-[#ED5656]">*</strong></label>
                            <div className="flex justify-between items-center ">

                                <input
                                    type="text"
                                    disabled={BiIsloading}
                                    required value={formData.bi_number}
                                    onChange={(e) => setFormData({ ...formData, bi_number: e.target.value })}
                                    className={`w-full h-9 p-2 ring-1 rounded-l-[6px] ring-[#D4D9EA] focus:ring-1 focus:ring-[#FFC505] focus:outline-none text-[#143163] text-sm`} />
                                <button type="button" onClick={() => ValidateBINumber(formData.bi_number)} disabled={BiIsloading || validBI}
                                    className={`rounded-r-lg p-2 ${BiIsloading || validBI ? "cursor-no-drop" : "cursor-pointer"} ${validBI ? " bg-green-300 text-green-600" : " bg-blue-300 text-blue-600"} w-20 h-10`}>
                                    {BiIsloading ? <div className="relative">
                                        <div className="absolute flex justify-center w-full -top-2 ">
                                            <Spinner color="#EDEFF6" width="5" height="5" />
                                        </div>
                                    </div> : (validBI ? "OK" : "Validar")}</button>
                            </div>

                        </div>
                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] text-[14px] font-semibold">Nome<strong className="text-[#ED5656]">*</strong></label>
                            <input type="text" disabled={true} required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                className={`h-9 p-2 ring-1 rounded-[6px] ring-[#D4D9EA] focus:ring-1 focus:ring-[#FFC505] focus:outline-none text-[#143163] text-sm`} />
                        </div>

                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] text-[14px] font-semibold">Email<strong className="text-[#ED5656]">*</strong></label>
                            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={`h-9 p-2 ring-1 rounded-[6px] ring-[#D4D9EA] focus:ring-1 focus:ring-[#FFC505] focus:outline-none text-[#143163] text-sm`} />
                        </div>

                        <div className="flex flex-col space-y-2 mt-6 w-full">
                            <label className="text-[#143163] text-[14px] font-semibold">Departamento <strong className="text-[#ED5656]">*</strong></label>
                            <Select value={formData.departamentoId} required onValueChange={(value) => setFormData({ ...formData, departamentoId: value })}>
                                <SelectTrigger className="w-full ring-1 ring-[#D4D9EA] focus:ring-1 focus:ring-[#FFC505] focus:outline-none text-[#143163] text-sm">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent
                                    className="ring-[#D4D9EA] focus:ring-1 focus:ring-[#FFC505] focus:outline-none ">
                                    {listDeparmatens?.length > 0 && listDeparmatens?.map((item: any) => <SelectItem key={item?.id} value={String(item?.id)}>{item?.nome}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col space-y-2 mt-6 w-full">
                            <label className="text-[#143163] text-[14px] font-semibold">Especialidade <strong className="text-[#ED5656]">*</strong></label>
                            <Select value={formData.especialidadesIds} required onValueChange={(value) => setFormData({ ...formData, especialidadesIds: value })}>
                                <SelectTrigger className="w-full ring-1 ring-[#D4D9EA] focus:ring-1 focus:ring-[#FFC505] focus:outline-none text-[#143163] text-sm">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent
                                    className="ring-[#D4D9EA] focus:ring-1 focus:ring-[#FFC505] focus:outline-none ">
                                    {listEspecialities?.length > 0 && listEspecialities?.map((item: any) => <SelectItem key={(item?.id)} value={String(item?.id)}>{item?.nome}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#143163] text-[14px] font-semibold">Cargo<strong className="text-[#ED5656]">*</strong></label>
                            <Select value={formData?.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                                <SelectTrigger className="w-full ring-1 ring-[#D4D9EA] focus:ring-1 focus:ring-[#FFC505] focus:outline-none text-[#143163] text-sm">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent style={{ borderColor: "#D4D9EA" }} className="ring-[#D4D9EA] focus:ring-1 focus:ring-[#FFC505] focus:outline-none text-[#143163] text-sm">
                                    {rolesFiltered?.map((item) => <SelectItem value={item}>{item}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div> */}
                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#2B3674] text-[14px] font-semibold">Senha</label>
                            <div className="relative block rounded-lg items-center">

                                <input placeholder="Insira sua senha" required value={formData.senha} onSelect={() => setStatusError(false)} onChange={(e) => setFormData({ ...formData, senha: e.target.value })} type={isShow ? "text" : "password"}
                                    className={`p-2 rounded-[6px] ring-1 ${statusError ? "ring-[#EF4A00]" : "ring-[#D4D9EA]"} focus:ring-1 focus:ring-[#FFC505] focus:outline-none text-[#143163] text-sm block pr-12 w-full`} />

                                <button onClick={() => setIsShow(!isShow)} type="button" className="absolute inset-y-4 right-0 flex items-center cursor-pointer">

                                    {isShow ? <svg className="animate-fadeIn mr-3" width="15" height="11" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.9855 5.88794C17.6725 3.68894 14.7254 0 9.75036 0C4.77536 0 1.82825 3.68894 0.51525 5.88794C-0.17175 7.03594 -0.17175 8.46306 0.51525 9.61206C1.82825 11.8111 4.77536 15.5 9.75036 15.5C14.7254 15.5 17.6725 11.8111 18.9855 9.61206C19.6725 8.46306 19.6725 7.03694 18.9855 5.88794ZM17.6984 8.84204C16.5484 10.768 13.9854 14 9.75036 14C5.51536 14 2.95236 10.769 1.80236 8.84204C1.40036 8.16804 1.40036 7.33098 1.80236 6.65698C2.95236 4.73098 5.51536 1.49902 9.75036 1.49902C13.9854 1.49902 16.5484 4.72998 17.6984 6.65698C18.1014 7.33198 18.1014 8.16804 17.6984 8.84204ZM9.75036 3.5C7.40636 3.5 5.50036 5.407 5.50036 7.75C5.50036 10.093 7.40636 12 9.75036 12C12.0944 12 14.0004 10.093 14.0004 7.75C14.0004 5.407 12.0944 3.5 9.75036 3.5ZM9.75036 10.5C8.23336 10.5 7.00036 9.267 7.00036 7.75C7.00036 6.233 8.23336 5 9.75036 5C11.2674 5 12.5004 6.233 12.5004 7.75C12.5004 9.267 11.2674 10.5 9.75036 10.5Z" fill="#7D8CA6" />
                                    </svg> :

                                        <svg className="animate-fadeIn mr-3" width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.9802 11.6167C17.6642 13.8127 14.7112 17.4988 9.75123 17.4988C8.78823 17.4988 7.8373 17.3527 6.9253 17.0637C6.5303 16.9387 6.31227 16.5178 6.43727 16.1228C6.56127 15.7268 6.98618 15.5108 7.37818 15.6338C8.14318 15.8758 8.94123 15.9988 9.75123 15.9988C13.9732 15.9988 16.5413 12.7688 17.6953 10.8428C18.1033 10.1668 18.1033 9.32979 17.6973 8.65579C17.3513 8.07279 16.9282 7.47676 16.4712 6.92776C16.2062 6.60876 16.2503 6.13585 16.5693 5.87185C16.8893 5.60685 17.3612 5.65077 17.6262 5.96877C18.1322 6.57777 18.6021 7.24077 18.9841 7.88577C19.6771 9.03277 19.6772 10.4647 18.9802 11.6167ZM7.81422 12.7469L1.28126 19.2798C1.13526 19.4258 0.943231 19.4998 0.751231 19.4998C0.559231 19.4998 0.367201 19.4268 0.221201 19.2798C-0.0717986 18.9868 -0.0717986 18.5118 0.221201 18.2188L3.39625 15.0437C2.06825 13.8987 1.10327 12.5858 0.520274 11.6148C-0.173726 10.4648 -0.173773 9.03286 0.522227 7.88186C1.83823 5.68586 4.79123 1.99978 9.75123 1.99978C11.5862 1.99978 13.3163 2.51871 14.9063 3.53371L18.2202 0.21975C18.5132 -0.07325 18.9883 -0.07325 19.2813 0.21975C19.5743 0.51275 19.5743 0.987785 19.2813 1.28079L7.81617 12.7459C7.81617 12.7459 7.8162 12.7469 7.8152 12.7469C7.8142 12.7469 7.81422 12.7458 7.81422 12.7469ZM7.36012 11.0799L11.0823 7.35769C10.6803 7.13069 10.2292 6.99978 9.75123 6.99978C8.23523 6.99978 7.00221 8.23278 7.00221 9.74978C7.00221 10.2268 7.13412 10.6779 7.36012 11.0799ZM4.45826 13.9807L6.27027 12.1687C5.77527 11.4657 5.50221 10.6308 5.50221 9.74783C5.50221 7.40483 7.40823 5.49783 9.75123 5.49783C10.6352 5.49783 11.4691 5.77089 12.1721 6.26589L13.8032 4.63479C12.5382 3.89379 11.1832 3.49685 9.75123 3.49685C5.52923 3.49685 2.96114 6.72686 1.80714 8.65286C1.39914 9.32886 1.39919 10.1659 1.80519 10.8399C2.34219 11.7369 3.23426 12.9497 4.45826 13.9807ZM12.4592 10.1839C12.2792 11.3439 11.3453 12.2788 10.1873 12.4578C9.77826 12.5208 9.49731 12.9038 9.56031 13.3128C9.61831 13.6838 9.9373 13.9488 10.3003 13.9488C10.3383 13.9488 10.3773 13.9457 10.4153 13.9397C12.2423 13.6577 13.6592 12.2409 13.9412 10.4129C14.0042 10.0029 13.7242 9.62091 13.3142 9.55691C12.9142 9.49591 12.5222 9.77386 12.4592 10.1839Z" fill="#7D8CA6" />
                                        </svg>}

                                </button>

                            </div>
                        </div>
                        <div className="flex flex-col space-y-2 mt-6">
                            <label className="text-[#2B3674] text-[14px] font-semibold">Confirme a senha</label>
                            <div className="relative block rounded-lg items-center">

                                <input placeholder="Insira sua senha" required
                                    value={formData.confirmSenha}
                                    onSelect={() => setStatusError(false)} onChange={(e) => setFormData({ ...formData, confirmSenha: e.target.value })}
                                    type={isShowConfirm ? "text" : "password"}
                                    className={`p-2 rounded-[6px] ring-1 ${statusError ? "ring-[#EF4A00]" : "ring-[#D4D9EA]"} focus:ring-1 focus:ring-[#FFC505] focus:outline-none text-[#143163] text-sm block pr-12 w-full`} />

                                <button onClick={() => setIsShowConfirm(!isShowConfirm)} type="button" className="absolute inset-y-4 right-0 flex items-center cursor-pointer">

                                    {isShowConfirm ? <svg className="animate-fadeIn mr-3" width="15" height="11" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.9855 5.88794C17.6725 3.68894 14.7254 0 9.75036 0C4.77536 0 1.82825 3.68894 0.51525 5.88794C-0.17175 7.03594 -0.17175 8.46306 0.51525 9.61206C1.82825 11.8111 4.77536 15.5 9.75036 15.5C14.7254 15.5 17.6725 11.8111 18.9855 9.61206C19.6725 8.46306 19.6725 7.03694 18.9855 5.88794ZM17.6984 8.84204C16.5484 10.768 13.9854 14 9.75036 14C5.51536 14 2.95236 10.769 1.80236 8.84204C1.40036 8.16804 1.40036 7.33098 1.80236 6.65698C2.95236 4.73098 5.51536 1.49902 9.75036 1.49902C13.9854 1.49902 16.5484 4.72998 17.6984 6.65698C18.1014 7.33198 18.1014 8.16804 17.6984 8.84204ZM9.75036 3.5C7.40636 3.5 5.50036 5.407 5.50036 7.75C5.50036 10.093 7.40636 12 9.75036 12C12.0944 12 14.0004 10.093 14.0004 7.75C14.0004 5.407 12.0944 3.5 9.75036 3.5ZM9.75036 10.5C8.23336 10.5 7.00036 9.267 7.00036 7.75C7.00036 6.233 8.23336 5 9.75036 5C11.2674 5 12.5004 6.233 12.5004 7.75C12.5004 9.267 11.2674 10.5 9.75036 10.5Z" fill="#7D8CA6" />
                                    </svg> :

                                        <svg className="animate-fadeIn mr-3" width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.9802 11.6167C17.6642 13.8127 14.7112 17.4988 9.75123 17.4988C8.78823 17.4988 7.8373 17.3527 6.9253 17.0637C6.5303 16.9387 6.31227 16.5178 6.43727 16.1228C6.56127 15.7268 6.98618 15.5108 7.37818 15.6338C8.14318 15.8758 8.94123 15.9988 9.75123 15.9988C13.9732 15.9988 16.5413 12.7688 17.6953 10.8428C18.1033 10.1668 18.1033 9.32979 17.6973 8.65579C17.3513 8.07279 16.9282 7.47676 16.4712 6.92776C16.2062 6.60876 16.2503 6.13585 16.5693 5.87185C16.8893 5.60685 17.3612 5.65077 17.6262 5.96877C18.1322 6.57777 18.6021 7.24077 18.9841 7.88577C19.6771 9.03277 19.6772 10.4647 18.9802 11.6167ZM7.81422 12.7469L1.28126 19.2798C1.13526 19.4258 0.943231 19.4998 0.751231 19.4998C0.559231 19.4998 0.367201 19.4268 0.221201 19.2798C-0.0717986 18.9868 -0.0717986 18.5118 0.221201 18.2188L3.39625 15.0437C2.06825 13.8987 1.10327 12.5858 0.520274 11.6148C-0.173726 10.4648 -0.173773 9.03286 0.522227 7.88186C1.83823 5.68586 4.79123 1.99978 9.75123 1.99978C11.5862 1.99978 13.3163 2.51871 14.9063 3.53371L18.2202 0.21975C18.5132 -0.07325 18.9883 -0.07325 19.2813 0.21975C19.5743 0.51275 19.5743 0.987785 19.2813 1.28079L7.81617 12.7459C7.81617 12.7459 7.8162 12.7469 7.8152 12.7469C7.8142 12.7469 7.81422 12.7458 7.81422 12.7469ZM7.36012 11.0799L11.0823 7.35769C10.6803 7.13069 10.2292 6.99978 9.75123 6.99978C8.23523 6.99978 7.00221 8.23278 7.00221 9.74978C7.00221 10.2268 7.13412 10.6779 7.36012 11.0799ZM4.45826 13.9807L6.27027 12.1687C5.77527 11.4657 5.50221 10.6308 5.50221 9.74783C5.50221 7.40483 7.40823 5.49783 9.75123 5.49783C10.6352 5.49783 11.4691 5.77089 12.1721 6.26589L13.8032 4.63479C12.5382 3.89379 11.1832 3.49685 9.75123 3.49685C5.52923 3.49685 2.96114 6.72686 1.80714 8.65286C1.39914 9.32886 1.39919 10.1659 1.80519 10.8399C2.34219 11.7369 3.23426 12.9497 4.45826 13.9807ZM12.4592 10.1839C12.2792 11.3439 11.3453 12.2788 10.1873 12.4578C9.77826 12.5208 9.49731 12.9038 9.56031 13.3128C9.61831 13.6838 9.9373 13.9488 10.3003 13.9488C10.3383 13.9488 10.3773 13.9457 10.4153 13.9397C12.2423 13.6577 13.6592 12.2409 13.9412 10.4129C14.0042 10.0029 13.7242 9.62091 13.3142 9.55691C12.9142 9.49591 12.5222 9.77386 12.4592 10.1839Z" fill="#7D8CA6" />
                                        </svg>}

                                </button>

                            </div>
                            {statusError && <p className="text-[#EF4A00] text-sm ">Senhas não coinsidem!</p>}
                        </div>

                        <div className="flex justify-between items-center space-x-4">
                            <button
                                onClick={onClose}
                                className=" w-full p-2 mt-15 rounded-[6px] py-3 mb-10 cursor-pointer bg-[#E6EEFC]  transition duration-150 text-[#0B1437] font-semibold"
                                type="button">
                                Cancelar
                            </button>
                            <button disabled={loading} className=" w-full p-2 py-3 mt-15 rounded-[6px] mb-10 cursor-pointer bg-[#FC9500]  transition duration-150 text-white font-semibold"
                                type="submit">
                                {loading ?
                                    <div className="flex justify-center items-center">
                                        <Spinner color="#0B1437" width="5" height="5" />
                                    </div> : "Criar"
                                }
                            </button>
                        </div>
                    </form>

                </SheetContent>

            </Sheet >
        </>
    )
}