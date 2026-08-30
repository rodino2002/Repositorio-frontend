import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../config/api";
import { useQuery } from "@tanstack/react-query";
import { StepForward } from "lucide-react";
import { toast, Toaster } from "sonner";

interface Departamento {
    id: number;
    nome: string;
}

interface Especialidade {
    id: number;
    nome: string;
}

interface FormData {
    nome: string;
    email: string;
    senha: string;
    departamentoId: string;
    especialidadesIds: string;
    bi_number: string;
}

export default function CreateAccount() {
    const navigation = useNavigate();

    const [loading, setLoading] = useState(false);
    const [validandoBI, setValidandoBI] = useState(false);
    const [isShow, setIsShow] = useState(false);

    const [statusError, setStatusError] = useState(false);
    const [messageError, setMessageError] = useState("");


    const [formData, setFormData] = useState<FormData>({
        nome: "",
        email: "",
        senha: "",
        departamentoId: "",
        especialidadesIds: "",
        bi_number: "",
    });

    /**
     * ==========================================
     * BUSCAR DEPARTAMENTOS
     * ==========================================
     */
    async function BuscarDepartamentos() {
        try {

            const response = await api.get(
                "/departamentos"
            );

            return response?.data?.dados || []
        } catch (error) {
            console.error(
                "Erro ao buscar departamentos:",
                error
            );
        }
    }

    const { data: departamentos, isLoading: isLoadingdepartamentos } = useQuery({
        queryKey: ["departamentosList"],
        queryFn: BuscarDepartamentos
    })

    /**
     * ==========================================
     * BUSCAR ESPECIALIDADES
     * ==========================================
     *
     * Chamado sempre que o departamento mudar.
     */
    async function BuscarEspecialidades() {


        try {

            const response = await api.get(
                `/especialidades`
            );
            return response?.data || []
        } catch (error) {
            console.error(
                "Erro ao buscar especialidades:",
                error
            );

        }
    }

    const { data: especialidades, isLoading: isLoadingEspecialidades } = useQuery({
        queryKey: ["especialidadesList"],
        queryFn: () => BuscarEspecialidades()
    })

    const especialidadesFiltradas = useMemo(() => {
        return especialidades?.dados?.filter(
            (item: any) => item?.departamento?.id === Number(formData?.departamentoId)
        ) ?? [];
    }, [especialidades, formData?.departamentoId]);


    /**
     * ==========================================
     * VALIDAR BI
     * ==========================================
     */
    async function ValidarBI() {
        if (!formData.bi_number.trim()) {
            setStatusError(true);
            setMessageError(
                "Insira o número do Bilhete de Identidade."
            );

            return;
        }

        try {
            setValidandoBI(true);
            setStatusError(false);
            setMessageError("");


            const response = await api.get(
                `/auth/validate_bi?bi=${formData.bi_number}`
            );


            const nome = response.data?.nome

            if (!nome) {
                setStatusError(true);
                setMessageError(
                    "Não foi possível obter o nome através do BI."
                );

                return;
            }

            setFormData((prev) => ({
                ...prev,
                nome,
            }));

        } catch (error: any) {
            console.error(
                "Erro ao validar BI:",
                error
            );

            setStatusError(true);

            setMessageError(
                error?.response?.data?.message ||
                "BI inválido ou não encontrado."
            );

            setFormData((prev) => ({
                ...prev,
                nome: "",
            }));

        } finally {
            setValidandoBI(false);
        }
    }

    /**
     * ==========================================
     * ALTERAR DEPARTAMENTO
     * ==========================================
     */
    function HandleDepartamentoChange(
        departamentoId: string
    ) {
        setFormData((prev) => ({
            ...prev,
            departamentoId,
        }));

    }



    /**
     * ==========================================
     * CRIAR CONTA
     * ==========================================
     */
    async function CriarConta(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setStatusError(false);
        setMessageError("");

        /**
         * Validações
         */
        if (!formData.nome) {
            setStatusError(true);
            setMessageError(
                "Valide o BI antes de criar a conta."
            );

            return;
        }

        if (!formData.departamentoId) {
            setStatusError(true);
            setMessageError(
                "Selecione o departamento."
            );

            return;
        }

        if (
            formData.especialidadesIds.length === 0
        ) {
            setStatusError(true);
            setMessageError(
                "Selecione pelo menos uma especialidade."
            );

            return;
        }

        try {
            setLoading(true);

            const payload = {
                nome: formData.nome,
                email: formData.email,
                senha: formData.senha,

                departamentoId: Number(
                    formData.departamentoId
                ),

                especialidadesIds: [Number(formData.especialidadesIds)],

                bi_number: formData.bi_number,
            };

        

            await api.post(
                "/auth/register",
                payload
            );

            /**
             * Redirecionar para login
             */
            toast.success("Conta criada com sucesso!");
            //navigation("/login");

        } catch (error: any) {
            console.error(
                "Erro ao criar conta:",
                error
            );

            setStatusError(true);

            setMessageError(
                error?.response?.data?.message ||
                "Não foi possível criar a conta."
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <>
        <Toaster/>
        <div className="min-h-screen w-full flex">

            {/* ==========================================
                ÁREA DO FORMULÁRIO
            ========================================== */}

            <div
                className="
                    w-full
                    min-h-screen
                    overflow-y-auto
                    flex
                    items-center
                    justify-center
                "
            >
                <div className="w-full py-10">

                    {/* LOGO */}

                    <div className="flex justify-center w-full">

                        <img
                            src="/logo_login.png"
                            width={400}
                            className="
                                max-w-[280px]
                                md:max-w-[400px]
                            "
                            alt="Logo"
                        />

                    </div>


                    {/* TÍTULO */}

                    <div className="w-full -mt-10">

                        <p
                            className="
                                flex
                                justify-center
                                text-lg
                                font-semibold
                                text-[#0B1437]
                            "
                        >
                            Criar conta
                        </p>

                        <p
                            className="
                                flex
                                justify-center
                                text-center
                                text-sm
                                text-[#465A9D]
                            "
                        >
                            Preencha os campos abaixo
                            <br />
                            para criar a sua conta.
                        </p>

                    </div>


                    {/* ==========================================
                        FORMULÁRIO
                    ========================================== */}

                    <div className="w-full grid place-items-center">

                        <form
                            className="
                                w-[85%]
                                md:w-[65%]
                                lg:w-[50%]
                                xl:w-[45%]
                            "
                            onSubmit={CriarConta}
                            autoComplete="on"
                        >

                            {/* ======================================
                                NÚMERO DO BI
                            ====================================== */}

                            <div className="flex flex-col space-y-2 mt-6">

                                <label
                                    className="
                                        text-[#2B3674]
                                        text-[14px]
                                        font-semibold
                                    "
                                >
                                    Número do Bilhete de Identidade
                                </label>

                                <div className="relative">

                                    <input
                                        required
                                        type="text"
                                        placeholder="Insira o número do BI"
                                        value={formData.bi_number}
                                        onChange={(e) => {
                                            setStatusError(false);

                                            setFormData(
                                                (prev) => ({
                                                    ...prev,
                                                    bi_number:
                                                        e.target.value,
                                                    nome: "",
                                                })
                                            );
                                        }}
                                        className={`
                                            p-2
                                            pr-30
                                            w-full
                                            ring-1
                                            rounded-[6px]
                                            ${statusError
                                                ? "ring-[#EF4A00]"
                                                : "ring-[#D4D9EA]"
                                            }
                                            focus:ring-1
                                            focus:ring-[#FFC505]
                                            focus:outline-none
                                            text-[#143163]
                                            text-sm
                                            placeholder-[#707EAE]
                                        `}
                                    />

                                    <button
                                        type="button"
                                        onClick={ValidarBI}
                                        disabled={
                                            validandoBI ||
                                            !formData.bi_number
                                        }
                                        className="
                                            absolute
                                            right-1
                                            top-1
                                            bottom-1
                                            px-3
                                            rounded-[5px]
                                            bg-[#161a47]
                                            text-white
                                            text-xs
                                            font-semibold
                                            cursor-pointer
                                            transition
                                            disabled:opacity-50
                                            disabled:cursor-not-allowed
                                        "
                                    >
                                        {validandoBI
                                            ? "Validando..."
                                            : "Validar BI"
                                        }
                                    </button>

                                </div>

                            </div>


                            {/* ======================================
                                NOME COMPLETO
                            ====================================== */}

                            <div className="flex flex-col space-y-2 mt-6">

                                <label
                                    className="
                                        text-[#2B3674]
                                        text-[14px]
                                        font-semibold
                                    "
                                >
                                    Nome completo
                                </label>

                                <input
                                    required
                                    type="text"
                                    placeholder="Valide o BI para obter o seu nome"
                                    value={formData.nome}
                                    readOnly
                                    className="
                                        p-2
                                        ring-1
                                        rounded-[6px]
                                        ring-[#D4D9EA]
                                        bg-[#F6F7FB]
                                        focus:outline-none
                                        text-[#143163]
                                        text-sm
                                        placeholder-[#707EAE]
                                        cursor-not-allowed
                                    "
                                />

                                {formData.nome && (
                                    <p
                                        className="
                                            text-xs
                                            text-green-600
                                        "
                                    >
                                        ✓ Nome identificado com sucesso
                                    </p>
                                )}

                            </div>


                            {/* ======================================
                                EMAIL
                            ====================================== */}

                            <div className="flex flex-col space-y-2 mt-6">

                                <label
                                    className="
                                        text-[#2B3674]
                                        text-[14px]
                                        font-semibold
                                    "
                                >
                                    E-mail
                                </label>

                                <input
                                    required
                                    type="email"
                                    placeholder="Insira o seu e-mail"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setStatusError(false);

                                        setFormData(
                                            (prev) => ({
                                                ...prev,
                                                email:
                                                    e.target.value,
                                            })
                                        );
                                    }}
                                    className="
                                        p-2
                                        ring-1
                                        rounded-[6px]
                                        ring-[#D4D9EA]
                                        focus:ring-1
                                        focus:ring-[#FFC505]
                                        focus:outline-none
                                        text-[#143163]
                                        text-sm
                                        placeholder-[#707EAE]
                                    "
                                />

                            </div>


                            {/* ======================================
                                DEPARTAMENTO
                            ====================================== */}

                            <div className="flex flex-col space-y-2 mt-6">

                                <label
                                    className="
                                        text-[#2B3674]
                                        text-[14px]
                                        font-semibold
                                    "
                                >
                                    Departamento
                                </label>

                                <select
                                    required
                                    disabled={
                                        isLoadingdepartamentos
                                    }
                                    value={
                                        formData.departamentoId
                                    }
                                    onChange={(e) =>
                                        HandleDepartamentoChange(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        p-2
                                        ring-1
                                        rounded-[6px]
                                        ring-[#D4D9EA]
                                        focus:ring-1
                                        focus:ring-[#FFC505]
                                        focus:outline-none
                                        text-[#143163]
                                        text-sm
                                        bg-white
                                        disabled:bg-gray-100
                                    "
                                >

                                    <option value="">
                                        {isLoadingdepartamentos
                                            ? "Carregando departamentos..."
                                            : "Selecione o departamento"
                                        }
                                    </option>

                                    {departamentos?.map(
                                        (departamento: any) => (
                                            <option
                                                key={
                                                    departamento.id
                                                }
                                                value={
                                                    departamento.id
                                                }
                                            >
                                                {
                                                    departamento.nome
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>


                            {/* ======================================
                                ESPECIALIDADES
                            ====================================== */}

                            <div className="flex flex-col space-y-2 mt-6">

                                <label
                                    className="
                                        text-[#2B3674]
                                        text-[14px]
                                        font-semibold
                                    "
                                >
                                    Especialidades
                                </label>

                                <select
                                    required
                                    disabled={
                                        isLoadingEspecialidades
                                    }
                                    value={
                                        formData.especialidadesIds
                                    }
                                    onChange={(e) =>
                                        setFormData({...formData, especialidadesIds: e.target.value})
                                    }
                                    className="
                                        p-2
                                        ring-1
                                        rounded-[6px]
                                        ring-[#D4D9EA]
                                        focus:ring-1
                                        focus:ring-[#FFC505]
                                        focus:outline-none
                                        text-[#143163]
                                        text-sm
                                        bg-white
                                        disabled:bg-gray-100
                                    "
                                >

                                    <option value="">
                                        {isLoadingEspecialidades
                                            ? "Carregando departamentos..."
                                            : "Selecione o departamento"
                                        }
                                    </option>

                                    {especialidadesFiltradas.map((especialidade: any) => (
                                        <option key={especialidade.id} value={especialidade.id}>
                                            {especialidade.nome}
                                        </option>
                                    ))}

                                </select>

                              

                            </div>


                            {/* ======================================
                                SENHA
                            ====================================== */}

                            <div className="flex flex-col space-y-2 mt-6">

                                <label
                                    className="
                                        text-[#2B3674]
                                        text-[14px]
                                        font-semibold
                                    "
                                >
                                    Senha
                                </label>

                                <div
                                    className="
                                        relative
                                        block
                                        rounded-lg
                                        items-center
                                    "
                                >

                                    <input
                                        placeholder="Insira sua senha"
                                        required
                                        minLength={3}
                                        value={formData.senha}
                                        onChange={(e) => {
                                            setStatusError(false);

                                            setFormData(
                                                (prev) => ({
                                                    ...prev,
                                                    senha:
                                                        e.target.value,
                                                })
                                            );
                                        }}
                                        type={
                                            isShow
                                                ? "text"
                                                : "password"
                                        }
                                        className="
                                            p-2
                                            rounded-[6px]
                                            ring-1
                                            ring-[#D4D9EA]
                                            focus:ring-1
                                            focus:ring-[#FFC505]
                                            focus:outline-none
                                            text-[#143163]
                                            text-sm
                                            block
                                            pr-12
                                            w-full
                                        "
                                    />

                                    <button
                                        onClick={() =>
                                            setIsShow(
                                                !isShow
                                            )
                                        }
                                        type="button"
                                        className="
                                            absolute
                                            inset-y-0
                                            right-0
                                            flex
                                            items-center
                                            justify-center
                                            px-3
                                            cursor-pointer
                                        "
                                    >

                                        {isShow ? (

                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M10 4C5.5 4 2.2 7.1 1 10C2.2 12.9 5.5 16 10 16C14.5 16 17.8 12.9 19 10C17.8 7.1 14.5 4 10 4ZM10 14C7.8 14 6 12.2 6 10C6 7.8 7.8 6 10 6C12.2 6 14 7.8 14 10C14 12.2 12.2 14 10 14Z"
                                                    fill="#7D8CA6"
                                                />

                                                <circle
                                                    cx="10"
                                                    cy="10"
                                                    r="2"
                                                    fill="#7D8CA6"
                                                />
                                            </svg>

                                        ) : (

                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M2 2L18 18"
                                                    stroke="#7D8CA6"
                                                    strokeWidth="2"
                                                />

                                                <path
                                                    d="M10 4C5.5 4 2.2 7.1 1 10C2.2 12.9 5.5 16 10 16C11.2 16 12.3 15.8 13.3 15.4"
                                                    stroke="#7D8CA6"
                                                    strokeWidth="1.5"
                                                />

                                                <path
                                                    d="M7.3 4.5C8.2 4.2 9.1 4 10 4C14.5 4 17.8 7.1 19 10C18.5 11.2 17.7 12.3 16.7 13.2"
                                                    stroke="#7D8CA6"
                                                    strokeWidth="1.5"
                                                />
                                            </svg>

                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* ======================================
                                MENSAGEM DE ERRO
                            ====================================== */}

                            {statusError && (

                                <div
                                    className="
                                        mt-4
                                        p-3
                                        rounded-[6px]
                                        bg-red-50
                                        border
                                        border-red-200
                                    "
                                >

                                    <p
                                        className="
                                            text-sm
                                            text-[#ED5656]
                                        "
                                    >
                                        {messageError}
                                    </p>

                                </div>

                            )}


                            {/* ======================================
                                BOTÃO CRIAR CONTA
                            ====================================== */}

                            <button
                                disabled={loading}
                                className="
                                    w-full
                                    h-12
                                    p-2
                                    mt-10
                                    mb-8
                                    rounded-[6px]
                                    cursor-pointer
                                    bg-[#161a47]
                                    transition
                                    duration-150
                                    text-white
                                    font-semibold
                                    hover:opacity-95
                                    disabled:opacity-60
                                    disabled:cursor-not-allowed
                                "
                                type="submit"
                            >

                                {loading ? (

                                    <div
                                        className="
                                            flex
                                            justify-center
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <div
                                            className="
                                                w-4
                                                h-4
                                                border-2
                                                border-white
                                                border-t-transparent
                                                rounded-full
                                                animate-spin
                                            "
                                        />

                                        Criando conta...

                                    </div>

                                ) : (
                                    "Criar conta"
                                )}

                            </button>


                            {/* ======================================
                                LINK LOGIN
                            ====================================== */}

                            <div
                                className="
                                    w-full
                                    flex
                                    flex-col
                                    justify-center
                                    items-center
                                    pb-8
                                "
                            >

                                <p
                                    className="
                                        text-[#0B1437]
                                        text-center
                                    "
                                >
                                    Já tem uma conta?
                                </p>

                                <button
                                    type="button"
                                    className="
                                        text-[#487FFF]
                                        text-center
                                        cursor-pointer
                                        hover:underline
                                    "
                                    onClick={() =>
                                        navigation("/login")
                                    }
                                >
                                    Iniciar sessão
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>


            {/* ==========================================
                IMAGEM LATERAL
            ========================================== */}

            {/* <div
                className="
                    hidden
                    lg:block
                    w-[40%]
                    h-screen
                    sticky
                    top-0
                    overflow-hidden
                "
            >

                <img
                    src="/img1.jpg"
                    className="
                        w-full
                        h-full
                        object-cover
                    "
                    alt="Imagem de apresentação"
                />

            </div> */}

        </div></>
    );
}