import { Navigate, Route, Routes } from "react-router"
import { BrowserRouter } from "react-router-dom"
import Dashboard from "../pages/Dashboard"
import Login from "../pages/login"
import PageNotFound from "../pages/pageNoutFound"
import CreateAccount from "../pages/crateAccount"
import PrivateRoute from "./private.routes"
import { AuthContext } from "@/Context/auth.context"
import { useContext } from "react"
import Estudantes from "../pages/gestao_de_contas"
import Trabalhos from "../pages/works"
import Especialidades from "../pages/especialities"
import Departamentos from "../pages/departaments"
import ISPBLandingPage from "../pages/landingPageRepo"
import BuscaSemanticaActual from "../pages/busca-semantica-actual"
import MeuPerfil from "../pages/meuPerfil"

export const Routers = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <>
            <BrowserRouter>
                <Routes>

                    {/* rotas públicas */}

                    <Route path='/login' element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
                    <Route path="criar-conta" element={isAuthenticated ? <Navigate to="/" /> : <CreateAccount />} />
                    <Route path="criar-conta-professor" element={isAuthenticated ? <Navigate to="/" /> : <CreateAccount />} />
                    <Route path="*" element={<PageNotFound />} />
                    {/* <Route path="/busca-semantica-tcc" element={<SemanticTCCSearchLanding />} /> */}
                    <Route path="/busca-semantica-tcc" element={<BuscaSemanticaActual />} />
                    <Route path="/repositorio" element={<ISPBLandingPage />} />

                    {/* Rotas privadas */}
                    <Route element={<PrivateRoute />}>
                        <Route path='/' element={<Dashboard />} />
                        <Route path='/gestao-de-contas' element={<Estudantes />} />
                        <Route path='/trabalhos' element={<Trabalhos />} />
                        <Route path='/especialidades' element={<Especialidades />} />
                        <Route path='/departamentos' element={<Departamentos />} />
                        <Route path='/meu-perfil' element={<MeuPerfil />} />
                    </Route>

                </Routes>
            </BrowserRouter>
        </>
    )
}