import { createContext, useEffect, useState } from "react"
import AuthServices from "../services/AuthServices"

export const AuthContext = createContext(null)

export function AuthProvider({children}){    
    const [user, setUser] = useState<object | null>(0)
    const [context_Error, setContext_Error] = useState<object | null>(null)
    const [loading, setLoading] = useState<boolean | null>(true)
    const[context_Ok, setContext_Ok] = useState()
    useEffect(()=>{
        AuthServices.session()
        .then(({res, status})=>{
            if(status !== 200){
                setLoading(false)
                setContext_Error({req : "session", message : res.message })
                return
            }
            setLoading(false)
            setUser(res.user)
        })  
        .catch(()=>{
            setContext_Error({req : "session", message : "Please try again in a moment" })
            setLoading(false)
        })      
    },[])
    return(
        <AuthContext.Provider value={{user,setUser,setContext_Error,loading, context_Error, context_Ok, setContext_Ok }}>{children}</AuthContext.Provider>
    )
}