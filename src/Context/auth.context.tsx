import { api } from "@/components/config/api";
import { createContext, useEffect, useState } from "react";

type IUser = {
    usuario: {
        id: string;
        phone_number: string;
        email: string;
        auth_token: string;
        api_token: string;
        created_at: string;
        available_sms: number;
        role: "ESTUDANTE" | "ADMIN" | "PROFESSOR" | "AVALIADOR";
        postpaid: boolean | null
    },
    accessToken: string,
    refreshToken: string
}

type LoginParams = {
    email: string,
    senha: string
}

type IAuthContext = {
    statusErroAuth: boolean;
    setStatusErroAuth: React.Dispatch<React.SetStateAction<boolean>>;
    user: IUser | null;
    loading: boolean;
    login: (props: LoginParams) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<IAuthContext>({
    login: async () => { },
    logout: () => { },
    isAuthenticated: false,
    loading: true,
    user: null,
    statusErroAuth: false,
    setStatusErroAuth: () => { }
})

export function AuthProvider({ children }: any) {
    const [statusErroAuth, setStatusErroAuth] = useState(false);
    const storedToken = localStorage.getItem("token-repo");
    const storedUser = localStorage.getItem("user-repo");

    const [isAuthenticated, setIsAuthenticated] = useState(!!storedToken);
    const [user, setUser] = useState<IUser | null>(
        storedUser ? JSON.parse(storedUser) : null
    );
    const [loading, setLoading] = useState(true); // começa true

    async function login({ email, senha }: LoginParams) {
        try {
            const { data, status } = await api.post(
                "/auth/login",
                { email, senha }
            );

            if (status === 200 || status === 201) {
                api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`

                localStorage.setItem("user-repo", JSON.stringify(data));
                localStorage.setItem("token-repo", data.accessToken);
                localStorage.setItem("refreshToken-repo", data?.refreshToken)

                setUser(data);
                setIsAuthenticated(true);
            }
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            throw error;
        }
    }

    async function logout() {
        try {

            const { data } = await api.post("auth/logout")

            localStorage.removeItem("user-repo");
            localStorage.removeItem("token-repo");
            localStorage.removeItem("refreshToken-repo")
            setUser(null);
            setIsAuthenticated(false);

            return data

        } catch (error) {
            console.log("Erro ao terminar sessão")
            return;
        }

    }

    async function readSession() {
        const token = localStorage.getItem("token-repo");
        const userData = localStorage.getItem("user-repo");
        const refreshToken = localStorage.getItem("refreshToken-repo");

        if (token && userData && refreshToken) {
            api.defaults.headers.common.Authorization = `Bearer ${token}`;

            setUser(JSON.parse(userData));
            setIsAuthenticated(true);

        } else {
            setIsAuthenticated(false);
        }

        setLoading(false); // só libera a tela aqui
    }

    useEffect(() => {
        readSession();
    }, []);


    return (
        <AuthContext.Provider
            value={{
                statusErroAuth,
                setStatusErroAuth,
                isAuthenticated,
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

