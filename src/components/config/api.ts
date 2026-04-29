import axios from "axios";


export const api=axios.create({
    baseURL:import.meta.env.PROD?import.meta.env.VITE_PUBLIC_API_PRODUCTION_API_URL:import.meta.env.VITE_PUBLIC_API_DEVELOPMENT_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }}
)







