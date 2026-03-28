// const uri = "http://localhost:7000"
const uri = "http://api.fantasy.ibipul.space/auth"

const login = async (data : object)=>{
    try{
        const response = await fetch(`${uri}/login`,{
        method  : "POST",
        headers : {
            "Content-type" : "application/json"
        },
        credentials : "include",
        body : JSON.stringify(data)
        })
        const res = await response.json()
        return {res, status : response.status}
    }
    catch(err){
        throw err
    }
}

const signup = async(data : object)=>{
    try{
        const response = await fetch(`${uri}/signup`,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data)
        })
        const res = await response.json()
        return {res, status: response.status}
    }
    catch(err){
        throw err
    }
}

const session = async()=>{
    try{
        const response = await fetch(`${uri}/session`,{
            method : "GET",
            headers : {
                "Content-Type" : "application/json"
            },
            credentials : "include"
        })
        const res = await response.json()
        return {res, status: response.status}
    }
    catch(err){
        throw err
    }
}

const logout = async()=>{
    try{
        const response = await fetch(`${uri}/logout`,{
            method: "PUT",
            headers : {
                "Content-Type" : "application/json"
            },
            credentials : 'include'
        })
        const res = await response.json()
        return {res, status: response.status}
    }
    catch(err){
        throw err
    }
}

const AuthServices  = {login, signup, session, logout}
export default AuthServices