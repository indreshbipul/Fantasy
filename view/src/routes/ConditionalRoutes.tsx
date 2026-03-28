import { Navigate, replace } from "react-router-dom"

function ConditionalRoutes({children, path}){
    const accountType = localStorage.getItem("accountType") || "PAPER"
    return <Navigate to={`${path}/${accountType}`} replace />
}

export default ConditionalRoutes