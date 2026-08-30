import { useContext, useMemo, useState } from "react"
import { api } from "../config/api"
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../utils/spinner";
import CreateWorks from "../works/create";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import ModalValidateWork from "../works/modalValidate";
import { capitalize } from "../helpers/capitalize";
import DetailsWork from "../works/details";
import UpdateWork from "../works/edit";
import { AuthContext } from "@/Context/auth.context";

export default function Trabalhos() {
    const [searchInput, setSearchInput] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const perPage = 20

    const [_filterModalIsOpen, setFilterModalIsOpen] = useState(false)

    const [filter, setFilter] = useState({
        name: "",
        email: "",
        referencia: "",
        tipoMovimento: "",
        responsavel: "",
        dataInicio: "",
        dataFinal: ""
    })
    const [detalhesRemetente, setDetalhesRemetente] = useState(false)
    const [itemSelected, setItemSelected] = useState() as any
    const [isFiltered, setIsFiltered] = useState(false)
    const [editModalIsOpen, setEditModalIsOpen] = useState(false)
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false)
    const [_modalValidateIsOpen, setModalValidateIsOpen] = useState(false)
    const { user } = useContext(AuthContext)


    async function getWorks() {
        try {


            const url = user?.usuario?.role === "ESTUDANTE" ? `trabalhos/me`: `trabalhos`;

            const { data } = await api.get(url);
            return data;

        } catch (error) {
            console.error(error);
        }
    }

    const { data, isLoading, isRefetching } = useQuery({
        queryKey: [
            "worksList",
            currentPage,
            perPage,
            isFiltered,

        ],
        queryFn: getWorks,

    });



    const clearFilter = () => {
        setIsFiltered(false)
        setFilter({
            ...filter,
            name: "",
            email: "",
            referencia: "",
            tipoMovimento: "",
            responsavel: "",
            dataInicio: "",
            dataFinal: ""
        })
    }

    const totalPages = data?.total ?? 1;

    const hasPrevPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;


    // PREVIOUS PAGE
    const handlePrevPage = () => {
        if (hasPrevPage) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // NEXT PAGE
    const handleNextPage = () => {
        if (hasNextPage) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const perPageNumber = Number(perPage);

    const historics = data?.dados ?? [];

    const paginatedHistorics = useMemo(() => {
        const start = (currentPage - 1) * perPageNumber;
        const end = start + perPageNumber;
        return historics?.slice(start, end);
    }, [historics, currentPage, perPageNumber]);

    const normalizedSearch = useMemo(() => {
        const value = searchInput?.trim().toLowerCase();
        return value || "";
    }, [searchInput]);


    const normalizeText = (value: unknown) =>
    String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

const filteredHistorics = useMemo(() => {
    if (!paginatedHistorics?.length) return [];

    if (!normalizedSearch?.trim()) {
        return paginatedHistorics;
    }

    const search = normalizeText(normalizedSearch);

    return paginatedHistorics.filter((item: any) => {
        const createdAt = item?.createdAt
            ? new Date(item.createdAt).toLocaleDateString("pt-BR")
            : "";

        const fields = [
            item?.titulo,
            item?.resumo,
            item?.autor?.nome,
            item?.departamento?.nome,
            item?.status,
            createdAt,

            // Todas as especialidades
            ...(item?.especialidades?.map(
                (especialidade: any) => especialidade?.nome
            ) ?? []),
        ];

        return fields.some((field) =>
            normalizeText(field).includes(search)
        );
    });
}, [paginatedHistorics, normalizedSearch]);


    const handleSearch = (value?: string) => {
        setSearchInput(value?.trim() ?? "");
    };


    const handleKeyDown = (event: any) => {
        if (event.key === "Enter" || event.key === 'Backspace') {
            handleSearch(searchInput);
        }
        if (event.target.value) {
            handleSearch(event.target.value);
        }
    };


    return (
        <>
            <CreateWorks onClose={() => setCreateModalIsOpen(false)} isOpen={createModalIsOpen} />
            <UpdateWork onClose={() => setEditModalIsOpen(false)} isOpen={editModalIsOpen} itemSelected={itemSelected} />

            <DetailsWork onClose={() => setDetalhesRemetente(false)} isOpen={detalhesRemetente} itemSelected={itemSelected} />

            <div className=' bg-white rounded-lg h-fit text-sm flex flex-col p-5 '>

                <div className="flex items-center space-x-1">
                    <p className="text-[#0B1437] font-bold text-[16px]">Dashboard</p>
                    <p className="text-[#707EAE] text-[16px]">/</p>
                    <p className="text-[#707EAE] text-[16px]">Departamentos</p>
                </div>

                <div className="flex justify-between items-center mt-5">
                    <div className="bg-white relative block rounded-lg items-center w-[25%] h-10 text-[#465A9D]">

                        <svg className="absolute inset-y-2 ml-1 left-2 flex items-center cursor-pointer p-1 " width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.667 0C16.5579 0.000176655 21.333 4.77606 21.333 10.667C21.3329 13.1316 20.4947 15.399 19.0908 17.2051L23.6094 21.7236C24.1301 22.2443 24.1301 23.0887 23.6094 23.6094C23.0887 24.1301 22.2443 24.1301 21.7236 23.6094L17.2051 19.0908C15.399 20.4947 13.1316 21.3329 10.667 21.333C4.77606 21.333 0.000176651 16.5579 0 10.667C0 4.77596 4.77596 0 10.667 0ZM10.667 2.66699C6.24871 2.66699 2.66699 6.24871 2.66699 10.667C2.66717 15.0851 6.24882 18.667 10.667 18.667C15.085 18.6668 18.6668 15.085 18.667 10.667C18.667 6.24882 15.0851 2.66717 10.667 2.66699Z" fill="#A3AED0" />
                        </svg>

                        <input type="search" placeholder="Pesquisar..."
                            onKeyDown={handleKeyDown} value={searchInput} onChange={(e) => handleSearch(e.target.value)}
                            className="p-2 placeholder-[#465A9D] h-10 rounded-full ring-1 ring-[#D4D9EA] focus:ring-1 focus:ring-[#FFC505] w-full focus:outline-none text-sm 
                            text-[#465A9D] pl-10" />
                    </div>
                    <div className="flex justify-between space-x-4">
                        {user?.usuario?.role === "ESTUDANTE" && <button
                            onClick={() => setCreateModalIsOpen(true)}
                            type="button" className="font-semibold cursor-pointer w-35 h-12 rounded-lg text-[#0B1437] hover:text-white bg-[#E6EEFC] hover:bg-[#FC9500] duration-300 
                    flex items-center justify-center space-x-1">
                            <p>Adicionar</p>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.75 12C19.75 12.414 19.414 12.75 19 12.75H12.75V19C12.75 19.414 12.414 19.75 12 19.75C11.586 19.75 11.25 19.414 11.25 19V12.75H5C4.586 12.75 4.25 12.414 4.25 12C4.25 11.586 4.586 11.25 5 11.25H11.25V5C11.25 4.586 11.586 4.25 12 4.25C12.414 4.25 12.75 4.586 12.75 5V11.25H19C19.414 11.25 19.75 11.586 19.75 12Z" fill="currentColor" stroke="currentColor" stroke-width="0.8" />
                            </svg>
                        </button>}
                        <button
                            onClick={() => setFilterModalIsOpen(true)}
                            type="button" className="font-semibold cursor-pointer w-35 h-12 rounded-lg text-[#0B1437] hover:text-white bg-[#E6EEFC] hover:bg-[#FC9500] duration-300 
                    flex items-center justify-center space-x-1">
                            <p>Filtrar</p>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 21.75C13.841 21.75 13.683 21.699 13.55 21.6L9.55005 18.6C9.36205 18.458 9.25 18.236 9.25 18V14C9.25 13.8 9.17203 13.611 9.03003 13.469L3.90906 8.34799C3.48406 7.92199 3.25 7.35799 3.25 6.75699V4.5C3.25 3.259 4.26 2.25 5.5 2.25H18.5C19.74 2.25 20.75 3.259 20.75 4.5V6.75699C20.75 7.35799 20.5159 7.92299 20.0909 8.34799L14.97 13.469C14.828 13.611 14.75 13.799 14.75 14V21C14.75 21.284 14.59 21.544 14.335 21.671C14.229 21.724 14.114 21.75 14 21.75ZM10.75 17.625L13.25 19.5V14C13.25 13.399 13.4841 12.834 13.9091 12.409L19.03 7.28799C19.172 7.14599 19.25 6.95799 19.25 6.75699V4.5C19.25 4.086 18.913 3.75 18.5 3.75H5.5C5.087 3.75 4.75 4.086 4.75 4.5V6.75699C4.75 6.95699 4.82797 7.14599 4.96997 7.28799L10.0909 12.409C10.5159 12.835 10.75 13.399 10.75 14V17.625Z" fill="currentColor" />
                            </svg>
                        </button>
                        {isFiltered && <button
                            onClick={clearFilter}
                            type="button" className="font-semibold cursor-pointer w-35 h-12 rounded-lg text-[#0B1437] hover:text-white bg-[#E6EEFC] hover:bg-[#FC9500] duration-300 
                    flex items-center justify-center space-x-1">
                            <p>Limpar Filtro</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                className="lucide lucide-brush-cleaning-icon lucide-brush-cleaning"><path d="m16 22-1-4" /><path d="M19 14a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v1a1 1 0 0 0 1 1" /><path d="M19 14H5l-1.973 6.767A1 1 0 0 0 4 22h16a1 1 0 0 0 .973-1.233z" /><path d="m8 22 1-4" /></svg>
                        </button>}
                    </div>

                </div>

                <div className=" mt-10 ring-2 ring-[#D4D9EA] rounded-lg relative overflow-x-auto ">
                    <div className="flex justify-end items-center text-[#707EAE] p-4">

                        {/* paginacao */}
                        <div className="flex space-x-4 items-center">
                            <div className="flex justify-end items-center w-full space-x-4">
                                {/* <p className="text-[#707EAE]">{currentPage}-{perPage} de </p> */}
                                <button onClick={handlePrevPage}
                                    disabled={!hasPrevPage}
                                    className={`${!hasPrevPage ? "text-[#707EAE] cursor-not-allowed" : "text-[#0B1437] cursor-pointer"} `}>

                                    <svg width="8" height="15" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.98901 0.363471C10.4234 0.826821 10.3999 1.55458 9.93658 1.98897L2.83148 8.65L9.93658 15.311C10.3999 15.7454 10.4234 16.4732 9.98901 16.9365C9.55462 17.3999 8.82686 17.4234 8.36351 16.989L0.363513 9.48897C0.131615 9.27157 4.49296e-05 8.96787 4.49258e-05 8.65C4.49221e-05 8.33213 0.131615 8.02844 0.363513 7.81104L8.36351 0.311036C8.82686 -0.123354 9.55462 -0.0998777 9.98901 0.363471Z" fill="currentColor" />
                                    </svg>

                                </button>

                                <button onClick={handleNextPage} disabled={!hasNextPage}
                                    className={`${!hasNextPage ? "text-[#707EAE] cursor-not-allowed" : "text-[#0B1437] cursor-pointer"} `}
                                >

                                    <svg width="8" height="15" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.311036 16.9366C-0.123354 16.4732 -0.0998778 15.7455 0.363471 15.3111L7.46857 8.65005L0.363471 1.98901C-0.0998784 1.55462 -0.123355 0.826862 0.311035 0.363512C0.745425 -0.0998383 1.47319 -0.123314 1.93654 0.311077L9.93654 7.81108C10.1684 8.02848 10.3 8.33217 10.3 8.65004C10.3 8.96792 10.1684 9.27161 9.93654 9.48901L1.93654 16.989C1.47319 17.4234 0.745426 17.3999 0.311036 16.9366Z" fill="currentColor" />
                                    </svg>
                                </button>
                            </div>


                        </div>
                    </div>
                    <table className="w-full md:table-fixed border-collapse ">
                        <thead className="h-10 ring-1 ring-[#EDEFF6]" >
                            <tr className=" place-items-center text-[#707EAE]">
                                <th className="text-start px-2 py-2 font-semibold">Tema</th>
                                <th className="text-start px-2 py-2 font-semibold">Autor</th>
                                <th className="text-start px-2 py-2 font-semibold">Estado do trabalho</th>
                                <th className="text-start px-2 py-2 font-semibold">Especialidade</th>
                                <th className="text-start px-2 py-2 font-semibold">Data de criação</th>
                                <th className="text-end px-2 py-2 font-semibold ">Ações</th>
                            </tr>
                        </thead>

                        <tbody className="h-20">

                            {(isLoading || isRefetching) ?
                                <tr className="relative">
                                    <div className="absolute flex justify-center w-full mt-5">
                                        <Spinner color="#EDEFF6" width="8" height="8" />
                                    </div>
                                </tr> :
                                filteredHistorics?.length > 0 ? filteredHistorics?.map((item: any) =>
                                    <>
                                        <tr className="border-t-0 py-2 border-[#EBECEF] hover:bg-[#F5F6FA] duration-300 text-[#143163]">

                                            <td className="text-start py-2 px-2 pt-4 border-b border-b-[#EDEFF6]">
                                                {item?.titulo ?? "N/A"}
                                            </td>
                                            <td className="text-start py-2 px-2 pt-4 border-b border-b-[#EDEFF6]">
                                                {item?.autor?.nome ?? "N/A"}
                                            </td>
                                            <td className="text-start py-2 px-2 pt-4 border-b border-b-[#EDEFF6]">
                                                <div
                                                    className={`
                                                        w-27.5
                                                        flex items-center justify-center
                                                        rounded-full px-3 py-1
                                                        text-xs font-semibold tracking-wide
                                                        border

                                                        ${item?.status === "APROVADO"
                                                            ? "bg-green-100 text-green-700 border-green-200"

                                                            : item?.status === "RECUSADO"
                                                                ? "bg-red-100 text-red-700 border-red-200"

                                                                : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                                        }
                                            `}
                                                >
                                                    {capitalize(item?.status?.toLowerCase())}
                                                </div></td>
                                            
                                            <td className="text-start py-2 px-2 pt-4 border-b border-b-[#EDEFF6]">
                                                {item?.especialidades[0]?.nome ?? "N/A"}
                                            </td>
                                            <td className="text-start py-2 px-2 pt-4 border-b border-b-[#EDEFF6]">
                                                {item?.createdAt && new Date(item?.createdAt)?.toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="text-start py-2 border-b border-b-[#EDEFF6]">
                                                <div className="flex justify-end px-3 space-x-2 ">

                                                    <button onClick={() => {
                                                        setDetalhesRemetente(true),
                                                            setItemSelected(item)
                                                    }}>
                                                        <div className=" hover:bg-[#07F] flex items-center  hover:text-white bg-[#EDF5FF]
                                                         text-[#0077FF] duration-150  p-2 rounded-lg w-8 cursor-pointer">

                                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M21.2355 10.1379C19.9225 7.93894 16.9754 4.25 12.0004 4.25C7.02536 4.25 4.07825 7.93894 2.76525 10.1379C2.07825 11.2859 2.07825 12.7131 2.76525 13.8621C4.07825 16.0611 7.02536 19.75 12.0004 19.75C16.9754 19.75 19.9225 16.0611 21.2355 13.8621C21.9225 12.7131 21.9225 11.2869 21.2355 10.1379ZM19.9484 13.092C18.7984 15.018 16.2354 18.25 12.0004 18.25C7.76536 18.25 5.20236 15.019 4.05236 13.092C3.65036 12.418 3.65036 11.581 4.05236 10.907C5.20236 8.98098 7.76536 5.74902 12.0004 5.74902C16.2354 5.74902 18.7984 8.97998 19.9484 10.907C20.3514 11.582 20.3514 12.418 19.9484 13.092ZM12.0004 7.75C9.65636 7.75 7.75036 9.657 7.75036 12C7.75036 14.343 9.65636 16.25 12.0004 16.25C14.3444 16.25 16.2504 14.343 16.2504 12C16.2504 9.657 14.3444 7.75 12.0004 7.75ZM12.0004 14.75C10.4834 14.75 9.25036 13.517 9.25036 12C9.25036 10.483 10.4834 9.25 12.0004 9.25C13.5174 9.25 14.7504 10.483 14.7504 12C14.7504 13.517 13.5174 14.75 12.0004 14.75Z" fill="currentColor" />
                                                            </svg>

                                                        </div>
                                                    </button>
                                                    <button onClick={() => {
                                                        setEditModalIsOpen(true),
                                                            setItemSelected(item)
                                                    }}>
                                                        <div className="hover:bg-[#009F5E] hover:text-white bg-[#E6FFF4]
                                                         text-[#009F5E] duration-150 p-2 rounded-lg cursor-pointer">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M21.75 7.23096C21.751 6.49496 21.4651 5.80296 20.9441 5.28296L18.7161 3.05506C18.1951 2.53506 17.5051 2.24803 16.7681 2.24903C16.0321 2.25003 15.341 2.53796 14.823 3.05896L2.46899 15.47C2.32799 15.611 2.25 15.801 2.25 15.999V20.999C2.25 21.413 2.586 21.749 3 21.749H8C8.198 21.749 8.38905 21.67 8.52905 21.531L20.9399 9.17603C21.4619 8.65803 21.749 7.96696 21.75 7.23096ZM7.68994 20.25H3.75V16.3101L12.7429 7.276L16.7251 11.257L7.68994 20.25ZM19.8821 8.11402L17.7881 10.199L13.801 6.21302L15.886 4.11804C16.122 3.88104 16.436 3.751 16.771 3.75H16.772C17.106 3.75 17.42 3.87997 17.657 4.11597L19.885 6.344C20.121 6.581 20.251 6.89498 20.251 7.22998C20.25 7.56398 20.1191 7.87802 19.8821 8.11402ZM21.75 21C21.75 21.414 21.414 21.75 21 21.75H14C13.586 21.75 13.25 21.414 13.25 21C13.25 20.586 13.586 20.25 14 20.25H21C21.414 20.25 21.75 20.586 21.75 21Z" fill="currentColor" />
                                                            </svg>
                                                        </div>
                                                    </button>

                                                    {user?.usuario?.role ==="ADMIN" && <div className="p-2 mt-1 cursor-pointer">

                                                        <Popover>
                                                            <Tooltip>
                                                                <PopoverTrigger asChild>
                                                                    <TooltipTrigger asChild>
                                                                        <button className="bg-zinc-200 w-8 h-8 cursor-pointer flex justify-center items-center rounded-lg text-[#BF181D] group duration-300">
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="7"
                                                                                height="20"
                                                                                viewBox="0 0 7 33"
                                                                                fill="none"
                                                                            >
                                                                                <path
                                                                                    fillRule="evenodd"
                                                                                    clipRule="evenodd"
                                                                                    d="M3.48257 25.5385C5.40578 25.5385 6.96509 27.0976 6.96509 29.021C6.96509 30.9443 5.40606 32.5035 3.48257 32.5035C1.55936 32.5035 5.10995e-05 30.9443 5.11835e-05 29.021C5.12676e-05 27.0976 1.55936 25.5385 3.48257 25.5385ZM3.48257 12.7692C5.40578 12.7692 6.96509 14.3284 6.96509 16.2517C6.96509 18.1751 5.40606 19.7343 3.48257 19.7343C1.55936 19.7343 5.16576e-05 18.1751 5.17417e-05 16.2517C5.18258e-05 14.3284 1.55936 12.7692 3.48257 12.7692ZM3.48257 -1.52226e-07C5.40578 -6.81596e-08 6.96509 1.55917 6.96509 3.48252C6.96509 5.40587 5.40606 6.96504 3.48257 6.96504C1.55936 6.96504 5.22158e-05 5.40587 5.22999e-05 3.48252C5.23839e-05 1.55917 1.55936 -2.36292e-07 3.48257 -1.52226e-07Z"
                                                                                    fill="#A3AED0"
                                                                                />
                                                                            </svg>
                                                                        </button>
                                                                    </TooltipTrigger>
                                                                </PopoverTrigger>

                                                                <TooltipContent>
                                                                    <p className="text-xs text-[#0d152f]">
                                                                        Validar trabalho
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>

                                                            <PopoverContent className="w-44 p-2">
                                                                <div className="flex flex-col gap-1">
                                                                    <Dialog>
                                                                        <DialogTrigger asChild>

                                                                            <button
                                                                                onClick={() => setModalValidateIsOpen(true)}
                                                                                className="
                                                                    flex items-center gap-2
                                                                    w-full rounded-md px-3 py-2
                                                                    text-sm text-green-700
                                                                    hover:bg-green-50
                                                                    transition-colors
                                                                "
                                                                            >
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width="16"
                                                                                    height="16"
                                                                                    viewBox="0 0 24 24"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="2"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                >
                                                                                    <path d="M20 6 9 17l-5-5" />
                                                                                </svg>

                                                                                Aprovar
                                                                            </button>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <ModalValidateWork name={item?.titulo} id={item?.id} action="publicar" />
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                    <Dialog>
                                                                        <DialogTrigger asChild>

                                                                            <button
                                                                                onClick={() => setModalValidateIsOpen(true)}

                                                                                className="
                                                                                flex items-center gap-2
                                                                                w-full rounded-md px-3 py-2
                                                                                text-sm text-red-600
                                                                                hover:bg-red-50
                                                                                transition-colors
                                                                            "
                                                                            >
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width="16"
                                                                                    height="16"
                                                                                    viewBox="0 0 24 24"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="2"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                >
                                                                                    <path d="M18 6 6 18" />
                                                                                    <path d="m6 6 12 12" />
                                                                                </svg>

                                                                                Rejeitar
                                                                            </button>
                                                                        </DialogTrigger>

                                                                        <DialogContent>
                                                                            <ModalValidateWork name={item?.titulo} id={item?.id} action="recusar" />
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>

                                                    </div>}
                                                </div>
                                            </td>

                                        </tr >

                                    </>
                                ) :
                                    <tr>
                                        <td colSpan={6} className="text-center py-6">Nenhum trabalho encontrado no momento.</td>
                                    </tr>
                            }

                        </tbody>
                    </table>
                </div>
            </div >
        </>
    )
}