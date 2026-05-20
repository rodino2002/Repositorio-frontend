import { useQuery } from "@tanstack/react-query";
import { api } from "../config/api";
import { capitalize } from "../helpers/capitalize";
import { downloadFunction } from "../utils/downloadTCC";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useDepartaments } from "../hooks/useDepartaments";
import { useEspecialities } from "../hooks/useEspecialities";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import Carrossel from "../busca-semantica/carrosssel";
import { useTipoTrabalhos } from "../hooks/useTipoTrabalho";

// 1. Captura o ano atual dinamicamente (ex: 2026)
const anoAtual = new Date().getFullYear();

// 2. Cria um array com os últimos 5 anos: [2026, 2025, 2024, 2023, 2022]
const listaAnos = Array.from({ length: 3 }, (_, index) => String(anoAtual - index));

function formatarInicioAno(ano?: string | null) {
    if (!ano) return "";
    return `${ano}-01-01`;
}

function formatarFimAno(ano?: string | null) {
    if (!ano) return "";
    return `${ano}-12-31`;
}
export default function SemanticTCCSearchLanding() {

    const [previewOpen, setPreviewOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState("")
    const [departamentoId, setDepartamentoId] = useState("")
    const [especialidadeId, setEspecialidadeId] = useState("")
    const [tipoTrabalhoId, setTipoTrabalhoId] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [periodoEspecifico, setPeriodoEspecifico] = useState<{ inicio: string; fim: string } | null>(null);
    const [isEspeficoPeriodo, setIsEspecificoPeriodo] = useState(false)
    const [isFiltered, setIsFiltered] = useState(false)

    type Filters = {
        departamentoId: string;
        especialidadeId: string;
        searchTerm: string;
        tipoTrabalhoId: string;
        ano: string;
        periodoEspecifico: { inicio: string; fim: string } | null;
    }

    const [filters, setFilters] = useState<Filters>({
        departamentoId: "",
        especialidadeId: "",
        searchTerm: "",
        tipoTrabalhoId: "",
        ano: String(anoAtual),
        periodoEspecifico: null,
    })

    const departaments = useDepartaments()
    const especialities = useEspecialities()
    const tipoTrabalhos = useTipoTrabalhos()

    const especialitiesFiltered = especialities?.filter((item: any) => item?.departamento?.id === Number(departamentoId))

    function normalizeWorksResponse(data: any) {
        const isSemantic = Array.isArray(data?.resultados)

        const items = isSemantic ? data.resultados : data.dados

        return {
            total: isSemantic ? data.totalEncontrados : data.paginacao?.totalItems,
            items: items.map((item: any) => ({
                id: item.id,
                titulo: item.titulo,
                resumo: item.resumo,
                fileUrl: item.fileUrl,
                status: item.status,
                createdAt: item.createdAt,
                autor: item.autor,
                departamento: item.departamento,
                especialidades: item.especialidades,
                tipoTrabalho: item.tipoTrabalho,

                // unifica ranking da busca semântica
                score: item.score ?? item.similarity ?? null,
            })),

        }
    }

    async function getWorks() {
        try {
            if (filters.searchTerm.trim()) {
                const { data } = await api.post(
                    "trabalhos/buscar-inteligente",
                    { query: filters.searchTerm }
                )

                return normalizeWorksResponse(data)
            }

            // Definindo os filtros de ano baseados na lógica do seu formulário
            const anoInicio = isEspeficoPeriodo
                ? filters.periodoEspecifico?.inicio
                : formatarInicioAno(filters.ano)

            const anoFim = isEspeficoPeriodo
                ? filters.periodoEspecifico?.fim || ""
                : "";

            const url = `trabalhos?status=APROVADO&departamentoId=${filters.departamentoId === "todos" ? "" : filters.departamentoId || ""
                }&especialidadeId=${filters.especialidadeId === "todas" ? "" : filters.especialidadeId || ""
                }&tipoTrabalhoId=${filters.tipoTrabalhoId === "todos" ? "" : filters.tipoTrabalhoId || ""
                }&start_date=${anoInicio || ""}&end_date=${anoFim || ""}`;

            const { data } = await api.get(url)

            return normalizeWorksResponse(data)
        } catch (error) {
            console.error(error)
        }
    }

    const { data, isLoading, isRefetching } = useQuery({
        queryKey: [
            "trabalhosSemanticaList",
            filters,
        ],
        queryFn: getWorks,
    })



    const handleFilter = (newYear?: string) => {
        const year = newYear || ""
        setFilters({
            departamentoId,
            especialidadeId,
            searchTerm,
            tipoTrabalhoId,
            ano: year,
            periodoEspecifico: periodoEspecifico
                ? {
                    inicio: formatarInicioAno(periodoEspecifico.inicio),
                    fim: formatarFimAno(periodoEspecifico.fim)
                }
                : null,
        })
    }

    const handlePreview = (fileUrl: string) => {
        setSelectedFile(fileUrl)
        setPreviewOpen(true)
    }

    const limparFiltros = () => {
        setDepartamentoId("")
        setEspecialidadeId("")
        setTipoTrabalhoId("")
        setSearchTerm("")
        setPeriodoEspecifico(null)
        setIsEspecificoPeriodo(false)
        setFilters({
            ...filters,
            departamentoId: "",
            especialidadeId: "",
            searchTerm: "",
            tipoTrabalhoId: "",
            ano: String(anoAtual),
            periodoEspecifico: null,
        })
    }

    useEffect(() => {
        if (filters.searchTerm || filters.departamentoId ||
            filters.especialidadeId || filters.tipoTrabalhoId
            || filters.ano || filters.periodoEspecifico) {
            setIsFiltered(true)
        } else {
            setIsFiltered(false)
        }
    }, [filters])

    useEffect(() => {
        if (periodoEspecifico?.fim || periodoEspecifico?.inicio) {
            setFilters({
                ...filters,
                ano: String(anoAtual),
            })
        } else {
            setFilters({
                ... filters,
            ano: String(anoAtual),
        })
        }
    }, [periodoEspecifico])



    return (
        <>
            {/* HERO CAROUSEL */}
            <Carrossel />
            <div className="relative -mt-20 z-20">
                <div className="min-h-screen bg-linear-to-b from-[#F8FAFF] to-white text-[#0B1437]">
                    {/* HERO */}
                    <section className="relative overflow-hidden bg-[#F8FAFF]">
                        {/* Elementos decorativos (Mantidos) */}
                        <div className="absolute top-0 left-0 w-72 h-72 bg-[#FFC505]/20 blur-3xl rounded-full" />
                        <div className="absolute right-0 top-20 w-80 h-80 bg-[#141B59]/10 blur-3xl rounded-full" />

                        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 relative z-10">
                            <div className="grid lg:grid-cols-2 gap-14 items-center">

                                {/* Coluna de Texto */}
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-[#FFF8E2] border border-[#FFE082] text-[#B7791F] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                                        Plataforma Inteligente de TCCs
                                    </div>

                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-[#0B1437]">
                                        Pesquisa Semântica de <br />
                                        <span className="text-[#FC9500]">Trabalhos Científicos</span>
                                    </h1>

                                    <p className="mt-6 text-zinc-600 text-lg leading-relaxed max-w-xl">
                                        Encontre TCCs relacionados ao tema que procura usando inteligência semântica.
                                        Pesquise por contexto, assunto ou significado — não apenas palavras-chave.
                                    </p>

                                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                        <button className="bg-[#141B59] hover:bg-[#1e2775] transition-all duration-300 rounded-2xl px-8 py-4 text-white font-bold shadow-lg shadow-[#141B59]/20">
                                            Explorar Trabalhos
                                        </button>
                                        <button className="border border-zinc-300 hover:bg-white transition-all duration-300 rounded-2xl px-8 py-4 font-bold text-[#0B1437]">
                                            Ver Demonstração
                                        </button>
                                    </div>
                                </div>

                                {/* CARD VISUAL (Refinado) */}
                                <div className="relative">
                                    <div className="bg-white border border-zinc-100 rounded-[32px] shadow-xl p-8 backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <p className="font-black text-xl text-[#0B1437]">Busca Inteligente</p>
                                                <p className="text-zinc-500 text-sm font-medium mt-1">Resultados semanticamente relevantes</p>
                                            </div>
                                            <div className="w-14 h-14 rounded-2xl bg-[#FFF8E2] flex items-center justify-center shrink-0">
                                                {/* Ícone mantido */}
                                                <svg className="text-[#FC9500]" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                            </div>
                                        </div>

                                        <div className="bg-[#F8FAFF] rounded-2xl p-5 border border-[#EDF1FD]">
                                            <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Pesquisando por:</p>
                                            <p className="font-semibold text-[#141B59] text-base md:text-lg">
                                                “sistemas inteligentes aplicados à educação”
                                            </p>
                                        </div>

                                        <div className="mt-6 space-y-3">
                                            {[1, 2, 3].map((item) => (
                                                <div key={item} className="flex items-center gap-4 bg-white border border-zinc-100 rounded-2xl p-4 hover:border-[#141B59]/20 transition-all">
                                                    <div className="w-10 h-10 rounded-xl bg-[#F0F4FF] flex items-center justify-center shrink-0">
                                                        <span className="text-[#141B59] font-black text-sm">0{item}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-[#0B1437] text-sm">Trabalho relacionado encontrado</p>
                                                        <p className="text-xs text-zinc-400 font-medium">Similaridade semântica: 92%</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* FILTROS */}
                    <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-10">
                        <div className="bg-white border border-zinc-100 rounded-[32px] shadow-sm p-8">
                            <div className="flex items-start gap-3">
                                <div className="space-y-2 w-[15%]">
                                    <p className="text-xs uppercase tracking-widest text-zinc-600 font-bold w-full"> Ano de publicação</p>
                                    <div className="flex flex-col space-y-2">
                                        {listaAnos?.map((item: string) => (
                                            <button
                                                key={item
                                                }
                                                onClick={() => { handleFilter(item); }}
                                                className={`h-10 cursor-pointer rounded border ${item === String(filters?.ano) ? "bg-[#141B59] text-white border-[#141B59] hover:text-[#141B59]" :
                                                    "bg-white text-[#0B1437] border-zinc-200"} text-sm font-medium hover:bg-[#F0F4FF] transition-all`}

                                            >Desde {item}</button>

                                        ))}
                                        <button
                                            className="text-sm text-[#7e1802] hover:text-[#141B59] 
                                         cursor-pointer hover:underline"
                                            onClick={() => setIsEspecificoPeriodo(!isEspeficoPeriodo)}>
                                            Período específico
                                        </button>
                                        {isEspeficoPeriodo && (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    title="Ano inicial"
                                                    className="w-full h-10 rounded border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-[#FFC505]/50 transition-all"
                                                    value={periodoEspecifico?.inicio ?? ""}
                                                    onChange={(e) => setPeriodoEspecifico((prev) => ({ ...(prev ?? { inicio: "", fim: "" }), inicio: e.target.value }))}
                                                />
                                                <span className="text-zinc-400">-</span>
                                                <input
                                                    type="text"
                                                    title="Ano final"
                                                    className="w-full h-10 rounded border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-[#FFC505]/50 transition-all"
                                                    value={periodoEspecifico?.fim ?? ""}
                                                    onChange={(e) => setPeriodoEspecifico((prev) => ({ ...(prev ?? { inicio: "", fim: "" }), fim: e.target.value }))}
                                                />
                                            </div>)}
                                    </div>
                                </div>
                                <div className=" w-full">
                                    {/* Campo de Busca Principal (Destaque) */}
                                    <div className="relative">
                                        <input
                                            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Pesquise por tema, resumo, contexto ou significado..."
                                            className="w-full h-16 rounded border border-zinc-200 bg-white 
                                            px-6 pr-14 text-base outline-none focus:ring-1 focus:ring-[#0B1437] transition-all"
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                        </div>
                                    </div>


                                    {/* Filtros Secundários em Grid */}
                                    <div className="grid md:grid-cols-4 gap-4 mt-4">

                                        {/* Selects restantes */}
                                        <Select value={departamentoId} onValueChange={(v) => setDepartamentoId(v === "todos" ? "" : v)}>
                                            <SelectTrigger className="h-14 rounded border border-zinc-200 px-4 text-[#0B1437] font-medium">
                                                <SelectValue placeholder="Departamento" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded">
                                                <SelectItem value="todos">Todos os departamentos</SelectItem>
                                                {departaments?.map((item: any) => <SelectItem key={item?.id} value={String(item?.id)}>{item?.nome}</SelectItem>)}
                                            </SelectContent>
                                        </Select>

                                        <Select value={especialidadeId} onValueChange={(v) => setEspecialidadeId(v === "todas" ? "" : v)}>
                                            <SelectTrigger className="h-14 rounded border border-zinc-200 px-4 text-[#0B1437] font-medium">
                                                <SelectValue placeholder="Especialidade" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded">
                                                <SelectItem value="todas">Todas as especialidades</SelectItem>
                                                {especialitiesFiltered?.map((item: any) => <SelectItem key={item?.id} value={String(item?.id)}>{item?.nome}</SelectItem>)}
                                            </SelectContent>
                                        </Select>

                                        <Select value={tipoTrabalhoId} onValueChange={(v) => setTipoTrabalhoId(v === "todos" ? "" : v)}>
                                            <SelectTrigger className="h-14 rounded border border-zinc-200 px-4 text-[#0B1437] font-medium">
                                                <SelectValue placeholder="Tipo de trabalho" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded">
                                                <SelectItem value="todos">Qualquer tipo</SelectItem>
                                                {tipoTrabalhos?.map((item: any) => <SelectItem key={item?.id} value={String(item?.id)}>{item?.nome}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>


                                    {/* Botão de Pesquisa */}
                                    <button
                                        type="button"
                                        onClick={() => handleFilter()}
                                        className="mt-10 h-14 w-full rounded bg-[#141B59] hover:bg-[#0B1437] transition-all text-white text-lg cursor-pointer font-bold shadow-lg shadow-[#141B59]/20"
                                    >
                                        Buscar
                                    </button>
                                    {/* Botão de Limpar */}
                                    {isFiltered && <button
                                        type="button"
                                        onClick={
                                            limparFiltros
                                        }
                                        className="mt-4 w-full h-14 px-6 rounded bg-zinc-100 hover:bg-zinc-200
                                         text-zinc-600 hover:text-red-600 transition-all 
                                         flex justify-center items-center gap-2.5 font-semibold cursor-pointer border border-zinc-200"
                                        title="Limpar todos os filtros"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                            <line x1="10" x2="10" y1="11" y2="17" />
                                            <line x1="14" x2="14" y1="11" y2="17" />
                                        </svg>
                                        Limpar Filtros
                                    </button>}
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* RESULTADOS */}
                    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-black">
                                    Trabalhos Publicados
                                </h2>
                                <p className="text-zinc-500 mt-2">
                                    Resultados encontrados semanticamente.
                                </p>
                            </div>

                            <div className="hidden md:flex items-center gap-2 bg-[#F4F7FE] border border-[#D4D9EA] rounded-full px-4 py-2 text-sm font-semibold text-[#141B59]">
                                {data?.total || 0} Trabalhos Publicados
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
                            {data?.items?.length > 0 ? (
                                data?.items?.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="
                                            group
                                            relative
                                            bg-white
                                            border border-zinc-200/80
                                            rounded-[30px]
                                            overflow-hidden
                                            transition-all duration-500
                                            hover:-translate-y-2
                                            hover:shadow-[0_20px_60px_rgba(20,27,89,0.18)]
                                            "
                                    >
                                        {/* Glow */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
                                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full" />
                                        </div>

                                        {/* HEADER */}
                                        <div className="relative overflow-hidden bg-gradient-to-br from-[#141B59] via-[#1C2675] to-[#243B83] p-6">
                                            {/* Shine */}
                                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition duration-500" />

                                            {/* Blur Effect */}
                                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

                                            <div className="relative z-10 flex items-start justify-between gap-4">
                                                <div className="space-y-3">
                                                    <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-300 font-medium">
                                                        {item.departamento?.nome || "Departamento"}
                                                    </p>

                                                    <h3 className="font-bold text-[26px] leading-tight text-white line-clamp-2">
                                                        {item.titulo}
                                                    </h3>
                                                </div>

                                                {/* Similaridade */}
                                                {item.score && <div
                                                    className="
                                                    min-w-[70px]
                                                    h-[36px]
                                                    px-4
                                                    rounded-full
                                                    bg-emerald-400/10
                                                    border border-emerald-300/20
                                                    backdrop-blur-md
                                                    flex items-center justify-center
                                                    text-emerald-100
                                                    text-sm
                                                    font-bold
                                                    shadow-lg
                                                "
                                                >
                                                    {(item.score * 100)?.toFixed(0)}%
                                                </div>}
                                            </div>
                                        </div>
                                        <p className="p-2 w-full flex justify-center text-sm ">{item.tipoTrabalho?.nome || "Tipo de Trabalho"}</p>
                                        {/* CONTENT */}
                                        <div className="p-6 space-y-5">
                                            {/* Autor + Ano */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-zinc-400 text-sm">Autor</p>

                                                    <p className="font-semibold text-[#0B1437] text-lg">
                                                        {item.autor?.nome || "N/A"}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-zinc-400 text-sm">Ano</p>

                                                    <p className="font-bold text-[#0B1437] text-lg">
                                                        {item.createdAt
                                                            ? new Date(item.createdAt).getFullYear()
                                                            : "N/A"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* TAGS */}
                                            <div className="flex flex-wrap gap-3">
                                                <span
                                                    className="
                                                    bg-[#FFF8E2]
                                                    text-[#B7791F]
                                                    border border-[#FFE082]
                                                    px-4 py-1.5
                                                    rounded-full
                                                    text-xs
                                                    font-semibold
                                                "
                                                >
                                                    {item?.especialidades?.[0]?.nome || "N/A"}
                                                </span>

                                                <span
                                                    className={`
                                                            px-4 py-1.5
                                                            rounded-full
                                                            text-xs
                                                            font-semibold
                                                            border
                                                            ${item?.status === "APROVADO"
                                                            ? "bg-green-100 text-green-700 border-green-200"
                                                            : item?.status === "RECUSADO"
                                                                ? "bg-red-100 text-red-700 border-red-200"
                                                                : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                                        }
              `}
                                                >
                                                    {capitalize(item?.status || "N/A")}
                                                </span>
                                            </div>

                                            {/* RESUMO */}
                                            <p className="text-zinc-600 leading-8 text-[15px] line-clamp-4 min-h-[110px]">
                                                {item.resumo || "Resumo não disponível."}
                                            </p>

                                            {/* FOOTER */}
                                            <div className="flex gap-4 pt-3">
                                                {/* PREVIEW */}
                                                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                                                    <DialogOverlay className="bg-transparent " />
                                                    <DialogTrigger asChild>

                                                        <button
                                                            onClick={() => handlePreview(item.fileUrl)}
                                                            className="
                                                    flex-1
                                                    h-14
                                                    rounded-2xl
                                                    bg-[#141B59]
                                                    hover:bg-[#1C2675]
                                                    text-white
                                                    font-semibold
                                                    flex items-center justify-center gap-3
                                                    transition-all duration-300
                                                    hover:scale-[1.02]
                                                    shadow-lg shadow-[#141B59]/20
                                                "
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="19"
                                                                height="19"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                                                                <circle cx="12" cy="12" r="3" />
                                                            </svg>

                                                            <span>Preview</span>
                                                        </button>
                                                    </DialogTrigger>
                                                    <DialogContent className="
                                                                        max-w-6xl 
                                                                        
                                                                        p-0 
                                                                        overflow-hidden
                                                                        border-none
                                                                        bg-white
                                                                        rounded-3xl
                                                                        shadow-2xl
                                                                        ">
                                                        {/* Cabeçalho do Modal */}
                                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 h-12 ">
                                                            <h2 className="text-xl font-semibold text-gray-800">
                                                                Visualizar Trabalho
                                                            </h2>

                                                        </div>

                                                        <div className="w-full h-[80vh]  bg-white">
                                                            <iframe
                                                                src={selectedFile || ""}
                                                                className="w-full h-full bg-white"
                                                            />
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                {/* DOWNLOAD */}
                                                <button
                                                    onClick={() => downloadFunction(item)}
                                                    className="
                                                        flex-1
                                                        h-14
                                                        rounded-2xl
                                                        bg-[#FC9500]
                                                        hover:bg-[#E88900]
                                                        text-white
                                                        font-semibold
                                                        flex items-center justify-center gap-3
                                                        transition-all duration-300
                                                        hover:scale-[1.02]
                                                        shadow-lg shadow-[#FC9500]/30
                                                    "
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="19"
                                                        height="19"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M12 15V3" />
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                        <path d="m7 10 5 5 5-5" />
                                                    </svg>

                                                    <span>Download</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="38"
                                            height="38"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#94A3B8"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="11" cy="11" r="8" />
                                            <path d="m21 21-4.3-4.3" />
                                        </svg>
                                    </div>

                                    <h3 className="text-2xl font-bold text-[#0B1437]">
                                        Nenhum resultado encontrado
                                    </h3>

                                    <p className="text-zinc-500 mt-2 max-w-md leading-relaxed">
                                        Tente ajustar os filtros ou utilizar palavras-chave diferentes na
                                        pesquisa semântica.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="pb-20 px-6 lg:px-10">
                        <div className="max-w-7xl mx-auto bg-linear-to-r from-[#141B59] to-[#243B83] rounded-[40px] overflow-hidden relative p-10 lg:p-16 text-white">
                            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 blur-3xl rounded-full" />

                            <div className="relative z-10 max-w-3xl">
                                <p className="uppercase tracking-[0.3em] text-sm text-zinc-300 mb-4">
                                    Busca Inteligente
                                </p>

                                <h2 className="text-4xl md:text-5xl font-black leading-tight">
                                    Descubra conhecimento relevante com IA semântica.
                                </h2>

                                <p className="mt-6 text-zinc-200 text-lg leading-relaxed">
                                    Explore trabalhos científicos de forma moderna, rápida e inteligente.
                                    Encontre exactamente o que procura com resultados contextualmente relevantes.
                                </p>

                                <button className="mt-8 bg-[#FC9500] hover:opacity-90 transition px-8 py-4 rounded-2xl font-semibold shadow-xl shadow-[#FC9500]/30">
                                    Começar Pesquisa
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}
