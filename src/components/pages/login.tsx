import { isAxiosError } from "axios"
import { useContext, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { Toaster } from "../ui/sonner"
import { Spinner } from "../utils/spinner"
import { AuthContext } from "@/Context/auth.context"

function Login() {

  const [formData, setFormData] = useState({
    email: "",
    senha: ""
  })
  const [loading, setLoading] = useState(false)
  const [statusError, setStatusError] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const navigation = useNavigate()
  const { login } = useContext(AuthContext)

  // troca de imagem
  const [trocaImg, setTrocaImg] = useState(true)

  setTimeout(() => {
    setTrocaImg(!trocaImg)
  }, 4000)

  const Logar = async (e: any) => {

    e.preventDefault()
    const body = {
      email: formData?.email,
      senha: formData?.senha
    }
    try {

      setLoading(true)

      await login(body)

    } catch (error) {
      console.log(error)
      if (isAxiosError(error)) {
        setStatusError(false)
        const message = error?.response?.data?.erro

        setStatusError(false)
        toast.error(message ?? "Erro ao entrar", {
          icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.75 1C5.822 1 1 5.823 1 11.75C1 17.677 5.822 22.5 11.75 22.5C17.678 22.5 22.5 17.677 22.5 11.75C22.5 5.823 17.678 1 11.75 1ZM11.75 21C6.649 21 2.5 16.851 2.5 11.75C2.5 6.649 6.649 2.5 11.75 2.5C16.851 2.5 21 6.649 21 11.75C21 16.851 16.851 21 11.75 21ZM15.28 9.28003L12.81 11.75L15.28 14.22C15.573 14.513 15.573 14.988 15.28 15.281C15.134 15.427 14.942 15.501 14.75 15.501C14.558 15.501 14.366 15.428 14.22 15.281L11.75 12.811L9.28 15.281C9.134 15.427 8.942 15.501 8.75 15.501C8.558 15.501 8.366 15.428 8.22 15.281C7.927 14.988 7.927 14.513 8.22 14.22L10.69 11.75L8.22 9.28003C7.927 8.98703 7.927 8.51199 8.22 8.21899C8.513 7.92599 8.98801 7.92599 9.28101 8.21899L11.751 10.689L14.221 8.21899C14.514 7.92599 14.989 7.92599 15.282 8.21899C15.573 8.51199 15.573 8.98803 15.28 9.28003Z" fill="#FF5656" />
          </svg>,
          style: {
            borderLeft: "8px solid #EF4A00", // Tailwind emerald-500
          },
          duration: 2000

        })

      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" richColors />

      <div className="h-screen w-full flex">
        <div className="w-full h-screen grid place-items-center relative">
          <div className=" w-full relative">
            <div className="flex justify-center w-full ">
              <img src="/logo_login.png" width={400} className=""/>
            </div>
            <div className="w-full -mt-10">
              <p className="flex justify-center text-lg font-semibold text-[#0B1437]">Início de Sessão</p>
              <p className="flex justify-center text-center text-sm text-[#465A9D]">Seja bem-vindo, preencha os campos <br /> abaixo para aceder a sua conta.</p>
            </div>
            <div className="w-full grid place-items-center">
              <form className="w-[50%] items-center" onSubmit={Logar} autoComplete="on">
                <div className="flex flex-col space-y-2 mt-6">
                  <label className="text-[#2B3674] text-[14px] font-semibold">E-mail</label>
                  <input onSelect={() => setStatusError(false)} placeholder="Insira o seu e-mail" required type="text" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`p-2 ring-1 rounded-[6px] ${statusError ? "ring-[#EF4A00]" : "ring-[#D4D9EA]"} focus:ring-1 focus:ring-[#FFC505] focus:outline-none text-[#143163] text-sm 
                                placeholder-[#707EAE]
                                `} />
                </div>

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
                <div className="w-full flex justify-between items-center ">
                  <span>{statusError && <p className="mt-1 text-sm text-[#ED5656] w-full ">Credenciais inválidas</p>}</span>
                  {/* <p onClick={() => navigation("/recovery-password")} className="mt-1 text-sm text-[#487FFF] flex justify-end cursor-pointer">Esqueceu a sua senha?</p> */}

                </div>

                <button disabled={loading} className="w-full h-12 p-2 mt-15 rounded-[6px] mb-10 cursor-pointer bg-[#161a47] transition duration-150 
                                text-white font-semibold"
                  type="submit">
                  {loading ?
                    <div className="flex justify-center items-center ">
                      <Spinner color="#fff" width="6" height="6" />
                    </div> : "Entrar"
                  }
                </button>

                <div className="w-full flex-col justify-center items-center">
                  <p className="text-[#0B1437] text-center">Não tem uma conta?</p>
                  <p className="text-[#487FFF] text-center cursor-pointer" onClick={() => navigation("/criar-conta")}>Criar conta</p>
                </div>

              </form>

            </div>
          </div>
        </div >
        <div className="w-full h-screen overflow-hidden">
          <img src={trocaImg ? "/img1.jpg" : "/img2.jpg"} className="w-full h-full object-cover " />
        </div>
      </div>
    </>
  )
}

export default Login
