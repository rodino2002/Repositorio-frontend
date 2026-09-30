import { useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../config/api";
import { Spinner } from "../utils/spinner";
import CreateWorks from "../works/create";
import DetailsWork from "../works/details";
import UpdateWork from "../works/edit";
import ModalValidateWork from "../works/modalValidate";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { capitalize } from "../helpers/capitalize";
import { AuthContext } from "@/Context/auth.context";

export default function Trabalhos() {
    const { user } = useContext(AuthContext);
    const role = user?.usuario?.role;
    const userId = user?.usuario?.id;

    const isProfessor = role === "PROFESSOR";
    const isEstudante = role === "ESTUDANTE";
    const isAdmin = role === "ADMIN";
    const isAvaliador = role === "AVALIADOR";

    const [activeTab, setActiveTab] = useState<"todos" | "meus">(isEstudante ? "meus" : "todos");
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [itemSelected, setItemSelected] = useState<any>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

    useEffect(() => {
        if (isEstudante) setActiveTab("meus");
    }, [isEstudante]);

    const isMyWorks = isEstudante || (isProfessor && activeTab === "meus");
    const canCreate = isProfessor || isEstudante;
    const canValidate = isAdmin || isAvaliador;

    const getWorks = async () => {
        const endpoint = isMyWorks ? "trabalhos/me" : "trabalhos";
        const { data } = await api.get(endpoint, {
            params: {
                page: currentPage,
                per_page: perPage,
                search: searchInput.trim() || undefined,
            },
        });
        return data;
    };

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["worksList", role, activeTab, currentPage, perPage],
        queryFn: getWorks,
        enabled: !!role,
    });

    const works = data?.dados ?? [];

    const totalPages = Math.max(
        1,
        data?.paginacao?.totalPaginas ??
        1
    );

    const hasPrevPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    const normalizeText = (value: unknown) =>
        String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

    const filteredWorks = useMemo(() => {
        const search = normalizeText(searchInput);
        if (!search) return works;

        return works.filter((item: any) => {
            const createdAt = item?.createdAt ? new Date(item.createdAt).toLocaleDateString("pt-BR") : "";
            const fields = [
                item?.titulo,
                item?.resumo,
                item?.autor?.nome,
                item?.departamento?.nome,
                item?.status,
                createdAt,
                ...(item?.especialidades?.map((especialidade: any) => especialidade?.nome) ?? []),
            ];
            return fields.some((field) => normalizeText(field).includes(search));
        });
    }, [works, searchInput]);

    const handleSearch = (value: string) => {
        setSearchInput(value);
        if (currentPage !== 1) setCurrentPage(1);
    };

    const handleTabChange = (tab: "todos" | "meus") => {
        setActiveTab(tab);
        setCurrentPage(1);
        setSearchInput("");
    };

    const handlePerPageChange = (value: number) => {
        setPerPage(value);
        setCurrentPage(1);
    };

    const handlePrevPage = () => {
        if (hasPrevPage) setCurrentPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (hasNextPage) setCurrentPage((prev) => prev + 1);
    };

    const canEditWork = (item: any) => {
        if (isAdmin) return true;
        if (isProfessor || isEstudante) return item?.autor?.id === userId;
        return false;
    };

    const statusLabel = (status: string) => {
        const labels: Record<string, string> = {
            RASCUNHO: "Rascunho",
            PENDENTE: "Pendente",
            EM_REVISAO: "Em revisão",
            APROVADO: "Aprovado",
            RECUSADO: "Recusado",
            PUBLICADO: "Publicado",
        };
        return labels[status] ?? capitalize(status?.toLowerCase() ?? "");
    };

    const statusClass = (status: string) => {
        const classes: Record<string, string> = {
            RASCUNHO: "bg-slate-100 text-slate-600 border-slate-200",
            PENDENTE: "bg-yellow-100 text-yellow-700 border-yellow-200",
            EM_REVISAO: "bg-purple-100 text-purple-700 border-purple-200",
            APROVADO: "bg-green-100 text-green-700 border-green-200",
            RECUSADO: "bg-red-100 text-red-700 border-red-200",
            PUBLICADO: "bg-blue-100 text-blue-700 border-blue-200",
        };
        return classes[status] ?? "bg-gray-100 text-gray-600 border-gray-200";
    };

    const renderStatus = (status: string) => (
        <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold border whitespace-nowrap ${statusClass(status)}`}>
            {statusLabel(status)}
        </span>
    );

    const renderSpecialties = (item: any) => {
        const specialties = item?.especialidades ?? [];
        if (!specialties.length) return <span className="text-[#A3AED0]">N/A</span>;

        return (
            <div className="flex flex-wrap gap-1">
                {specialties.slice(0, 2).map((especialidade: any, index: number) => (
                    <span key={especialidade?.id ?? index} className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium whitespace-nowrap">
                        {especialidade?.nome}
                    </span>
                ))}
                {specialties.length > 2 && (
                    <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-500 text-[11px] font-medium">
                        +{specialties.length - 2}
                    </span>
                )}
            </div>
        );
    };

    const renderActions = (item: any) => {
        const canEdit = canEditWork(item);

        return (
            <div className="flex items-center justify-end gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button type="button" onClick={() => { setItemSelected(item); setDetailsOpen(true); }} className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#EDF5FF] text-[#0077FF] hover:bg-[#0077FF] hover:text-white transition-colors">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                <path d="M21.2355 10.1379C19.9225 7.93894 16.9754 4.25 12.0004 4.25C7.02536 4.25 4.07825 7.93894 2.76525 10.1379C2.07825 11.2859 2.07825 12.7131 2.76525 13.8621C4.07825 16.0611 7.02536 19.75 12.0004 19.75C16.9754 19.75 19.9225 16.0611 21.2355 13.8621C21.9225 12.7131 21.9225 11.2869 21.2355 10.1379ZM19.9484 13.092C18.7984 15.018 16.2354 18.25 12.0004 18.25C7.76536 18.25 5.20236 15.019 4.05236 13.092C3.65036 12.418 3.65036 11.581 4.05236 10.907C5.20236 8.98098 7.76536 5.74902 12.0004 5.74902C16.2354 5.74902 18.7984 8.97998 19.9484 10.907C20.3514 11.582 20.3514 12.418 19.9484 13.092ZM12.0004 7.75C9.65636 7.75 7.75036 9.657 7.75036 12C7.75036 14.343 9.65636 16.25 12.0004 16.25C14.3444 16.25 16.2504 14.343 16.2504 12C16.2504 9.657 14.3444 7.75 12.0004 7.75ZM12.0004 14.75C10.4834 14.75 9.25036 13.517 9.25036 12C9.25036 10.483 10.4834 9.25 12.0004 9.25C13.5174 9.25 14.7504 10.483 14.7504 12C14.7504 13.517 13.5174 14.75 12.0004 14.75Z" fill="currentColor" />
                            </svg>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent><p className="text-xs">Visualizar trabalho</p></TooltipContent>
                </Tooltip>

                {canEdit && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={() => { setItemSelected(item); setEditModalIsOpen(true); }} className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#E6FFF4] text-[#009F5E] hover:bg-[#009F5E] hover:text-white transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M21.75 7.23096C21.751 6.49496 21.4651 5.80296 20.9441 5.28296L18.7161 3.05506C18.1951 2.53506 17.5051 2.24803 16.7681 2.24903C16.0321 2.25003 15.341 2.53796 14.823 3.05896L2.46899 15.47C2.32799 15.611 2.25 15.801 2.25 15.999V20.999C2.25 21.413 2.586 21.749 3 21.749H8C8.198 21.749 8.38905 21.67 8.52905 21.531L20.9399 9.17603C21.4619 8.65803 21.749 7.96696 21.75 7.23096ZM7.68994 20.25H3.75V16.3101L12.7429 7.276L16.7251 11.257L7.68994 20.25ZM19.8821 8.11402L17.7881 10.199L13.801 6.21302L15.886 4.11804C16.122 3.88104 16.436 3.751 16.771 3.75H16.772C17.106 3.75 17.42 3.87997 17.657 4.11597L19.885 6.344C20.121 6.581 20.251 6.89498 20.251 7.22998C20.25 7.56398 20.119 7.87802 19.8821 8.11402ZM21.75 21C21.75 21.414 21.414 21.75 21 21.75H14C13.586 21.75 13.25 21.414 13.25 21C13.25 20.586 13.586 20.25 14 20.25H21C21.414 20.25 21.75 20.586 21.75 21Z" fill="currentColor" />
                                </svg>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent><p className="text-xs">Editar trabalho</p></TooltipContent>
                    </Tooltip>
                )}

                {canValidate && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <button type="button" className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-100 text-[#707EAE] hover:bg-[#0B1437] hover:text-white transition-colors">
                                <svg width="7" height="20" viewBox="0 0 7 33" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M3.48257 25.5385C5.40578 25.5385 6.96509 27.0976 6.96509 29.021C6.96509 30.9443 5.40606 32.5035 3.48257 32.5035C1.55936 32.5035 5.10995e-05 30.9443 5.11835e-05 29.021C5.12676e-05 27.0976 1.55936 25.5385 3.48257 25.5385ZM3.48257 12.7692C5.40578 12.7692 6.96509 14.3284 6.96509 16.2517C6.96509 18.1751 5.40606 19.7343 3.48257 19.7343C1.55936 19.7343 5.16576e-05 18.1751 5.17417e-05 16.2517C5.18258e-05 14.3284 1.55936 12.7692 3.48257 12.7692ZM3.48257 -1.52226e-07C5.40578 -6.81596e-08 6.96509 1.55917 6.96509 3.48252C6.96509 5.40587 5.40606 6.96504 3.48257 6.96504C1.55936 6.96504 5.22158e-05 5.40587 5.22999e-05 3.48252Z" fill="currentColor" />
                                </svg>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-44 p-2">
                            <div className="flex flex-col gap-1">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button type="button" className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                            Aprovar
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent><ModalValidateWork name={item?.titulo} id={item?.id} action="publicar" /></DialogContent>
                                </Dialog>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button type="button" className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                            Rejeitar
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent><ModalValidateWork name={item?.titulo} id={item?.id} action="recusar" /></DialogContent>
                                </Dialog>
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
            </div>
        );
    };

    const renderPagination = () => (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-[#EDEFF6] text-sm text-[#707EAE]">
            <div className="flex items-center gap-2">
                <span>Mostrar</span>
                <select value={perPage} onChange={(e) => handlePerPageChange(Number(e.target.value))} className="h-9 rounded-lg border border-[#D4D9EA] bg-white px-2 text-sm text-[#465A9D] focus:outline-none focus:ring-1 focus:ring-[#FFC505]">
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <span>por página</span>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4">
                <span className="text-xs sm:text-sm">Página {currentPage} de {totalPages}</span>
                <div className="flex items-center gap-2">
                    <button type="button" onClick={handlePrevPage} disabled={!hasPrevPage} className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#D4D9EA] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F6FA]">
                        <svg width="8" height="15" viewBox="0 0 11 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M9.98901 0.363471C10.4234 0.826821 10.3999 1.55458 9.93658 1.98897L2.83148 8.65L9.93658 15.311C10.3999 15.7454 10.4234 16.4732 9.98901 16.9365C9.55462 17.3999 8.82686 17.4234 8.36351 16.989L0.363513 9.48897C0.131615 9.27157 4.49296e-05 8.96787 4.49258e-05 8.65C4.49221e-05 8.33213 0.131615 8.02844 0.363513 7.81104L8.36351 0.311036C8.82686 -0.123354 9.55462 -0.0998777 9.98901 0.363471Z" fill="currentColor" /></svg>
                    </button>
                    <button type="button" onClick={handleNextPage} disabled={!hasNextPage} className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#D4D9EA] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F6FA]">
                        <svg width="8" height="15" viewBox="0 0 11 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M0.311036 16.9366C-0.123354 16.4734 -0.0998778 15.7456 0.363471 15.3111L7.46857 8.65005L0.363471 1.98901C-0.0998784 1.55462 -0.123355 0.826862 0.311035 0.363512C0.745425 -0.0998383 1.47319 -0.123314 1.93654 0.311077L9.93654 7.81108C10.1684 8.02848 10.3 8.33217 10.3 8.65004C10.3 8.96792 10.1684 9.27161 9.93654 9.48901L1.93654 16.989C1.47319 17.4234 0.745426 17.3999 0.311036 16.9366Z" fill="currentColor" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <CreateWorks onClose={() => setCreateModalIsOpen(false)} isOpen={createModalIsOpen} />
            <UpdateWork onClose={() => setEditModalIsOpen(false)} isOpen={editModalIsOpen} itemSelected={itemSelected} />
            <DetailsWork onClose={() => setDetailsOpen(false)} isOpen={detailsOpen} itemSelected={itemSelected} />

            <div className="bg-white rounded-lg h-fit text-sm flex flex-col p-3 sm:p-5 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-[#0B1437] font-bold">Dashboard</p>
                    <p className="text-[#707EAE]">/</p>
                    <p className="text-[#707EAE]">Trabalhos</p>
                </div>

                <div className="mt-5">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0B1437]">Trabalhos</h1>
                    <p className="text-[#707EAE] mt-1">Consulte e gerencie os trabalhos académicos.</p>
                </div>

                {isProfessor && (
                    <div className="mt-5 border-b border-[#EDEFF6] overflow-x-auto">
                        <div className="flex min-w-max">
                            <button type="button" onClick={() => handleTabChange("todos")} className={`relative px-4 py-3 font-semibold ${activeTab === "todos" ? "text-[#0B1437]" : "text-[#707EAE]"}`}>
                                Todos os trabalhos
                                {activeTab === "todos" && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FC9500] rounded-t-full" />}
                            </button>
                            <button type="button" onClick={() => handleTabChange("meus")} className={`relative px-4 py-3 font-semibold ${activeTab === "meus" ? "text-[#0B1437]" : "text-[#707EAE]"}`}>
                                Meus trabalhos
                                {activeTab === "meus" && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FC9500] rounded-t-full" />}
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="relative w-full lg:max-w-xl">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3AED0]" width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M10.667 0C16.5579 0.000176655 21.333 4.77606 21.333 10.667C21.3329 13.1316 20.4947 15.399 19.0908 17.2051L23.6094 21.7236C24.1301 22.2443 24.1301 23.0887 23.6094 23.6094C23.0887 24.1301 22.2443 24.1301 21.7236 23.6094L17.2051 19.0908C15.399 20.4947 13.1316 21.3329 10.667 21.333C4.77606 21.333 0.000176655 16.5579 0 10.667C0 4.77596 4.77596 0 10.667 0ZM10.667 2.66699C6.24871 2.66699 2.66699 6.24871 2.66699 10.667C2.66717 15.0851 6.24882 18.667 10.667 18.667C15.085 18.6668 18.6668 15.085 18.667 10.667C18.667 6.24882 15.0851 2.66717 10.667 2.66699Z" fill="currentColor" />
                        </svg>
                        <input type="search" value={searchInput} onChange={(e) => handleSearch(e.target.value)} placeholder="Pesquisar por título, autor ou palavra-chave..." className="w-full h-11 rounded-lg border border-[#D4D9EA] bg-white pl-10 pr-10 text-sm text-[#465A9D] placeholder:text-[#A3AED0] focus:outline-none focus:ring-1 focus:ring-[#FFC505]" />
                        {searchInput && (
                            <button type="button" onClick={() => handleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3AED0] hover:text-[#0B1437]">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            </button>
                        )}
                    </div>

                    {canCreate && (
                        <button onClick={() => setCreateModalIsOpen(true)} type="button" className="h-11 px-4 rounded-lg font-semibold text-[#0B1437] hover:text-white bg-[#E6EEFC] hover:bg-[#FC9500] duration-300 flex items-center justify-center gap-2 w-full lg:w-auto">
                            <span>Adicionar trabalho</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19.75 12C19.75 12.414 19.414 12.75 19 12.75H12.75V19C12.75 19.414 12.414 19.75 12 19.75C11.586 19.75 11.25 19.414 11.25 19V12.75H5C4.586 12.75 4.25 12.414 4.25 12C4.25 11.586 4.586 11.25 5 11.25H11.25V5C11.25 4.586 11.586 4.25 12 4.25C12.414 4.25 12.75 4.586 12.75 5V11.25H19C19.414 11.25 19.75 11.586 19.75 12Z" fill="currentColor" /></svg>
                        </button>
                    )}
                </div>

                <div className="mt-6 border border-[#D4D9EA] rounded-xl overflow-hidden">
                    {isLoading || isFetching ? (
                        <div className="min-h-[300px] flex items-center justify-center">
                            <Spinner color="#EDEFF6" width="8" height="8" />
                        </div>
                    ) : filteredWorks.length === 0 ? (
                        <div className="min-h-[260px] flex flex-col items-center justify-center text-center px-5">
                            <div className="h-12 w-12 rounded-full bg-[#F5F6FA] flex items-center justify-center text-[#A3AED0] mb-3">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M10.667 0C16.5579 0.000176655 21.333 4.77606 21.333 10.667C21.3329 13.1316 20.4947 15.399 19.0908 17.2051L23.6094 21.7236C24.1301 22.2443 24.1301 23.0887 23.6094 23.6094C23.0887 24.1301 22.2443 24.1301 21.7236 23.6094L17.2051 19.0908C15.399 20.4947 13.1316 21.333 10.667 21.333C4.77606 21.333 0.000176655 16.5579 0 10.667C0 4.77596 4.77596 0 10.667 0Z" stroke="currentColor" strokeWidth="1.5" /></svg>
                            </div>
                            <p className="font-semibold text-[#0B1437]">Nenhum trabalho encontrado</p>
                            <p className="text-sm text-[#707EAE] mt-1">{searchInput ? "Tente pesquisar por outro termo." : "Não existem trabalhos disponíveis nesta secção."}</p>
                        </div>
                    ) : (
                        <>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full min-w-[850px] border-collapse">
                                    <thead>
                                        <tr className="bg-[#F8F9FC] border-b border-[#EDEFF6]">
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-[#707EAE]">Tema</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-[#707EAE]">Autor</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-[#707EAE]">Estado</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-[#707EAE]">Especialidade</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-[#707EAE]">Data de criação</th>
                                            <th className="text-right px-4 py-3 text-xs font-semibold text-[#707EAE]">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredWorks.map((item: any) => (
                                            <tr key={item?.id} className="border-b border-[#EDEFF6] last:border-b-0 hover:bg-[#FAFBFD] duration-200">
                                                <td className="px-4 py-4 max-w-[320px]">
                                                    <p className="font-semibold text-[#143163] truncate" title={item?.titulo}>{item?.titulo ?? "N/A"}</p>
                                                    {item?.resumo && <p className="text-xs text-[#8A94A8] mt-1 line-clamp-1">{item.resumo}</p>}
                                                </td>
                                                <td className="px-4 py-4 text-[#465A9D]">{item?.autor?.nome ?? "N/A"}</td>
                                                <td className="px-4 py-4">{renderStatus(item?.status)}</td>
                                                <td className="px-4 py-4">{renderSpecialties(item)}</td>
                                                <td className="px-4 py-4 text-[#465A9D] whitespace-nowrap">{item?.createdAt ? new Date(item.createdAt).toLocaleDateString("pt-BR") : "N/A"}</td>
                                                <td className="px-4 py-4">{renderActions(item)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="md:hidden p-3 flex flex-col gap-3">
                                {filteredWorks.map((item: any) => (
                                    <div key={item?.id} className="rounded-xl border border-[#D4D9EA] p-4 shadow-sm">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-[#143163] leading-5">{item?.titulo ?? "N/A"}</h3>
                                                <p className="text-xs text-[#707EAE] mt-1">{item?.autor?.nome ?? "Autor não informado"}</p>
                                            </div>
                                            {renderStatus(item?.status)}
                                        </div>
                                        {item?.resumo && <p className="text-xs text-[#707EAE] mt-3 line-clamp-2">{item.resumo}</p>}
                                        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <p className="text-[#A3AED0] mb-1">Especialidade</p>
                                                {renderSpecialties(item)}
                                            </div>
                                            <div>
                                                <p className="text-[#A3AED0] mb-1">Data</p>
                                                <p className="text-[#465A9D]">{item?.createdAt ? new Date(item.createdAt).toLocaleDateString("pt-BR") : "N/A"}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-[#A3AED0] mb-1">Departamento</p>
                                                <p className="text-[#465A9D]">{item?.departamento?.nome ?? "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-[#EDEFF6]">{renderActions(item)}</div>
                                    </div>
                                ))}
                            </div>

                            {renderPagination()}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}