import { Navigate, Route, Routes } from "react-router"
import { BrowserRouter } from "react-router-dom"
import Dashboard from "../pages/Dashboard"
import Login from "../pages/login"
import PageNotFound from "../pages/pageNoutFound"
import CreateAccount from "../pages/crateAccount"
import PrivateRoute from "./private.routes"
import { AuthContext } from "@/Context/auth.context"
import { useContext } from "react"
import Estudantes from "../pages/students"
import Docentes from "../pages/techears"
import Trabalhos from "../pages/works"
import Especialidades from "../pages/especialities"
import Departamentos from "../pages/departaments"
import Avaliadores from "../pages/avaliadores"

export const Routers = () => {
     const {isAuthenticated} = useContext(AuthContext);

    return (
        <>
            <BrowserRouter>
                <Routes>

                    {/* rotas públicas */}

                    <Route path='/login' element={isAuthenticated ? <Navigate to="/" />:<Login />} />
                    <Route path="criar-conta" element={isAuthenticated ? <Navigate to="/" /> : <CreateAccount />} />
                    <Route path="*" element={<PageNotFound />} />

                    {/* Rotas privadas */}
                    <Route element={<PrivateRoute />}>
                        <Route path='/' element={<Dashboard />} />
                         <Route path='/estudantes' element={<Estudantes />} />
                          <Route path='/docentes' element={<Docentes />} />
                           <Route path='/trabalhos' element={<Trabalhos />} />
                            <Route path='/especialidades' element={<Especialidades />} />
                             <Route path='/departamentos' element={<Departamentos />} />
                             <Route path='/avaliadores' element={<Avaliadores />} />
                    </Route>

                </Routes>
            </BrowserRouter>
        </>
    )
}