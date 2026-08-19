import { useContext, useState } from "react";
import { AuthContext } from "@/Context/auth.context";
import { toast } from "sonner";

export default function Header() {

    const [logoutIsloading, setLogoutIsLoading] = useState(false);
    const { logout, user } = useContext(AuthContext)


    const handleLogout = async (e: any) => {
        e.preventDefault()

        setLogoutIsLoading(true)
        try {

            logout()
            toast.success("Sessão terminada com sucesso!")

        } catch (error) {
            console.log(error)
        } finally {
            setLogoutIsLoading(false)
        }
    }

    return (
        <>
            <header className=' bg-white mb-10 w-full rounded-lg p-4 text-center font-bold text-[#0B1437]'>
                <div className="flex items-center w-full justify-end space-x-2">
                    <div>
                        <p className="px-3 p-2 rounded bg-blue-50 shadow text-blue-900">{user?.usuario?.role}</p>
                    </div>
                    <div className="flex space-x-2 w-full justify-end">

                        <p>
                            Perfil
                        </p>
                        <button type="button" onClick={handleLogout} className="text-red-500  p-2 w-20 cursor-pointer hover:bg-red-500 hover:text-white duration-300 text-sm bg-red-200 rounded-lg">
                            {logoutIsloading ? "A Sair..." : "Sair"}
                        </button>
                    </div>
                </div>
            </header>
        </>
    )
}