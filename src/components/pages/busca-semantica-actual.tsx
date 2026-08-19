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
export default function BuscaSemanticaActual() {

    const [previewOpen, setPreviewOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState("")
    const [departamentoId, setDepartamentoId] = useState("")
    const [especialidadeId, setEspecialidadeId] = useState("")
    const [tipoTrabalhoId, setTipoTrabalhoId] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [periodoEspecifico, setPeriodoEspecifico] = useState<{ inicio: string; fim: string } | null>(null);
    const [isEspeficoPeriodo, setIsEspecificoPeriodo] = useState(false)
    const [isFiltered, setIsFiltered] = useState(false)
    const [showManualFilters, setShowManualFilters] = useState(false);

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
                ...filters,
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

                        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20 relative z-10">
                            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-20 items-center">

                                {/* COLUNA DE TEXTO */}
                                <div>

                                    {/* LABEL */}
                                    <div className="
                inline-flex
                items-center
                gap-2
                text-xs
                uppercase
                tracking-[0.18em]
                text-[#141B59]
                font-semibold
                mb-5
            ">
                                        <span className="w-8 h-px bg-[#FC9500]" />
                                        Repositório Académico
                                    </div>

                                    {/* TÍTULO */}
                                    <h1 className="
                text-4xl
                md:text-5xl
                lg:text-[54px]
                font-bold
                leading-[1.08]
                tracking-tight
                text-[#0B1437]
                max-w-2xl
            ">
                                        Encontre trabalhos científicos
                                        <span className="block text-[#FC9500]">
                                            pelo significado.
                                        </span>
                                    </h1>

                                    {/* DESCRIÇÃO */}
                                    <p className="
                mt-6
                text-zinc-600
                text-base
                md:text-lg
                leading-8
                max-w-xl
            ">
                                        Pesquise TCCs e outros trabalhos académicos por tema,
                                        contexto e significado, além das palavras-chave
                                        utilizadas no documento.
                                    </p>

                                    {/* PEQUENOS DESTAQUES */}
                                    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">

                                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#FC9500]" />
                                            Pesquisa semântica
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#FC9500]" />
                                            Trabalhos académicos
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#FC9500]" />
                                            Pesquisa contextual
                                        </div>

                                    </div>
                                </div>


                                {/* PRÉVIA DO REPOSITÓRIO */}
                                <div className="relative">

                                    {/* detalhe decorativo discreto */}
                                    <div className="
                absolute
                -top-6
                -right-6
                w-24
                h-24
                border-t
                border-r
                border-[#FC9500]/30
            " />

                                    <div className="
                relative
                bg-white
                border
                border-zinc-200
                rounded-xl
                overflow-hidden
            ">

                                        {/* CABEÇALHO DA PRÉVIA */}
                                        <div className="
                    px-6
                    py-5
                    border-b
                    border-zinc-200
                    flex
                    items-center
                    justify-between
                ">
                                            <div>
                                                <p className="
                            text-sm
                            font-semibold
                            text-[#0B1437]
                        ">
                                                    Pesquisa no repositório
                                                </p>

                                                <p className="
                            text-xs
                            text-zinc-500
                            mt-1
                        ">
                                                    Trabalhos relacionados encontrados
                                                </p>
                                            </div>

                                            <div className="
                        w-9
                        h-9
                        rounded-md
                        bg-[#F4F7FE]
                        flex
                        items-center
                        justify-center
                    ">
                                                <svg
                                                    className="text-[#141B59]"
                                                    width="19"
                                                    height="19"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <circle cx="11" cy="11" r="8" />
                                                    <path d="m21 21-4.3-4.3" />
                                                </svg>
                                            </div>
                                        </div>


                                        {/* QUERY */}
                                        <div className="px-6 pt-5">

                                            <p className="
                        text-[11px]
                        uppercase
                        tracking-wider
                        font-semibold
                        text-zinc-400
                        mb-2
                    ">
                                                Pesquisa
                                            </p>

                                            <div className="
                        border
                        border-zinc-200
                        rounded-md
                        px-4
                        py-3
                        text-sm
                        text-[#141B59]
                        bg-zinc-50/50
                    ">
                                                sistemas inteligentes aplicados à educação
                                            </div>

                                        </div>


                                        {/* RESULTADOS */}
                                        <div className="px-6 py-5 space-y-0">

                                            {[
                                                {
                                                    titulo: "Desenvolvimento de sistema web para gestão escolar",
                                                    autor: "João Manuel",
                                                    ano: "2024",
                                                },
                                                {
                                                    titulo: "Aplicação de técnicas de inteligência artificial na educação",
                                                    autor: "Maria José",
                                                    ano: "2023",
                                                },
                                                {
                                                    titulo: "Sistema inteligente para apoio à gestão académica",
                                                    autor: "Carlos António",
                                                    ano: "2022",
                                                },
                                            ].map((item, index) => (

                                                <div
                                                    key={index}
                                                    className="
                                py-4
                                border-b
                                border-zinc-100
                                last:border-b-0
                            "
                                                >

                                                    <div className="flex items-start gap-3">

                                                        <span className="
                                    mt-1
                                    text-xs
                                    font-medium
                                    text-zinc-400
                                    w-5
                                    shrink-0
                                ">
                                                            {String(index + 1).padStart(2, "0")}
                                                        </span>

                                                        <div className="min-w-0">

                                                            <p className="
                                        text-sm
                                        font-semibold
                                        leading-5
                                        text-[#1B4F9C]
                                    ">
                                                                {item.titulo}
                                                            </p>

                                                            <p className="
                                        mt-1
                                        text-xs
                                        text-zinc-500
                                    ">
                                                                {item.autor} · {item.ano}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>

                                            ))}

                                        </div>


                                        {/* RODAPÉ */}
                                        <div className="
                    px-6
                    py-4
                    bg-zinc-50
                    border-t
                    border-zinc-100
                    flex
                    items-center
                    justify-between
                ">
                                            <span className="text-xs text-zinc-500">
                                                Resultados relevantes
                                            </span>

                                            <span className="
                        text-xs
                        font-medium
                        text-[#141B59]
                    ">
                                                Ver resultados →
                                            </span>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>
                    {/* FILTROS */}
                    <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-10">
                        <div className="bg-white border border-zinc-200 rounded-xl">

                            {/* BUSCA SEMÂNTICA */}
                            <div className="p-6">

                                <div className="mb-3">
                                    <h3 className="text-base font-semibold text-[#0B1437]">
                                        Pesquisar no repositório
                                    </h3>

                                    <p className="text-sm text-zinc-500 mt-1">
                                        Pesquise por tema, resumo, contexto ou significado.
                                    </p>
                                </div>

                                <div className="relative">
                                    <input
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && handleFilter()
                                        }
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Digite os termos da sua pesquisa..."
                                        className="
                        w-full
                        h-12
                        rounded-md
                        border
                        border-zinc-300
                        bg-white
                        pl-11
                        pr-4
                        text-sm
                        text-[#0B1437]
                        outline-none
                        transition
                        focus:border-[#141B59]
                        focus:ring-1
                        focus:ring-[#141B59]/20
                    "
                                    />

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
                                        className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-zinc-400
                    "
                                    >
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.3-4.3" />
                                    </svg>
                                </div>

                                {/* BOTÃO FILTROS */}
                                <div className="mt-5 flex items-center justify-between">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowManualFilters(!showManualFilters)
                                        }
                                        className="
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-[#141B59]
                        hover:text-[#0B1437]
                        transition-colors
                        cursor-pointer
                    "
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17"
                                            height="17"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M4 6h16" />
                                            <path d="M7 12h10" />
                                            <path d="M10 18h4" />
                                        </svg>

                                        {showManualFilters
                                            ? "Ocultar filtros"
                                            : "Filtros de pesquisa"}

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="15"
                                            height="15"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className={`
                            transition-transform duration-200
                            ${showManualFilters ? "rotate-180" : ""}
                        `}
                                        >
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </button>

                                    {isFiltered && (
                                        <button
                                            type="button"
                                            onClick={limparFiltros}
                                            className="
                            text-sm
                            text-zinc-500
                            hover:text-red-600
                            transition-colors
                            cursor-pointer
                        "
                                        >
                                            Limpar filtros
                                        </button>
                                    )}

                                </div>
                            </div>


                            {/* FILTROS MANUAIS */}
                            {showManualFilters && (
                                <div className="
                border-t
                border-zinc-200
                p-6
                bg-zinc-50/40
            ">

                                    <div className="mb-5">
                                        <h4 className="text-sm font-semibold text-[#0B1437]">
                                            Filtros
                                        </h4>

                                        <p className="text-xs text-zinc-500 mt-1">
                                            Refine os resultados utilizando critérios específicos.
                                        </p>
                                    </div>

                                    <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-4
                ">

                                        {/* Departamento */}
                                        <div>
                                            <label className="
                            block
                            mb-2
                            text-xs
                            font-medium
                            text-zinc-600
                        ">
                                                Departamento
                                            </label>

                                            <Select
                                                value={departamentoId}
                                                onValueChange={(v) =>
                                                    setDepartamentoId(
                                                        v === "todos" ? "" : v
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    className="
                                    h-11
                                    rounded-md
                                    border-zinc-300
                                    bg-white
                                    px-3
                                    text-sm
                                    text-[#0B1437]
                                "
                                                >
                                                    <SelectValue placeholder="Todos os departamentos" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="todos">
                                                        Todos os departamentos
                                                    </SelectItem>

                                                    {departaments?.map((item: any) => (
                                                        <SelectItem
                                                            key={item?.id}
                                                            value={String(item?.id)}
                                                        >
                                                            {item?.nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>


                                        {/* Especialidade */}
                                        <div>
                                            <label className="
                            block
                            mb-2
                            text-xs
                            font-medium
                            text-zinc-600
                        ">
                                                Especialidade
                                            </label>

                                            <Select
                                                value={especialidadeId}
                                                onValueChange={(v) =>
                                                    setEspecialidadeId(
                                                        v === "todas" ? "" : v
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    className="
                                    h-11
                                    rounded-md
                                    border-zinc-300
                                    bg-white
                                    px-3
                                    text-sm
                                    text-[#0B1437]
                                "
                                                >
                                                    <SelectValue placeholder="Todas as especialidades" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="todas">
                                                        Todas as especialidades
                                                    </SelectItem>

                                                    {especialitiesFiltered?.map((item: any) => (
                                                        <SelectItem
                                                            key={item?.id}
                                                            value={String(item?.id)}
                                                        >
                                                            {item?.nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>


                                        {/* Tipo */}
                                        <div>
                                            <label className="
                            block
                            mb-2
                            text-xs
                            font-medium
                            text-zinc-600
                        ">
                                                Tipo de trabalho
                                            </label>

                                            <Select
                                                value={tipoTrabalhoId}
                                                onValueChange={(v) =>
                                                    setTipoTrabalhoId(
                                                        v === "todos" ? "" : v
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    className="
                                    h-11
                                    rounded-md
                                    border-zinc-300
                                    bg-white
                                    px-3
                                    text-sm
                                    text-[#0B1437]
                                "
                                                >
                                                    <SelectValue placeholder="Qualquer tipo" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="todos">
                                                        Qualquer tipo
                                                    </SelectItem>

                                                    {tipoTrabalhos?.map((item: any) => (
                                                        <SelectItem
                                                            key={item?.id}
                                                            value={String(item?.id)}
                                                        >
                                                            {item?.nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>


                                        {/* Ano */}
                                        <div>
                                            <label className="
                            block
                            mb-2
                            text-xs
                            font-medium
                            text-zinc-600
                        ">
                                                Ano de publicação
                                            </label>

                                            <Select
                                                value={
                                                    filters?.ano
                                                        ? String(filters.ano)
                                                        : "todos"
                                                }
                                                onValueChange={(v) => {
                                                    if (v === "todos") {
                                                        handleFilter("");
                                                    } else {
                                                        handleFilter(v);
                                                    }
                                                }}
                                            >
                                                <SelectTrigger
                                                    className="
                                    h-11
                                    rounded-md
                                    border-zinc-300
                                    bg-white
                                    px-3
                                    text-sm
                                    text-[#0B1437]
                                "
                                                >
                                                    <SelectValue placeholder="Todos os anos" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="todos">
                                                        Todos os anos
                                                    </SelectItem>

                                                    {listaAnos?.map((item: string) => (
                                                        <SelectItem
                                                            key={item}
                                                            value={String(item)}
                                                        >
                                                            Desde {item}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                    </div>


                                    {/* PERÍODO */}
                                    <div className="mt-5 pt-5 border-t border-zinc-200">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsEspecificoPeriodo(
                                                    !isEspeficoPeriodo
                                                )
                                            }
                                            className="
                            text-sm
                            font-medium
                            text-[#141B59]
                            hover:underline
                            cursor-pointer
                        "
                                        >
                                            {isEspeficoPeriodo
                                                ? "Ocultar período específico"
                                                : "Pesquisar por período específico"}
                                        </button>

                                        {isEspeficoPeriodo && (
                                            <div className="
                            flex
                            flex-wrap
                            items-end
                            gap-3
                            mt-4
                        ">

                                                <div>
                                                    <label className="
                                    block
                                    mb-2
                                    text-xs
                                    text-zinc-500
                                ">
                                                        Ano inicial
                                                    </label>

                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        placeholder="Ex.: 2020"
                                                        className="
                                        w-32
                                        h-10
                                        rounded-md
                                        border
                                        border-zinc-300
                                        bg-white
                                        px-3
                                        text-sm
                                        outline-none
                                        focus:border-[#141B59]
                                    "
                                                        value={
                                                            periodoEspecifico?.inicio ?? ""
                                                        }
                                                        onChange={(e) =>
                                                            setPeriodoEspecifico((prev) => ({
                                                                ...(prev ?? {
                                                                    inicio: "",
                                                                    fim: "",
                                                                }),
                                                                inicio: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>

                                                <span className="pb-2 text-zinc-400">
                                                    até
                                                </span>

                                                <div>
                                                    <label className="
                                    block
                                    mb-2
                                    text-xs
                                    text-zinc-500
                                ">
                                                        Ano final
                                                    </label>

                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        placeholder="Ex.: 2024"
                                                        className="
                                        w-32
                                        h-10
                                        rounded-md
                                        border
                                        border-zinc-300
                                        bg-white
                                        px-3
                                        text-sm
                                        outline-none
                                        focus:border-[#141B59]
                                    "
                                                        value={
                                                            periodoEspecifico?.fim ?? ""
                                                        }
                                                        onChange={(e) =>
                                                            setPeriodoEspecifico((prev) => ({
                                                                ...(prev ?? {
                                                                    inicio: "",
                                                                    fim: "",
                                                                }),
                                                                fim: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>


                                    {/* BOTÃO */}
                                    <div className="
                    flex
                    justify-end
                    mt-6
                    pt-5
                    border-t
                    border-zinc-200
                ">
                                        <button
                                            type="button"
                                            onClick={() => handleFilter()}
                                            className="
                            h-11
                            px-7
                            rounded-md
                            bg-[#141B59]
                            hover:bg-[#0B1437]
                            text-white
                            text-sm
                            font-semibold
                            cursor-pointer
                            transition-colors
                        "
                                        >
                                            Pesquisar
                                        </button>
                                    </div>

                                </div>
                            )}

                        </div>
                    </section>
                    {/* RESULTADOS */}
                    <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-10">
                        {data?.items?.length > 0 ? (
                            <div className="border-t border-zinc-200">
                                {data?.items.map((item: any) => (
                                    <article
                                        key={item.id}
                                        className="
                        group
                        relative
                        py-6
                        border-b border-zinc-200
                        transition-colors
                        hover:bg-zinc-50/70
                    "
                                    >
                                        <div className="flex gap-4">
                                            

                                            {/* CONTEÚDO */}
                                            <div className="min-w-0 flex-1">

                                                {/* TÍTULO + SCORE */}
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <h3
                                                            title={item?.titulo}
                                                            className="
                                            text-[17px]
                                            font-semibold
                                            leading-6
                                            text-[#1B4F9C]
                                            hover:text-[#141B59]
                                            hover:underline
                                            cursor-pointer
                                        "
                                                        >
                                                            {item.titulo}
                                                        </h3>

                                                        {/* AUTOR / ANO */}
                                                        <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm">
                                                            <span className="text-zinc-600">
                                                                {item.autor?.nome || "Autor não informado"}
                                                            </span>

                                                            <span className="text-zinc-400">·</span>

                                                            <span className="text-zinc-500">
                                                                {item.createdAt
                                                                    ? new Date(item.createdAt).getFullYear()
                                                                    : "Ano não informado"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* SCORE */}
                                                    {item.score !== undefined && item.score !== null && (
                                                        <span
                                                            title="Grau de similaridade com a pesquisa"
                                                            className="
                                            shrink-0
                                            text-xs
                                            font-medium
                                            text-zinc-500
                                            whitespace-nowrap
                                        "
                                                        >
                                                            Similaridade: {(item.score * 100).toFixed(0)}%
                                                        </span>
                                                    )}
                                                </div>

                                                {/* METADADOS */}
                                                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                                                    <span className="text-zinc-500">
                                                        {item.departamento?.nome || "Departamento"}
                                                    </span>

                                                    <span className="text-zinc-300">•</span>

                                                    <span className="text-zinc-500">
                                                        {item.tipoTrabalho?.nome || "Tipo de trabalho"}
                                                    </span>

                                                    {item?.especialidades?.[0]?.nome && (
                                                        <>
                                                            <span className="text-zinc-300">•</span>

                                                            <span className="text-[#B7791F]">
                                                                {item.especialidades[0].nome}
                                                            </span>
                                                        </>
                                                    )}

                                                    <span className="text-zinc-300">•</span>

                                                    <span
                                                        className={`
                                        font-medium
                                        ${item?.status === "APROVADO"
                                                                ? "text-green-600"
                                                                : item?.status === "RECUSADO"
                                                                    ? "text-red-600"
                                                                    : "text-yellow-600"
                                                            }
                                    `}
                                                    >
                                                        {capitalize(item?.status || "N/A")}
                                                    </span>
                                                </div>

                                                {/* RESUMO */}
                                                <p
                                                    className="
                                    mt-3
                                    max-w-5xl
                                    text-sm
                                    leading-6
                                    text-zinc-600
                                    line-clamp-3
                                "
                                                >
                                                    {item.resumo || "Resumo não disponível."}
                                                </p>

                                                {/* AÇÕES */}
                                                <div className="mt-4 flex items-center gap-4">

                                                    {/* PREVIEW */}
                                                    <Dialog
                                                        open={previewOpen}
                                                        onOpenChange={setPreviewOpen}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <button
                                                                onClick={() =>
                                                                    handlePreview(item.fileUrl)
                                                                }
                                                                className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                text-sm
                                                font-medium
                                                text-[#141B59]
                                                hover:text-[#1C2675]
                                                hover:underline
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
                                                                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                                                                    <circle
                                                                        cx="12"
                                                                        cy="12"
                                                                        r="3"
                                                                    />
                                                                </svg>

                                                                Visualizar
                                                            </button>
                                                        </DialogTrigger>

                                                        <DialogContent
                                                            className="
                                            max-w-6xl
                                            p-0
                                            overflow-hidden
                                            border-none
                                            bg-white
                                            rounded-2xl
                                            shadow-2xl
                                        "
                                                        >
                                                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                                                <h2 className="text-lg font-semibold text-gray-800">
                                                                    Visualizar Trabalho
                                                                </h2>
                                                            </div>

                                                            <div className="w-full h-[80vh] bg-white">
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
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        text-sm
                                        font-medium
                                        text-[#FC9500]
                                        hover:text-[#E88900]
                                        hover:underline
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
                                                            <path d="M12 15V3" />
                                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                            <path d="m7 10 5 5 5-5" />
                                                        </svg>

                                                        Download
                                                    </button>

                                                    {/* TAG */}
                                                    <button
                                                        className="
                                        text-sm
                                        text-zinc-400
                                        hover:text-[#141B59]
                                    "
                                                    >
                                                        + Adicionar tags
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-5">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="34"
                                        height="34"
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

                                <h3 className="text-xl font-bold text-[#0B1437]">
                                    Nenhum resultado encontrado
                                </h3>

                                <p className="text-zinc-500 mt-2 max-w-md leading-relaxed">
                                    Tente ajustar os filtros ou utilizar palavras-chave
                                    diferentes na pesquisa semântica.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <section className="pb-20 px-6 lg:px-10 mt-10">
                        <div className="
        max-w-7xl
        mx-auto
        border
        border-zinc-200
        bg-[#F8FAFF]
        rounded-xl
        overflow-hidden
        relative
    ">

                            <div className="
            px-8
            py-10
            lg:px-14
            lg:py-12
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-8
        ">

                                {/* TEXTO */}
                                <div className="max-w-2xl">

                                    <div className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    uppercase
                    tracking-[0.18em]
                    text-[#141B59]
                    font-semibold
                    mb-3
                ">
                                        <span className="w-6 h-px bg-[#FC9500]" />
                                        Encontre mais
                                    </div>

                                    <h2 className="
                    text-2xl
                    md:text-3xl
                    font-bold
                    leading-tight
                    text-[#0B1437]
                ">
                                        Explore o conhecimento produzido no ISPB
                                    </h2>

                                    <p className="
                    mt-3
                    text-zinc-600
                    text-sm
                    md:text-base
                    leading-7
                    max-w-xl
                ">
                                        Consulte trabalhos académicos, descubra pesquisas
                                        relacionadas e encontre novos conteúdos através
                                        da pesquisa semântica.
                                    </p>

                                </div>


                                {/* AÇÃO */}
                                <div className="shrink-0">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            window.scrollTo({
                                                top: 0,
                                                behavior: "smooth",
                                            });
                                        }}
                                        className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        h-11
                        px-6
                        rounded-md
                        bg-[#141B59]
                        hover:bg-[#0B1437]
                        text-white
                        text-sm
                        font-semibold
                        transition-colors
                        cursor-pointer
                    "
                                    >
                                        Explorar trabalhos

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17"
                                            height="17"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M5 12h14" />
                                            <path d="m12 5 7 7-7 7" />
                                        </svg>
                                    </button>

                                </div>

                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}
