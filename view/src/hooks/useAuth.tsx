import { useContext } from "react"
import { AuthContext } from "../context/authContext"

function useAuth (){
    const context = useContext(AuthContext)
    if(!context){
        return ("not")
    }
    return context
}

export default useAuth