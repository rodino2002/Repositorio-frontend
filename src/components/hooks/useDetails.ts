import { useQuery } from "@tanstack/react-query";
import { api } from "../config/api";

export function useDetails() {

    const getDetails = async () => {

        try {
            const response = await api.get("usuarios/details")
            return response.data.dados ?? []

        } catch (error) {
            console.log(error)
        }
    }

    const { data, isLoading } = useQuery({
        queryKey: ["detailsUser"],
        queryFn: getDetails
    })

    return { data, isLoading };
}