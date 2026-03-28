import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserServices from "../services/UserServices";
import useAuth from "../hooks/useAuth";
import WalletService from "../services/WalletServices";
import useStream from "../hooks/useStream";
import Decimal from "decimal.js";
import PortfolioCard from "../components/PortfolioCard";
import Loader from "../components/Loader";

export default function AccountDashboard() {
    const accountType = localStorage.getItem("accountType") || "PAPER";
    const {setContext_Error} = useAuth();
    const [portfolioData, setPortfolioData]  = useState();
    const {marketStream} = useStream();
    const [loading, setLoading] = useState(true)
    const [reload, setReload] = useState({})
    const navigate = useNavigate()

    useEffect(()=>{
        UserServices.portfolio({accountType})
        .then(({res, status})=>{   
            setLoading(false)
            if(status !== 200){
                setContext_Error({req : "Portfolio", message : res.message});
                return;
            }
            setPortfolioData(res.data);
        })
        .catch((err)=>{
            setLoading(false)
            setContext_Error({req : "Porfolio", message : "Please try again in a moment"});
        })
    },[reload])

    const initializeWallet_btn = ()=>{
        WalletService.initializeWallets({accountType})
        .then(({res,status}) =>{
            if(status === 404){
                setContext_Error({req : "Portfolio", message : res.message});
                navigate('/account');
                return
            }
            if(status !== 200){
                setContext_Error({req : "Portfolio", message : res.message});
                return;
            }
            setReload(prev => ({...prev}));
        })
        .catch((err)=>{
            setContext_Error({req : "Porfolio", message : "Please try again in a moment"});
        })
    }
    

    let assetBal = new Decimal(0);
    if (portfolioData?.wallets && marketStream?.latestTickers) {
        portfolioData.wallets.forEach(wallet => {
            if (wallet.walletType !== "CRYPTO") return;

            const price = marketStream.latestTickers[wallet.asset]?.currentPrice;
            if (!price || !wallet.balance) return;

            const value = new Decimal(wallet.balance).mul(price);
            assetBal = assetBal.plus(value).toDecimalPlaces(8);
        });
    }
    const totalAssetBalance = assetBal.toString();
    let totalBalance = ""
    if(portfolioData && totalAssetBalance){
        totalBalance = (Decimal(portfolioData?.wallets[0]?.balance).plus(Decimal(totalAssetBalance))).toString()
    }
    const [integerPart, decimalPart = "00"] = totalBalance.split(".");


    let totalProfit = new Decimal(0);
    let totalInvested = new Decimal(0);
    if (portfolioData?.wallets && marketStream?.latestTickers) {
        portfolioData.wallets.forEach(wallet => {
            if (wallet.walletType !== "CRYPTO") return;
            const balance = new Decimal(wallet.balance);
            if (balance.isZero()) return;    
            const price = Decimal(marketStream.latestTickers[wallet.asset]?.currentPrice);
            if (!price) return;
            const avg = new Decimal(wallet.averageBuyPrice);
            const invested = avg.mul(balance);
            const current = new Decimal(price).mul(balance);
            totalInvested = totalInvested.plus(invested);
            totalProfit = totalProfit.plus(current.minus(invested));
        });
    }
    const profitPercent = totalInvested.isZero() ? "0" : totalProfit.div(totalInvested).mul(100).toFixed(2);

    if(!marketStream || loading) return <Loader />

    return (
        <div className="min-h-screen   antialiased py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* --- Header Section --- */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900">Account Overview</h1>
                            {/* Live Account Badge */}
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${accountType === "PAPER" ? "bg-emerald-100 text-emerald-800 border border-emerald-200 " : "bg-pink-100 text-pink-800 border border-pink-200 "}`}>
                                {accountType} Trading
                            </span>
                        </div>
                        <p className="text-sm font-medium text-slate-500">Welcome back. Here is your portfolio summary.</p>
                    </div>

                    {/* Quick Trade Button */}
                    {/* <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Trade Now
                    </button> */}
                </div>

                {/* --- Top Grid: Master Balance or Quick Stats --- */}
                {portfolioData ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Master Balance Card (Premium Dark UI) */}
                        <div className="lg:col-span-2 bg-slate-900 rounded-[2rem] p-8 sm:p-10 relative overflow-hidden shadow-2xl shadow-slate-900/20">
                            {/* Background Glows */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
                            
                            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Equity</p>
                                        <div className="flex items-baseline gap-2">
                                            <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tighter">₹{integerPart}<span className="text-2xl text-slate-500"> . {decimalPart}</span></h2>
                                        </div>
                                    </div>
                                    {/* P&L Indicator */}
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                                        <svg className={`w-4 h-4 ${Number(profitPercent) < 0 ? "text-pink-400" : "text-emerald-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d={Number(profitPercent) < 0 ? "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"  /* Trending Down */: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"   /* Trending Up */} /></svg>
                                        <span className={`text-sm font-bold ${Number(profitPercent) < 0 ? "text-pink-400" : "text-emerald-400"}`}>{profitPercent }% Today</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <button onClick={()=>{navigate(`/deposit/${accountType}`)}} className="flex-1 py-3.5 bg-white text-slate-900 font-black rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-sm">
                                        Deposit
                                    </button>
                                    <button className={`flex-1 py-3.5 bg-slate-800 text-white font-black rounded-xl border border-slate-700 hover:bg-slate-700 transition-all active:scale-95 shadow-sm ${portfolioData?.accountType === "PAPER" ? "hidden" : ""}`}>
                                        Withdraw
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats / Buying Power */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col justify-center gap-6">
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Available to Trade</p>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">₹{portfolioData?.wallets[0]?.balance}</h3>
                            </div>
                            <div className="h-px w-full bg-slate-100"></div>
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Asset </p>
                                <h3 className="text-xl font-bold text-slate-600 tracking-tight">₹{totalAssetBalance || 77}</h3>
                            </div>
                            <div className="h-px w-full bg-slate-100"></div>
                            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                                View Order History
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                ):
                (
                    /* --- EMPTY STATE UI (Replaces your placeholder) --- */
                    <div className="w-full max-w-2xl mx-auto bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-10 sm:p-14 text-center flex flex-col items-center justify-center transition-all hover:border-indigo-300 hover:bg-indigo-50/30 group my-8">
                        
                        {/* Text Content */}
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
                            Activate Your Portfolio
                        </h3>
                        <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed mb-8">
                            To deposit INR and start trading, you need to initialize your secure Fantasy Exchange wallet. We handle the custody so you can focus on trading.
                        </p>

                        {/* Create Wallets Button  ! */}
                        <button 
                            onClick={initializeWallet_btn} 
                            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Initialize Wallets
                        </button>
                    </div>
                )}

                {/* --- Assets List Section --- */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900">Your Assets</h3>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                            <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Table Layout */}
                    <div className="overflow-x-auto">
                        {/* 1. ADDED 'table-fixed' HERE */}
                        <table className="w-full text-left border-collapse table-fixed min-w-[600px]">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    {/* 2. ADDED STRICT PERCENTAGE WIDTHS TO EACH TH */}
                                    <th className="w-[40%] px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Asset</th>
                                    <th className="w-[20%] px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Balance</th>
                                    <th className="w-[20%] px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
                                    <th className="w-[20%] px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Value (INR)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                
                                {portfolioData && (
                                    portfolioData.wallets.map((wallet) => {
                                        if (wallet.walletType === "CRYPTO") {
                                            return <PortfolioCard key={wallet.walletRef} wallet={wallet} />
                                        }
                                        return null; 
                                    })
                                )}
                                                                                        
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}