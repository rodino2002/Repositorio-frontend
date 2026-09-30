import { useQuery } from "@tanstack/react-query";
import { api } from "../config/api";

export function useEspecialities() {

    const getEspecialidades = async () => {

        try {
            const response = await api.get("especialidades")
            return response.data.dados ?? []

        } catch (error) {
            console.log(error)
        }
    }

    const { data } = useQuery({
        queryKey: ["especialidadesLista"],
        queryFn: getEspecialidades
    })

    return data;
}