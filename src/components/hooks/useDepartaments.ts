import { useQuery } from "@tanstack/react-query";
import { api } from "../config/api";

export function useDepartaments() {

    const getDepartaments = async () => {

        try {
            const response = await api.get("departamentos")
            return response.data.dados ?? []

        } catch (error) {
            console.log(error)
        }
    }

    const { data } = useQuery({
        queryKey: ["departamentoLista"],
        queryFn: getDepartaments
    })

    return data;
}