import { useContext, useState } from "react";
import { AuthContext } from "@/Context/auth.context";
import { UserAvatar } from "../utils/useAvatar";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { SidebarTrigger } from "../ui/sidebar";
import { useDetails } from "../hooks/useDetails";

export default function Header() {

    const [logoutIsloading, setLogoutIsLoading] = useState(false);
    const { logout, user } = useContext(AuthContext)

    const {data: details} = useDetails();


    const handleLogout = async (e: any) => {
        e.preventDefault()

        setLogoutIsLoading(true)
        try {

            logout()
            //toast.success("Sessão terminada com sucesso!")

        } catch (error) {
            console.log(error)
        } finally {
            setLogoutIsLoading(false)
        }
    }


    return (
        <header
            className="
            bg-white
            mb-6
            sm:mb-8
            lg:mb-10
            w-full
            rounded-lg
            px-3
            py-3
            sm:px-4
            sm:py-4
            text-[#0B1437]
        "
        >
            <div className="flex items-center w-full gap-3">

                {/* ============================
                SIDEBAR TRIGGER - MOBILE
            ============================ */}
                <div className="lg:hidden shrink-0">
                    <SidebarTrigger
                        className="
                        w-10
                        h-10
                        rounded-lg
                        bg-[#EEF0F4]
                        text-[#143163]
                        hover:bg-[#143163]
                        hover:text-white
                        transition-colors
                    "
                    />
                </div>

                {/* ============================
                USER INFO
            ============================ */}
                <div className="flex items-center gap-3 min-w-0 flex-1">

                    {/* Avatar - apenas desktop */}
                    <div
                        className="
                        hidden
                        lg:flex
                        shrink-0
                        rounded-full
                        border-2
                        border-[#EEF0F4]
                        w-11
                        h-11
                        items-center
                        justify-center
                        overflow-hidden
                    "
                    >
                        <UserAvatar photo={details?.photo} />
                    </div>

                    {/* Nome / Role */}
                    <div className="min-w-0">
                        <h1
                            className="
                            font-semibold
                            text-[#474747]
                            text-sm
                            sm:text-base
                            truncate
                            max-w-[180px]
                            sm:max-w-[300px]
                            lg:max-w-none
                        "
                        >
                            {details?.nome || "Utilizador"}
                        </h1>

                        <p
                            className="
                            text-[#B1B1B1]
                            text-[11px]
                            sm:text-xs
                            font-semibold
                            truncate
                        "
                        >
                            {details?.role}
                        </p>
                    </div>
                </div>

                {/* ============================
                LOGOUT
            ============================ */}
                <div className="shrink-0">


                    <Dialog>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DialogTrigger asChild>
                                    <button
                                        type="button"
                                        className="cursor-pointer w-10 h-10 grid place-items-center rounded-lg
                    text-[#143163] bg-[#EEF0F4]
                    hover:text-white hover:bg-[#143163]
                    duration-300"
                                    >
                                        <svg
                                            width="28"
                                            height="28"
                                            viewBox="0 0 28 28"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M23.0822 7.95855V20.7919C23.0822 22.2397 21.905 23.4169 20.4572 23.4169H18.7072C18.2242 23.4169 17.8322 23.0249 17.8322 22.5419C17.8322 22.0589 18.2242 21.6669 18.7072 21.6669H20.4572C20.9402 21.6669 21.3322 21.2749 21.3322 20.7919V7.95855C21.3322 7.47555 20.9402 7.08355 20.4572 7.08355H18.7072C18.2242 7.08355 17.8322 6.69155 17.8322 6.20855C17.8322 5.72555 18.2242 5.33355 18.7072 5.33355H20.4572C21.905 5.33355 23.0822 6.51072 23.0822 7.95855ZM16.2665 3.57771C16.8907 4.07821 17.2489 4.82489 17.2489 5.62522V23.1252C17.2489 23.9256 16.8907 24.6722 16.2665 25.1727C15.7952 25.5507 15.22 25.7502 14.6297 25.7502C14.4384 25.7502 14.2459 25.7292 14.0557 25.6872L7.05569 24.1321C5.84469 23.8626 5 22.809 5 21.5689V7.18157C5 5.9414 5.84586 4.88788 7.05569 4.61838L14.0557 3.0632C14.8385 2.88937 15.6424 3.07838 16.2665 3.57771ZM15.4989 5.62522C15.4989 5.35805 15.3787 5.10956 15.171 4.94273C15.0135 4.81673 14.8222 4.75022 14.625 4.75022C14.5608 4.75022 14.4978 4.75723 14.4337 4.77123L7.43366 6.3264C7.03 6.41623 6.74886 6.76739 6.74886 7.18039V21.5677C6.74886 21.9807 7.03116 22.3319 7.43366 22.4217L14.4337 23.9769C14.695 24.0352 14.9634 23.9722 15.171 23.8054C15.3787 23.6386 15.4989 23.39 15.4989 23.1229V5.62522ZM12.3139 13.2086H12.3022C11.6582 13.2086 11.1414 13.7312 11.1414 14.3752C11.1414 15.0192 11.6699 15.5419 12.3139 15.5419C12.9579 15.5419 13.4805 15.0192 13.4805 14.3752C13.4805 13.7312 12.9579 13.2086 12.3139 13.2086Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    </button>
                                </DialogTrigger>
                            </TooltipTrigger>

                            <TooltipContent>
                                <p>Terminar sessão</p>
                            </TooltipContent>
                        </Tooltip>

                        <DialogContent
                            className="
                                w-[calc(100%-2rem)]
                                max-w-md
                                p-4
                                sm:p-5
                                rounded-xl
                            "
                        >
                            {/* Icon */}
                            <div className="flex justify-center mt-2">
                                <div
                                    className="
                                        w-14
                                        h-14
                                        grid
                                        place-items-center
                                        rounded-xl
                                        bg-[#FF00001A]
                                        text-[#E02E2E]
                                    "
                                >
                                    <svg
                                        width="28"
                                        height="28"
                                        viewBox="0 0 28 28"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M23.0822 7.95855V20.7919C23.0822 22.2397 21.905 23.4169 20.4572 23.4169H18.7072C18.2242 23.4169 17.8322 23.0249 17.8322 22.5419C17.8322 22.0589 18.2242 21.6669 18.7072 21.6669H20.4572C20.9402 21.6669 21.3322 21.2749 21.3322 20.7919V7.95855C21.3322 7.47555 20.9402 7.08355 20.4572 7.08355H18.7072C18.2242 7.08355 17.8322 6.69155 17.8322 6.20855C17.8322 5.72555 18.2242 5.33355 18.7072 5.33355H20.4572C21.905 5.33355 23.0822 6.51072 23.0822 7.95855ZM16.2665 3.57771C16.8907 4.07821 17.2489 4.82489 17.2489 5.62522V23.1252C17.2489 23.9256 16.8907 24.6722 16.2665 25.1727C15.7952 25.5507 15.22 25.7502 14.6297 25.7502C14.4384 25.7502 14.2459 25.7292 14.0557 25.6872L7.05569 24.1321C5.84469 23.8626 5 22.809 5 21.5689V7.18157C5 5.9414 5.84586 4.88788 7.05569 4.61838L14.0557 3.0632C14.8385 2.88937 15.6424 3.07838 16.2665 3.57771ZM15.4989 5.62522C15.4989 5.35805 15.3787 5.10956 15.171 4.94273C15.0135 4.81673 14.8222 4.75022 14.625 4.75022C14.5608 4.75022 14.4978 4.75723 14.4337 4.77123L7.43366 6.3264C7.03 6.41623 6.74886 6.76739 6.74886 7.18039V21.5677C6.74886 21.9807 7.03116 22.3319 7.43366 22.4217L14.4337 23.9769C14.695 24.0352 14.9634 23.9722 15.171 23.8054C15.3787 23.6386 15.4989 23.39 15.4989 23.1229V5.62522ZM12.3139 13.2086H12.3022C11.6582 13.2086 11.1414 13.7312 11.1414 14.3752C11.1414 15.0192 11.6699 15.5419 12.3139 15.5419C12.9579 15.5419 13.4805 15.0192 13.4805 14.3752C13.4805 13.7312 12.9579 13.2086 12.3139Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Text */}
                            <div className="px-2 sm:px-4 py-3 space-y-6">
                                <div className="text-center font-semibold text-[#143163]">
                                    <p>
                                        Tem certeza que pretende
                                        <br />
                                        encerrar a sessão?
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col-reverse sm:flex-row gap-3">
                                    <DialogClose asChild>
                                        <button
                                            type="button"
                                            className="
                                                w-full
                                                rounded-lg
                                                p-2.5
                                                bg-[#F2F2F2]
                                                hover:bg-[#E8E6E6]
                                                text-[#616161]
                                                font-semibold
                                                transition-colors
                                                cursor-pointer
                                            "
                                        >
                                            Cancelar
                                        </button>
                                    </DialogClose>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        disabled={logoutIsloading}
                                        className="
                                            w-full
                                            rounded-lg
                                            p-2.5
                                            bg-[#E02E2E]
                                            hover:bg-[#BF2626]
                                            text-white
                                            font-semibold
                                            transition-colors
                                            cursor-pointer
                                            disabled:opacity-70
                                            disabled:cursor-not-allowed
                                        "
                                    >
                                        {logoutIsloading
                                            ? "A sair..."
                                            : "Sair"}
                                    </button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </header>
    )


}