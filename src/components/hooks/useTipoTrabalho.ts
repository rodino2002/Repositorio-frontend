import { useQuery } from "@tanstack/react-query";
import { api } from "../config/api";

export function useTipoTrabalhos() {

    const getTipoTrabalhos = async () => {

        try {
            const response = await api.get("trabalhos/tipos_de_trabalhos")
            return response.data.dados ?? []

        } catch (error) {
            console.log(error)
        }
    }

    const { data } = useQuery({
        queryKey: ["tiposDeTrabalhosLista"],
        queryFn: getTipoTrabalhos
    })

    return data;
}