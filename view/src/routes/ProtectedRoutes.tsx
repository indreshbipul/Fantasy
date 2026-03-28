import { Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

function ProtectedRoutes({children}){
    const {user} = useAuth()
    if(!user?.firstName){
        return <Navigate to='/login' replace />
    }
    return <>{children}</>

}

export default ProtectedRoutes