
import { useState } from "react";
import { capitalize } from "../helpers/capitalize";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { downloadFunction } from "../utils/downloadTCC";
import { toast } from "sonner";

type DetalhesTrabalhoProps = {
    trabalho: any;
    onVoltar: () => void;
};

export default function DetalhesTrabalho({
    trabalho,
    onVoltar,
}: DetalhesTrabalhoProps) {

    
    const [previewOpen, setPreviewOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState("")
    
    const handlePreview = (fileUrl: string) => {
        if(!fileUrl) return toast.warning("Nenhum ficheiro encontrado!");
        console.log(fileUrl)
        setSelectedFile(fileUrl)
        setPreviewOpen(true)
    }

    
    if (!trabalho) return null;

    return (
        <section className="max-w-5xl mx-auto">

            {/* VOLTAR */}
            <button
                onClick={onVoltar}
                className="
                    mb-8
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-[#141B59]
                    hover:text-[#1B4F9C]
                    transition-colors
                "
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m15 18-6-6 6-6" />
                </svg>

                Voltar aos resultados
            </button>


            {/* CABEÇALHO */}
            <div className="border-b border-zinc-200 pb-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div className="min-w-0">

                        <span className="
                            inline-flex
                            items-center
                            rounded-full
                            bg-[#141B59]/5
                            px-2.5
                            py-1
                            text-[11px]
                            font-medium
                            text-[#141B59]
                            mb-3
                        ">
                            {trabalho.tipoTrabalho?.nome || "Trabalho académico"}
                        </span>

                        <h1 className="
                            text-2xl
                            sm:text-3xl
                            font-bold
                            leading-tight
                            text-[#141B59]
                        ">
                            {trabalho.titulo}
                        </h1>

                    </div>


                    {/* SCORE */}
                    {trabalho.score !== undefined &&
                        trabalho.score !== null && (

                            <div className="
                                shrink-0
                                rounded-xl
                                bg-zinc-50
                                px-4
                                py-3
                                text-center
                            ">

                                <p className="text-xs text-zinc-500">
                                    Relevância
                                </p>

                                <p className="
                                    mt-1
                                    text-xl
                                    font-bold
                                    text-[#141B59]
                                ">
                                    {(trabalho.score * 100).toFixed(0)}%
                                </p>

                            </div>

                        )}

                </div>


                {/* AUTOR / ANO */}
                <div className="
                    mt-5
                    flex
                    flex-wrap
                    items-center
                    gap-x-2
                    gap-y-1
                    text-sm
                    text-zinc-500
                ">

                    <span className="font-medium text-zinc-700">
                        {trabalho.autor?.nome || "Autor não informado"}
                    </span>

                    <span className="text-zinc-300">•</span>

                    <span>
                        {trabalho.createdAt
                            ? new Date(trabalho.createdAt).getFullYear()
                            : "Ano não informado"}
                    </span>

                    <span className="text-zinc-300">•</span>

                    <span
                        className={`
                            font-medium
                            ${trabalho.status === "APROVADO"
                                ? "text-green-600"
                                : trabalho.status === "RECUSADO"
                                    ? "text-red-600"
                                    : "text-yellow-600"
                            }
                        `}
                    >
                        {capitalize(trabalho.status || "N/A")}
                    </span>

                </div>

            </div>


            {/* METADADOS */}
            <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-6
                py-7
                border-b
                border-zinc-200
            ">

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                        Departamento
                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-700">
                        {trabalho.departamento?.nome || "Não informado"}
                    </p>
                </div>


                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                        Tipo de trabalho
                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-700">
                        {trabalho.tipoTrabalho?.nome || "Não informado"}
                    </p>
                </div>


                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                        Especialidades
                    </p>

                    <div className="mt-1 flex flex-wrap gap-1.5">

                        {trabalho.especialidades?.length > 0 ? (
                            trabalho.especialidades.map((especialidade: any) => (
                                <span
                                    key={especialidade.id}
                                    className="
                                        text-sm
                                        font-medium
                                        text-[#B7791F]
                                    "
                                >
                                    {especialidade.nome}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-zinc-500">
                                Não informado
                            </span>
                        )}

                    </div>

                </div>

            </div>


            {/* RESUMO */}
            <div className="py-8">

                <h2 className="
                    text-lg
                    font-semibold
                    text-[#141B59]
                ">
                    Resumo
                </h2>

                <p className="
                    mt-4
                    max-w-4xl
                    text-sm
                    leading-7
                    text-zinc-600
                    whitespace-pre-line
                ">
                    {trabalho.resumo || "Resumo não disponível."}
                </p>

            </div>


            {/* AÇÕES */}
            <div className="
                flex
                flex-wrap
                items-center
                gap-3
                pt-2
            ">

                {/* PREVIEW */}
                <Dialog
                    open={previewOpen}
                    onOpenChange={setPreviewOpen}
                >

                    <DialogTrigger asChild>

                        <button
                            onClick={() =>
                                handlePreview(trabalho.fileUrl)
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
                                <circle cx="12" cy="12" r="3" />
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

                        {/* MANTÉM AQUI O TEU CONTEÚDO ATUAL DO DIALOG */}

                        <iframe
                            src={selectedFile || ""}
                            className="w-full h-[80vh]"
                            title="Visualização do trabalho"
                        />

                    </DialogContent>

                </Dialog>


                {/* DOWNLOAD */}
                <button
                    onClick={() => downloadFunction(trabalho)}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-[#FC9500]
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-[#FC9500]
                        transition-colors
                        hover:bg-[#FC9500]/5
                    "
                >

                    <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 3v12" />
                        <path d="m7 10 5 5 5-5" />
                        <path d="M5 21h14" />
                    </svg>

                    Download

                </button>

            </div>

        </section>
    );
}

