// const uri = "http://localhost:7000"
const uri = "http://api.fantasy.ibipul.space/auth"

// For New Users TO create Basic Wallets
const initializeWallets = async(payload)=>{
    try{
        const response = await fetch(`${uri}/initializewallet`,{
            method : "POST",
            headers : {
                "Content-Type": "application/json"
            },
            credentials : "include",
            body : JSON.stringify(payload)
        });
        const res =  await response.json();
        return {res , status : response.status};
    }
    catch(err){
        throw err;
    }
}

const deposit = async(payload : Object)=>{
    try{
        const response = await fetch(`${uri}/deposit`,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            credentials : "include",
            body : JSON.stringify(payload)
        });
        const res = await response.json();
        return {res, status : response.status};
    }
    catch(err){
        throw err;
    }
}

const getTradeWallets = async(payload) =>{
    try{
        const response = await fetch(`${uri}/tradewallets`,{
            method : "POST",
            headers : {
                "Content-Type"  : "application/json",
            },
            credentials : "include",
            body  : JSON.stringify(payload),
        })
        const res = await response.json();
        return {res, status : response.status};
    }
    catch(err){
        throw err;
    }
}

// On demand Wallet
const createWallet = async(payload)=>{
    try{
        const response = await fetch(`${uri}/createwallet`,{
            method : "POST",
            headers : {
                "Content-Type"  : "application/json",
            },
            credentials : "include",
            body  : JSON.stringify(payload),
        })
        const res = await response.json();
        return {res, status : response.status};
    }
    catch(err){
        throw err;
    }
}

const buyTrade = async(payload)=>{
    try{
        const response = await fetch(`${uri}/buytrade`,{
            method : "POST",
            headers : {
                "Content-Type"  : "application/json",
            },
            credentials : "include",
            body  : JSON.stringify(payload),
        })
        const res = await response.json();
        return {res, status : response.status};
    }
    catch(err){
        throw err;
    }
}

const sellTrade = async(payload)=>{
    try{
        const response = await fetch(`${uri}/selltrade`,{
            method : "POST",
            headers : {
                "Content-Type"  : "application/json",
            },
            credentials : "include",
            body  : JSON.stringify(payload),
        })
        const res = await response.json();
        return {res, status : response.status};
    }
    catch(err){
        throw err;
    }
}

const getTransactions = async(payload)=>{
    try{
        const response = await fetch(`${uri}/transactions`,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            credentials : "include",
            body : JSON.stringify(payload)
        });
        const res = await response.json();
        return {res, status : response.status};
    }
    catch(err){
        throw err;
    }
}

const WalletService = {initializeWallets, deposit, getTransactions, getTradeWallets, createWallet, buyTrade, sellTrade }

export default WalletService