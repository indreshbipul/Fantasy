import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth';
import WalletService from "../services/WalletServices";
import Decimal from 'decimal.js';
import useStream from '../hooks/useStream';
import { v4 as uuidv4 } from "uuid";


function TradeCard({symbol}) {
    const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
    const {setContext_Error, user, setContext_Ok} = useAuth();
    const [fiatWallet, setFiatWallet] = useState({});
    const [tradeWallet, setTradeWallet] = useState({});
    const [amount, setAmount] = useState("");
    const accountType  = localStorage.getItem("accountType") || "PAPER";
    const {marketStream} = useStream()
    const [reload, setReload] = useState({});

    useEffect(()=>{
        if(user && user.firstName){
            const payload = {
                accountType,
                asset : symbol,
                assetType : "CRYPTO"
            }
            WalletService.getTradeWallets(payload)
            .then(({res,status})=>{
                if(status !== 200){
                    setContext_Error({req : "Trade", message : res.message});
                }
                setFiatWallet(res?.data?.fundWallet);
                setTradeWallet(res?.data?.tradeWallet);
            })
            .catch((err)=>{
                setContext_Error({req : "Trade", message : "Please try again in a moment" })
            })
        }
    },[symbol, reload])

    // operations on percentage button
    const percent_btn = (percent)=>{
        if(fiatWallet && tradeType === "buy"){
            const amt = (new Decimal(fiatWallet?.balance).mul(percent/100)).toString() 
            setAmount(amt)
            return
        }
        if(tradeWallet && tradeType === "sell"){
            const amt = (new Decimal(tradeWallet?.balance).mul(percent/100)).toString() 
            setAmount(amt)
            return
        }
    }

    // Operation on amount Field
    const amountField = (val) => {
        if (val === "") {
            setAmount("");
            return;
        }
        if (!/^[0-9]*\.?[0-9]*$/.test(val)) {
            return;
        }
        const value = Number(val);
        if (isNaN(value)) {
            return;
        }
        if (tradeType === "buy" && fiatWallet) {
            const balance = Number(fiatWallet.balance);
            if (value > balance) {
                setAmount(fiatWallet.balance);
                return;
            }
        }
        if (tradeType === "sell" && tradeWallet) {
            const balance = Number(tradeWallet.balance);
            if (value > balance) {
                setAmount(tradeWallet.balance);
                return;
            }
        }
        setAmount(val);
    };


    // Calculating Estimated Cost
    let estimatedAmount = "0.00"
    if(marketStream || tradeWallet || fiatWallet){
        const price = marketStream?.latestTickers[symbol]?.currentPrice;
        if (!price) return;
        if(tradeType === "buy" && amount){
            estimatedAmount = (new Decimal(amount).div(price)).toFixed(2).toString()
        }
        if(tradeType === "sell" && amount){
            estimatedAmount = (new Decimal(price).mul(amount)).toFixed(2).toString()
        }
    }

    const initializeWallet_btn = ()=>{
        const payload = {
            accountType,
            asset : symbol,
            assetType : "CRYPTO",
        };
        WalletService.createWallet(payload)
        .then(({res,status}) =>{
            if(status !== 200){
                setContext_Error({req : "Trade", message : res.message});
                return;
            }
            setReload(prev=>({...prev}))
            setContext_Ok({req : "Wallet", message : res.message})
        })
        .catch((err)=>{
            setContext_Error({req : "Trade", message : "Please try again in a moment"});
        })
    }

    function buy_Trade(){
        if(new Decimal(amount).isZero()) return setContext_Error({req : "Buy Trade", message : "Invalid Amount"})
        const key = uuidv4()
        const payload = {
            key,
            accountType,
            asset1 : {type : "FIAT", symbol : "INR" },
            asset2 : {type : "CRYPTO", symbol : symbol},
            amount : amount,
            purpose  : `Buy Crypto Coin ${symbol}`,
            transactionType : `${tradeType.toUpperCase()}`
        }
        WalletService.buyTrade(payload)
        .then(({res,status})=>{
            if(status !== 202){
                setContext_Error({req : "Buy Trade", message : res.message});
            }
            setContext_Ok({req : "Buy Trade", message : res.message})
        })
        .catch((err)=>{
            setContext_Error({req : "Buy Trade", message : "Please try again in a moment" })
        })

    }
    function sell_Trade(){
        if(new Decimal(amount).isZero()) return setContext_Error({req : "Sell Trade", message : "Invalid Amount"})
        const key = uuidv4()
        const payload = {
            key,
            accountType,
            asset1 : {type : "FIAT", symbol : "INR" },
            asset2 : {type : "CRYPTO", symbol : symbol},
            quantity : amount,
            purpose  : `Sell Crypto Coin  ${symbol}`,
            transactionType : `${tradeType.toUpperCase()}`
        }
        WalletService.sellTrade(payload)
        .then(({res,status})=>{
            if(status !== 202){
                setContext_Error({req : "Sell Trade", message : res.message});
            }
            setContext_Ok({req : "Sell Trade", message : res.message})

        })
        .catch((err)=>{
            setContext_Error({req : "Sell Trade", message : "Please try again in a moment" })
        })
    }

    const trade_btn = ()=>{
        if(tradeType === "buy"){
            buy_Trade();
            return;
        }
        if(tradeType === "sell"){
            sell_Trade();
            return;
        }
    }

    if(!user?.firstName){
        return null
    }
    return (
        <div>
            {tradeWallet  ? (
                <div className="bg-white p-5 sm:p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
                
                {/* --- Buy / Sell Toggle --- */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 relative isolate">
                    {/* Sliding Background driven by tradeType */}
                    <div 
                        className={`absolute inset-y-1.5 w-[calc(50%-6px)] bg-white border-gray-200 border-2 rounded-xl shadow-sm transition-all duration-300 ease-out z-0 ${
                            tradeType === 'buy' ? 'left-1.5' : 'left-[calc(50%+4.5px)]'
                        }`}
                    ></div>

                    <button onClick={() => {setTradeType('buy'), setAmount("0.00")}} className={`relative z-10 flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${tradeType === 'buy' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        Buy
                    </button>
                    <button onClick={() => {setTradeType('sell'), setAmount("0.00")}} className={`relative z-10 flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${tradeType === 'sell' ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        Sell
                    </button>
                </div>
                
                <div className="space-y-6">
                    
                    {/* --- Input Section --- */}
                    <div>
                        <div className="flex justify-between items-end mb-2 px-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {tradeType === 'buy' ? 'Investment Amount' : 'Quantity to Sell'}
                            </label>
                            {/*   Available Balance */}
                            <div className="text-[10px] font-bold text-slate-400">
                                Available: <span className="text-slate-700 font-black">
                                    {tradeType === 'buy' ? `₹${fiatWallet?.balance}` : `${tradeWallet?.balance} ${symbol}`}
                                </span>
                            </div>
                        </div>

                        <div className="relative group">
                            {/* Static Input */}
                            <input 
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                onChange={(e)=>{amountField(e.target.value)}} 
                                value={amount}
                                className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pr-24 text-xl font-black text-slate-900 outline-none focus:bg-white transition-all ${
                                    tradeType === 'buy' ? 'focus:border-emerald-500' : 'focus:border-rose-500'
                                }`}
                            />
                            
                            {/* Max Button & Currency Label */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <button onClick={()=>{percent_btn(100)}} className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-colors ${
                                    tradeType === 'buy' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                                }`}>
                                    Max
                                </button>
                                <span className="text-xs font-black text-slate-400 w-8 text-right">
                                    {tradeType === 'buy' ? `${fiatWallet?.asset}` : `${tradeWallet?.asset}`}
                                </span>
                            </div>
                        </div>

                        {/* Static Percentage Pills */}
                        <div className="flex gap-2 mt-3">
                            <button onClick={()=>{percent_btn(25)}} className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] font-bold rounded-lg transition-colors">
                                25%
                            </button>
                            <button onClick={()=>{percent_btn(50)}} className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] font-bold rounded-lg transition-colors">
                                50%
                            </button>
                            <button onClick={()=>{percent_btn(75)}} className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] font-bold rounded-lg transition-colors">
                                75%
                            </button>
                        </div>
                    </div>

                    {/* --- Summary & Execution --- */}
                    <div className="pt-2">
                        <div className="flex justify-between px-2 mb-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Receive </span>
                            <span className="text-[12px] font-black text-slate-900">
                                {tradeType === 'buy' ? `${estimatedAmount}` : `${estimatedAmount}`} <span className="text-slate-400 text-[10px]">
                                    {tradeType === 'buy' ? `${tradeWallet?.asset}` : `${fiatWallet?.asset}`}
                                </span>
                            </span>
                        </div>

                        {/* Dynamic Trade Action Button */}
                        <button onClick={trade_btn} className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all text-white flex justify-center items-center gap-2 ${
                            tradeType === 'buy' 
                                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' 
                                : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                        }`}>
                            Place {tradeType} Order
                        </button>
                    </div>

                </div>
            </div>
        ):(
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center text-center min-h-[400px] animate-in fade-in zoom-in-95 duration-300">
                
                {/* Animated Wallet Icon */}
                <div className="relative mb-6">
                    {/* Pulsing glow effect behind the icon */}
                    <div className="absolute inset-0 bg-indigo-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    
                    {/* Main Icon Circle */}
                    <div className="relative w-20 h-20 bg-indigo-50 border-4 border-white rounded-full shadow-md flex items-center justify-center text-indigo-600">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        
                        {/* Tiny plus badge in the bottom right corner */}
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-slate-900 text-white rounded-full border-2 border-white flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        </div>
                    </div>
                </div>

                {/* Text Context */}
                <h3 className="text-xl font-black text-slate-900 mb-2">{symbol} Wallet Required</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8 max-w-[280px]">
                    You need to initialize {symbol?.toLowerCase()} wallet before you can place orders of this coin.
                </p>

                {/* Action Button */}
                <button onClick={initializeWallet_btn} className="w-full sm:w-auto px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2">
                    Initialize Wallet
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
                
                <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">
                    Takes 2-3 seconds
                </p>
                
            </div>
        )
    }
    </div>
  )
}

export default TradeCard