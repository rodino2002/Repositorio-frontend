import { toast } from "sonner";

export async function downloadFunction(item: any) {
        if (!item?.fileUrl) return;

        try {

            const fileUrl = item?.fileUrl;

            const rawName = fileUrl?.split("/").pop();

            const cleanName = rawName?.replace(/^\d+-/, "") || "Trabalho.pdf";

            const response = await fetch(item.fileUrl);

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = cleanName;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erro ao baixar arquivo:", error);
            toast.error("Erro ao baixar arquivo. Por favor, tente novamente.");
        }
    }