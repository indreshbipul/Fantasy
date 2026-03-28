import { Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

function PublicOnlyRoutes({children}){
    const {user, setContext_Error} = useAuth()
    if(user?.firstName){
        return <Navigate to="/" replace />
    }
    return <>{children}</>;
}

export default PublicOnlyRoutes