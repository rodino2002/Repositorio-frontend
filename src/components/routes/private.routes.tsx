import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "@/components/utils/spinner";
import { AuthContext } from "@/Context/auth.context";
import { DefaultLayout } from "../layout";


const PrivateRoute: React.FC = () => {
    const {loading, isAuthenticated} = useContext(AuthContext);
    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center text-[#143163] space-x-2">
                <Spinner color="#143163" width="60" height="60" /><p>A carregar...</p>
            </div>
        );
    }
    return isAuthenticated ?
        <DefaultLayout>
            <Outlet />
        </DefaultLayout> : <Navigate to="/login" />;

};

export default PrivateRoute;