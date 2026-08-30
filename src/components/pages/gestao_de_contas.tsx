import { useMemo, useState } from "react";
import { api } from "../config/api";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../utils/spinner";
import CreateUser from "../user/create";
import type { Role } from "../types/role";
import DetailsUser from "../user/details";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import ModalEliminarUser from "../user/eliminar";
import EditUser from "../user/edit";

type AccountTab =
    | "TODOS"
    | "ESTUDANTE"
    | "PROFESSOR"
    | "BACKOFFICE";

type AccountTabConfig = {
    key: AccountTab;
    label: string;
};

const tabs: AccountTabConfig[] = [
    {
        key: "TODOS",
        label: "TODOS",
    },
    {
        key: "ESTUDANTE",
        label: "ESTUDANTE",
    },
    {
        key: "PROFESSOR",
        label: "PROFESSOR",
    },
    {
        key: "BACKOFFICE",
        label: "BACKOFFICE",
    },
];

export default function GestaoContas() {
    const [activeTab, setActiveTab] = useState<AccountTab>("TODOS");
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
    const [detailsDepartamentModal, setDetailsDepartamentModal] = useState(false)
    const [itemSelected, setItemSelected] = useState() as any
    const [modalEliminar, setModalEliminar] = useState(false)
    const [editUserModal, setEditUserModal] = useState(false)
    const perPage = 20;

    const activeRole = tabs.find((tab) => tab.key === activeTab)?.label;

    async function getUsers() {
        if (activeTab === "BACKOFFICE") {
            const [avaliadoresResponse, adminsResponse] = await Promise.all([
                api.get("usuarios?role=AVALIADOR"),
                api.get("usuarios?role=ADMIN"),
            ]);

            return {
                ...avaliadoresResponse.data,
                dados: [
                    ...(avaliadoresResponse.data?.dados ?? []),
                    ...(adminsResponse.data?.dados ?? []),
                ],
            };
        }

        const url = activeRole
            ? `usuarios?role=${activeRole === "TODOS" ? "" : activeRole}`
            : "usuarios";

        const { data } = await api.get(url);

        return data;
    }

    const {
        data,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["gestaoContas", activeTab],
        queryFn: getUsers,
    });

    const users = data?.dados ?? [];

    const normalizedSearch = useMemo(
        () => searchInput.trim().toLowerCase(),
        [searchInput]
    );

    const filteredUsers = useMemo(() => {
        if (!normalizedSearch) return users;

        return users.filter((item: any) => {
            const fields = [
                item?.nome,
                item?.email,
                item?.bi_number,
                item?.role,
                item?.departamento?.nome,
                item?.especialidades?.[0]?.nome,
            ];

            return fields.some((field) =>
                String(field ?? "")
                    .toLowerCase()
                    .includes(normalizedSearch)
            );
        });
    }, [users, normalizedSearch]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredUsers.length / perPage)
    );

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return filteredUsers.slice(start, start + perPage);
    }, [filteredUsers, currentPage]);

    const handleTabChange = (tab: AccountTab) => {
        setActiveTab(tab);
        setCurrentPage(1);
        setSearchInput("");
    };

    const handleSearch = (value: string) => {
        setSearchInput(value);
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearchInput("");
        setCurrentPage(1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const getCreateRole = (): Role => {
        switch (activeTab) {
            case "PROFESSOR":
                return "Professor";

            case "BACKOFFICE":
                return "Avaliador";

            case "ESTUDANTE":
            default:
                return "Estudante";
        }
    };

    const getRoleLabel = (role?: string) => {
        switch (role) {
            case "ESTUDANTE":
                return "Estudante";
            case "PROFESSOR":
                return "Professor";

            case "ADMIN":
                return "Administrador";
            case "AVALIADOR":
                return "Avaliador"
            default:
                return role ?? "N/A";
        }
    };

    return (
        <>
            <CreateUser
                onClose={() => setCreateModalIsOpen(false)}
                isOpen={createModalIsOpen}
            />
            <EditUser
                onClose={() => setEditUserModal(false)}
                isOpen={editUserModal}
                itemSelected={itemSelected}
            />
            <DetailsUser onClose={() => setDetailsDepartamentModal(false)}
                isOpen={detailsDepartamentModal} itemSelected={itemSelected} />


            <div className="bg-white rounded-lg h-fit text-sm flex flex-col p-5">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-1">
                    <p className="text-[#0B1437] font-bold text-[16px]">
                        Dashboard
                    </p>
                    <p className="text-[#707EAE] text-[16px]">/</p>
                    <p className="text-[#707EAE] text-[16px]">
                        Gestão de Contas
                    </p>
                </div>

                {/* Cabeçalho */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-5">
                    <div>
                        <h1 className="text-[#0B1437] font-bold text-xl">
                            Gestão de Contas
                        </h1>
                        <p className="text-[#707EAE] mt-1">
                            Gerencie estudantes, docentes e utilizadores do backoffice.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Pesquisa */}
                        <div className="relative w-full sm:w-[280px] h-[42px] text-[#465A9D]">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10.667 0C16.5579 0.000176655 21.333 4.77606 21.333 10.667C21.3329 13.1316 20.4947 15.399 19.0908 17.2051L23.6094 21.7236C24.1301 22.2443 24.1301 23.0887 23.6094 23.6094C23.0887 24.1301 22.2443 24.1301 21.7236 23.6094L17.2051 19.0908C15.399 20.4947 13.1316 21.3329 10.667 21.333C4.77606 21.333 0.000176651 16.5579 0 10.667C0 4.77596 4.77596 0 10.667 0ZM10.667 2.66699C6.24871 2.66699 2.66699 6.24871 2.66699 10.667C2.66717 15.0851 6.24882 18.667 10.667 18.667C15.085 18.6668 18.6668 15.085 18.667 10.667C18.667 6.24882 15.0851 2.66717 10.667 2.66699Z"
                                    fill="#A3AED0"
                                />
                            </svg>

                            <input
                                type="search"
                                placeholder="Pesquisar por nome ou email..."
                                value={searchInput}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="p-2 h-[42px] rounded-full ring-1 ring-[#D4D9EA] focus:ring-1 focus:ring-[#FFC505] w-full focus:outline-none text-sm text-[#465A9D] pl-10 pr-9"
                            />

                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707EAE] hover:text-[#0B1437]"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => setCreateModalIsOpen(true)}
                            type="button"
                            className="font-semibold cursor-pointer min-w-[140px] h-[42px] px-5 rounded-lg text-[#0B1437] hover:text-white bg-[#E6EEFC] hover:bg-[#FC9500] duration-300 flex items-center justify-center gap-2"
                        >
                            <span>Adicionar</span>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M19.75 12C19.75 12.414 19.414 12.75 19 12.75H12.75V19C12.75 19.414 12.414 19.75 12 19.75C11.586 19.75 11.25 19.414 11.25 19V12.75H5C4.586 12.75 4.25 12.414 4.25 12C4.25 11.586 4.586 11.25 5 11.25H11.25V5C11.25 4.586 11.586 4.25 12 4.25C12.414 4.25 12.75 4.586 12.75 5V11.25H19C19.414 11.25 19.75 11.586 19.75 12Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Abas */}
                <div className="mt-7 border-b border-[#EDEFF6] overflow-x-auto">
                    <div className="flex min-w-max gap-1">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.key;

                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => handleTabChange(tab.key)}
                                    className={`
                relative px-5 py-3 font-semibold transition-all duration-200
                ${isActive
                                            ? "text-[#0B1437]"
                                            : "text-[#707EAE] hover:text-[#0B1437]"
                                        }
            `}
                                >
                                    {tab.label}

                                    {isActive && (
                                        <span className="absolute left-0 right-0 bottom-[-1px] h-[2px] bg-[#FC9500] rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tabela */}
                <div className="mt-6 ring-[2px] ring-[#D4D9EA] rounded-lg relative overflow-x-auto">
                    {/* Paginação */}
                    <div className="flex justify-between items-center text-[#707EAE] p-4">
                        <p className="text-xs sm:text-sm">
                            {filteredUsers.length > 0
                                ? `${(currentPage - 1) * perPage + 1}-${Math.min(
                                    currentPage * perPage,
                                    filteredUsers.length
                                )} de ${filteredUsers.length}`
                                : "0 resultados"}
                        </p>

                        <div className="flex space-x-4 items-center">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`${currentPage === 1
                                    ? "text-[#707EAE] cursor-not-allowed"
                                    : "text-[#0B1437] cursor-pointer"
                                    }`}
                                aria-label="Página anterior"
                            >
                                <svg
                                    width="8"
                                    height="15"
                                    viewBox="0 0 11 18"
                                    fill="none"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M9.98901 0.363471C10.4234 0.826821 10.3999 1.55458 9.93658 1.98897L2.83148 8.65L9.93658 15.311C10.3999 15.7454 10.4234 16.4732 9.98901 16.9365C9.55462 17.3999 8.82686 17.4234 8.36351 16.989L0.363513 9.48897C0.131615 9.27157 4.49296e-05 8.96787 4.49258e-05 8.65C4.49221e-05 8.33213 0.131615 8.02844 0.363513 7.81104L8.36351 0.311036C8.82686 -0.123354 9.55462 -0.0998777 9.98901 0.363471Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>

                            <span className="text-xs text-[#707EAE]">
                                Página {currentPage} de {totalPages}
                            </span>

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage >= totalPages}
                                className={`${currentPage >= totalPages
                                    ? "text-[#707EAE] cursor-not-allowed"
                                    : "text-[#0B1437] cursor-pointer"
                                    }`}
                                aria-label="Próxima página"
                            >
                                <svg
                                    width="8"
                                    height="15"
                                    viewBox="0 0 11 18"
                                    fill="none"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M0.311036 16.9366C-0.123354 16.4732 -0.0998778 15.7455 0.363471 15.3111L7.46857 8.65005L0.363471 1.98901C-0.0998784 1.55462 -0.123355 0.826862 0.311035 0.363512C0.745425 -0.0998383 1.47319 -0.123314 1.93654 0.311077L9.93654 7.81108C10.1684 8.02848 10.3 8.33217 10.3 8.65004C10.3 8.96792 10.1684 9.27161 9.93654 9.48901L1.93654 16.989C1.47319 17.4234 0.745426 17.3999 0.311036 16.9366Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <table className="w-full md:table-fixed border-collapse min-w-[760px]">
                        <thead className="h-10 ring-1 ring-[#EDEFF6]">
                            <tr className="text-[#707EAE]">
                                <th className="text-start px-4 py-2 font-semibold">
                                    Nome
                                </th>
                                <th className="text-start px-4 py-2 font-semibold">
                                    Email
                                </th>
                                <th className="text-start px-4 py-2 font-semibold">
                                    Perfil
                                </th>
                                <th className="text-start px-4 py-2 font-semibold">
                                    Especialidade
                                </th>
                                <th className="text-start px-4 py-2 font-semibold">
                                    Data de criação
                                </th>
                                <th className="text-end px-4 py-2 font-semibold w-28">
                                    Acções
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading || isFetching ? (
                                <tr>
                                    <td colSpan={6} className="py-12">
                                        <div className="flex justify-center">
                                            <Spinner
                                                color="#EDEFF6"
                                                width="8"
                                                height="8"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedUsers.length > 0 ? (
                                paginatedUsers.map((item: any) => (
                                    <tr
                                        key={item?.id}
                                        className="border-t border-[#EBECEF] hover:bg-[#F5F6FA] duration-300 text-[#143163]"
                                    >
                                        <td className="text-start py-3 px-4 border-b border-[#EDEFF6] font-medium">
                                            {item?.nome ?? "N/A"}
                                        </td>

                                        <td className="text-start py-3 px-4 border-b border-[#EDEFF6]">
                                            {item?.email ?? "N/A"}
                                        </td>

                                        <td className="text-start py-3 px-4 border-b border-[#EDEFF6]">
                                            <span className="inline-flex items-center rounded-full bg-[#F5F7FC] px-3 py-1 text-xs font-semibold text-[#465A9D]">
                                                {getRoleLabel(item?.role)}
                                            </span>
                                        </td>

                                        <td className="text-start py-3 px-4 border-b border-[#EDEFF6]">
                                            {item?.especialidades?.[0]?.nome ?? "N/A"}
                                        </td>

                                        <td className="text-start py-3 px-4 border-b border-[#EDEFF6]">
                                            {item?.createdAt
                                                ? new Date(
                                                    item.createdAt
                                                ).toLocaleDateString("pt-BR")
                                                : "N/A"}
                                        </td>

                                        <td className="py-3 px-4 border-b border-[#EDEFF6]">
                                            <div className="flex justify-end gap-2">
                                                {/* Ver */}
                                                <button
                                                    type="button"
                                                    title="Ver detalhes"
                                                    onClick={() => {
                                                       setDetailsDepartamentModal(true)
                                                       setItemSelected(item);
                                                    }}
                                                    className="hover:bg-[#07F] hover:text-white bg-[#EDF5FF] text-[#0077FF] duration-150 p-2 rounded-lg cursor-pointer"
                                                >
                                                    <svg
                                                        width="15"
                                                        height="15"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                    >
                                                        <path
                                                            d="M21.2355 10.1379C19.9225 7.93894 16.9754 4.25 12.0004 4.25C7.02536 4.25 4.07825 7.93894 2.76525 10.1379C2.07825 11.2859 2.07825 12.7131 2.76525 13.8621C4.07825 16.0611 7.02536 19.75 12.0004 19.75C16.9754 19.75 19.9225 16.0611 21.2355 13.8621ZM19.9484 13.092C18.7984 15.018 16.2354 18.25 12.0004 18.25C7.76536 18.25 5.20236 15.019 4.05236 13.092C3.65036 12.418 3.65036 11.581 4.05236 10.907C5.20236 8.98098 7.76536 5.74902 12.0004 5.74902C16.2354 5.74902 18.7984 8.97998 19.9484 10.907C20.3514 11.582 20.3514 12.418 19.9484 13.092ZM12.0004 7.75C9.65636 7.75 7.75036 9.657 7.75036 12C7.75036 14.343 9.65636 16.25 12.0004 16.25C14.3444 16.25 16.2504 14.343 16.2504 12C16.2504 9.657 14.3444 7.75 12.0004 7.75ZM12.0004 14.75C10.4834 14.75 9.25036 13.517 9.25036 12C9.25036 10.483 10.4834 9.25 12.0004 9.25C13.5174 9.25 14.7504 10.483 14.7504 12C14.7504 13.517 13.5174 14.75 12.0004 14.75Z"
                                                            fill="currentColor"
                                                        />
                                                    </svg>
                                                </button>

                                                {/* Editar */}
                                                <button
                                                    type="button"
                                                    title="Editar"
                                                    onClick={() => {setEditUserModal(true), setItemSelected(item)}}
                                                    className="hover:bg-[#009F5E] hover:text-white bg-[#E6FFF4] text-[#009F5E] duration-150 p-2 rounded-lg cursor-pointer"
                                                >
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                    >
                                                        <path
                                                            d="M21.75 7.23096C21.751 6.49496 21.4651 5.80296 20.9441 5.28296L18.7161 3.05506C18.1951 2.53506 17.5051 2.24803 16.7681 2.24903C16.0321 2.25003 15.341 2.53796 14.823 3.05896L2.46899 15.47C2.32799 15.611 2.25 15.801 2.25 15.999V20.999C2.25 21.413 2.586 21.749 3 21.749H8C8.198 21.749 8.38905 21.67 8.52905 21.531L20.9399 9.17603C21.4619 8.65896 21.749 7.96696 21.75 7.23096ZM7.68994 20.25H3.75V16.3101L12.7429 7.276L16.7251 11.257L7.68994 20.25ZM19.8821 8.11402L17.7881 10.199L13.801 6.21302L15.886 4.11804C16.122 3.88104 16.436 3.751 16.771 3.75H16.772C17.106 3.75 17.42 3.87997 17.657 4.11597L19.885 6.344C20.121 6.581 20.251 6.89498 20.251 7.22998C20.25 7.56398 20.1191 7.87802 19.8821 8.11402ZM21.75 21C21.75 21.414 21.414 21.75 21 21.75H14C13.586 21.75 13.25 21.414 13.25 21C13.25 20.586 13.586 20.25 14 20.25H21C21.414 20.25 21.75 21 21.75Z"
                                                            fill="currentColor"
                                                        />
                                                    </svg>
                                                </button>

                                                {/* Eliminar */}
                                                <Dialog >
                                                    <Tooltip >
                                                        <TooltipTrigger>


                                                            <DialogTrigger asChild className="cursor-pointer p-1">

                                                                {/* eliminar */}

                                                                <button onClick={() => { setModalEliminar(true), setItemSelected(item) }}>
                                                                    <div className=" hover:bg-[#E02E2E] flex items-center space-x-1 hover:text-[#fff] bg-[#FFE3E3] text-[#E02E2E] duration-150 p-2 rounded-lg  cursor-pointer">
                                                                        <svg width="15" height="15" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M10.5082 1.11108C8.75453 1.11108 7.29426 2.42146 7.04917 4.11031H3.62915C3.58658 4.10303 3.54346 4.09944 3.50027 4.09957C3.46296 4.10038 3.42575 4.10397 3.38897 4.11031H1.76049C1.66113 4.10891 1.56248 4.12726 1.47028 4.16431C1.37808 4.20136 1.29416 4.25637 1.2234 4.32614C1.15264 4.3959 1.09645 4.47904 1.0581 4.5707C1.01975 4.66237 1 4.76075 1 4.86012C1 4.95949 1.01975 5.05787 1.0581 5.14953C1.09645 5.2412 1.15264 5.32434 1.2234 5.3941C1.29416 5.46387 1.37808 5.51887 1.47028 5.55593C1.56248 5.59298 1.66113 5.61133 1.76049 5.60993H2.82955L4.08801 18.6212C4.22352 20.0242 5.41544 21.1059 6.82461 21.1059H14.1909C15.6001 21.1059 16.792 20.0243 16.9275 18.6212L18.1869 5.60993H19.256C19.3553 5.61133 19.454 5.59298 19.5462 5.55593C19.6384 5.51887 19.7223 5.46387 19.7931 5.3941C19.8638 5.32434 19.92 5.2412 19.9584 5.14953C19.9967 5.05787 20.0165 4.95949 20.0165 4.86012C20.0165 4.76075 19.9967 4.66237 19.9584 4.5707C19.92 4.47904 19.8638 4.3959 19.7931 4.32614C19.7223 4.25637 19.6384 4.20136 19.5462 4.16431C19.454 4.12726 19.3553 4.10891 19.256 4.11031H17.6285C17.5489 4.09741 17.4678 4.09741 17.3883 4.11031H13.9673C13.7222 2.42146 12.2619 1.11108 10.5082 1.11108ZM10.5082 2.6107C11.4476 2.6107 12.2182 3.24462 12.4384 4.11031H8.57807C8.79829 3.24462 9.5689 2.6107 10.5082 2.6107ZM4.33502 5.60993H16.6805L15.4347 18.4767C15.3722 19.1241 14.8411 19.6063 14.1909 19.6063H6.82461C6.17532 19.6063 5.64324 19.1233 5.58079 18.4767L4.33502 5.60993ZM8.74697 8.09854C8.54828 8.10165 8.35895 8.18349 8.22055 8.32609C8.08216 8.4687 8.00603 8.6604 8.00888 8.85909V16.3572C8.00747 16.4565 8.02583 16.5552 8.06288 16.6474C8.09993 16.7396 8.15494 16.8235 8.2247 16.8942C8.29447 16.965 8.3776 17.0212 8.46927 17.0595C8.56094 17.0979 8.65932 17.1176 8.75869 17.1176C8.85806 17.1176 8.95643 17.0979 9.0481 17.0595C9.13977 17.0212 9.2229 16.965 9.29267 16.8942C9.36243 16.8235 9.41744 16.7396 9.45449 16.6474C9.49154 16.5552 9.5099 16.4565 9.50849 16.3572V8.85909C9.50993 8.75873 9.49121 8.65911 9.45344 8.56612C9.41567 8.47313 9.35961 8.38867 9.2886 8.31775C9.21758 8.24682 9.13305 8.19088 9.04001 8.15322C8.94697 8.11557 8.84733 8.09698 8.74697 8.09854ZM12.2461 8.09854C12.0474 8.10165 11.858 8.18349 11.7197 8.32609C11.5813 8.4687 11.5051 8.6604 11.508 8.85909V16.3572C11.5066 16.4565 11.5249 16.5552 11.562 16.6474C11.599 16.7396 11.654 16.8235 11.7238 16.8942C11.7936 16.965 11.8767 17.0212 11.9684 17.0595C12.06 17.0979 12.1584 17.1176 12.2578 17.1176C12.3572 17.1176 12.4555 17.0979 12.5472 17.0595C12.6389 17.0212 12.722 16.965 12.7918 16.8942C12.8615 16.8235 12.9165 16.7396 12.9536 16.6474C12.9906 16.5552 13.009 16.4565 13.0076 16.3572V8.85909C13.009 8.75873 12.9903 8.65911 12.9525 8.56612C12.9148 8.47313 12.8587 8.38867 12.7877 8.31775C12.7167 8.24682 12.6321 8.19088 12.5391 8.15322C12.4461 8.11557 12.3464 8.09698 12.2461 8.09854Z" fill="currentColor" stroke="currentColor" stroke-width="0.3" />
                                                                        </svg>
                                                                    </div>
                                                                </button>

                                                            </DialogTrigger>

                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Eliminar</p>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    {modalEliminar &&
                                                        <DialogContent className="sm:max-w-md md:w-100 p-3" >

                                                            <ModalEliminarUser
                                                                id={itemSelected?.id}
                                                            //idsContactos={selectedIds}
                                                            />

                                                        </DialogContent>}
                                                </Dialog>

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center py-12 text-[#707EAE]"
                                    >
                                        {normalizedSearch
                                            ? "Nenhuma conta encontrada para a pesquisa."
                                            : "Nenhuma conta encontrada nesta categoria."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
