// const uri = "http://localhost:7000"
const uri = "http://api.fantasy.ibipul.space/auth"

const getProfile = async()=>{
    try{
        const response = await fetch(`${uri}/profile`,{
            method : "GET",
            headers : {
                'Content-Type' : "application/json"
            },
            credentials : "include"        
        })

        const res = await response.json()
        return {res,status : response.status}
    }
    catch(err){
        throw err
    }
}

const getAccounts = async()=>{
    try{
        const response = await fetch(`${uri}/getaccount`,{
            method : "GET",
            headers : {
                'Content-Type' : "application/json"
            },
            credentials : "include"
        })
        const res = await response.json()
        return {res, status : response.status}
    }
    catch(err){
        throw err
    }
}

const createAccounts = async(payload)=>{
    try{
        const response = await fetch(`${uri}/createaccount`,{
            method : "POST",
            headers : {
                'Content-Type' : "application/json"
            },
            credentials : "include",
            body : JSON.stringify(payload)
        })
        const res = await response.json()
        return {res, status : response.status}
    }
    catch(err){
        throw err
    }
}

const portfolio = async(payload)=>{
    try{
        const response = await fetch(`${uri}/getportfolio`,{
            method : "POST",
            headers : {
                "Content-Type"  : "application/json"
            },
            credentials : "include",
            body : JSON.stringify(payload)
        })
        const res = await response.json()
        return {res, status : response.status}
    }
    catch(err){
        throw err
    }
}

const getpaperlimt = async()=>{
    try{
        const response = await fetch(`${uri}/paperlimt`,{
            method : "GET",
            headers : {
                'Content-Type' : "application/json"
            },
            credentials : "include"
        })
        const res = await response.json()
        return {res, status : response.status}
    }
    catch(err){
        throw err
    }
}


const getOrders = async(payload)=>{
    try{
        const response = await fetch(`${uri}/orders`,{
            method : "POST",
            headers : {
                "Content-Type"  : "application/json"
            },
            credentials : "include",
            body : JSON.stringify(payload)
        })
        const res = await response.json()
        return {res, status : response.status}
    }
    catch(err){
        throw err
    }
}

const verifyProfile = async(payload)=>{
    try{
        const response = await fetch(`${uri}/verifyprofile`,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            credentials : "include",
            body : JSON.stringify(payload)
        })
        const res = await response.json()
        return {res, status : response.status};
    }
    catch(err){
        throw err
    }
}

const UserServices = {getProfile, getAccounts, createAccounts, portfolio, getpaperlimt, getOrders, verifyProfile }

export default UserServices