import { useEffect, useState } from "react";
import { useDetails } from "../hooks/useDetails";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, User, CreditCard, Building2, ShieldCheck } from "lucide-react";
import api from "../service/refresh";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function MeuPerfil() {
    const { data: details, isLoading } = useDetails();

    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        bi_number: "",
    });

    useEffect(() => {
        if (details) {
            setFormData({
                nome: details.nome ?? "",
                email: details.email ?? "",
                bi_number: details.bi_number ?? "",
            });
        }
    }, [details]);

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!details) return;

        setFormData({
            nome: details.nome ?? "",
            email: details.email ?? "",
            bi_number: details.bi_number ?? "",
        });
    }, [details]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSaving(true);

            await api.patch("usuarios/profile", formData);

            toast.success("Perfil atualizado com sucesso!");

            queryClient.invalidateQueries({ queryKey: ["detailsUser"] });

            setIsEditing(false);
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full">
                {/* Breadcrumb */}
                <div className="bg-white rounded-lg h-fit text-sm flex flex-col p-4 sm:p-5 mt-5">
                    <div className="flex items-center gap-1">
                        <p className="text-[#0B1437] font-bold text-sm sm:text-[16px]">
                            Dashboard
                        </p>

                        <p className="text-[#707EAE] text-sm sm:text-[16px]">
                            /
                        </p>

                        <p className="text-[#707EAE] text-sm sm:text-[16px]">
                            Meu perfil
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg mt-4 min-h-[400px] flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#0B1437]" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full pb-6">

            {/* Breadcrumb */}
            <div className="bg-white rounded-lg h-fit text-sm flex flex-col p-4 sm:p-5 mt-5">
                <div className="flex items-center gap-1">
                    <p className="text-[#0B1437] font-bold text-sm sm:text-[16px]">
                        Dashboard
                    </p>

                    <p className="text-[#707EAE] text-sm sm:text-[16px]">
                        /
                    </p>

                    <p className="text-[#707EAE] text-sm sm:text-[16px]">
                        Meu perfil
                    </p>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="bg-white rounded-lg mt-4 p-4 sm:p-5 lg:p-7">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div className="flex items-center gap-3">

                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#F1F4FA] flex items-center justify-center shrink-0">
                            <User className="w-6 h-6 sm:w-7 sm:h-7 text-[#0B1437]" />
                        </div>

                        <div>
                            <h1 className="text-[#0B1437] font-bold text-lg sm:text-xl">
                                Meu perfil
                            </h1>

                            <p className="text-[#707EAE] text-xs sm:text-sm mt-1">
                                Consulte e atualize os seus dados pessoais.
                            </p>
                        </div>

                    </div>

                    {!isEditing && (
                        <Button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="w-full sm:w-auto bg-[#0B1437] hover:bg-[#111D4A]"
                        >
                            Editar perfil
                        </Button>
                    )}

                </div>

                <Separator className="my-6" />

                {/* Informações da conta */}
                <div className="mb-7">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldCheck className="w-4 h-4 text-[#707EAE]" />

                        <h2 className="text-[#0B1437] font-semibold text-sm sm:text-base">
                            Informações da conta
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                        {/* Nome */}
                        <div className="space-y-2">
                            <label htmlFor="nome">
                                Nome completo
                            </label>

                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707EAE]" />

                                <Input
                                    id="nome"
                                    value={formData.nome}
                                    disabled={!isEditing}
                                    onChange={(e) =>
                                        handleChange("nome", e.target.value)
                                    }
                                    className="pl-9"
                                    placeholder="Nome completo"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="email">
                                Email
                            </label>

                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707EAE]" />

                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    disabled={!isEditing}
                                    onChange={(e) =>
                                        handleChange("email", e.target.value)
                                    }
                                    className="pl-9"
                                    placeholder="Email"
                                />
                            </div>
                        </div>

                        {/* BI */}
                        <div className="space-y-2">
                            <label htmlFor="bi_number">
                                Número do BI
                            </label>

                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707EAE]" />

                                <Input
                                    id="bi_number"
                                    value={formData.bi_number}
                                    disabled={!isEditing}
                                    onChange={(e) =>
                                        handleChange(
                                            "bi_number",
                                            e.target.value
                                        )
                                    }
                                    className="pl-9"
                                    placeholder="Número do BI"
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Informações institucionais */}
                <div>

                    <div className="flex items-center gap-2 mb-4">
                        <Building2 className="w-4 h-4 text-[#707EAE]" />

                        <h2 className="text-[#0B1437] font-semibold text-sm sm:text-base">
                            Informações institucionais
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="rounded-lg border border-[#E9EDF7] bg-[#F8F9FC] p-4">
                            <p className="text-xs text-[#707EAE] mb-1">
                                Perfil
                            </p>

                            <p className="text-sm font-medium text-[#0B1437]">
                                {details?.role ?? "—"}
                            </p>
                        </div>

                        <div className="rounded-lg border border-[#E9EDF7] bg-[#F8F9FC] p-4">
                            <p className="text-xs text-[#707EAE] mb-1">
                                Departamento
                            </p>

                            <p className="text-sm font-medium text-[#0B1437]">
                                {details?.departamento?.nome ?? "—"}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Botões */}
                {isEditing && (
                    <>
                        <Separator className="my-6" />

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

                            <Button
                                type="button"
                                variant="outline"
                                disabled={isSaving}
                                onClick={() => {
                                    setFormData({
                                        nome: details?.nome ?? "",
                                        email: details?.email ?? "",
                                        bi_number: details?.bi_number ?? "",
                                    });

                                    setIsEditing(false);
                                }}
                                className="w-full sm:w-auto"
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="button"
                                disabled={isSaving}
                                onClick={handleSubmit}
                                className="w-full sm:w-auto bg-[#0B1437] hover:bg-[#111D4A]"
                            >
                                {isSaving && (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                )}

                                {isSaving
                                    ? "A guardar..."
                                    : "Guardar alterações"}
                            </Button>

                        </div>
                    </>
                )}

            </div>
        </div>
    );
}