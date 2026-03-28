import { useEffect, useState } from 'react';
import WalletService from '../services/WalletServices';
import useAuth from '../hooks/useAuth';
import UserServices from '../services/UserServices';
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";


export default function PaperDepositPage() {
    const [paperAmount, setPaperAmount] = useState('');
    const [paperLimitData, setPaperLimitData] = useState({})
    const accountType = localStorage.getItem("accountType") || "PAPER"
    const {setContext_Error, setContext_Ok} = useAuth()
    const navigate = useNavigate()

    useEffect(()=>{
        UserServices.getpaperlimt()
        .then(({res,status})=>{
            if(status !== 200){
                setContext_Error({req : "Weekly Limit", message : res.message});
            }
            setPaperLimitData(res.data)
        })
        .catch((err)=>{
            setContext_Error({req : "Weekly Limit", message : "Please try again in a moment" })
        })
    },[])
    
    //calculation part 
    let paperLimit = 0
    let paperClaimed = 0
    if(paperLimitData){
        paperLimit = paperLimitData?.weeklyLimit;
        paperClaimed = paperLimitData?.usedLimit; 
    }
    const paperRemaining = paperLimitData?.weeklyLimit - paperLimitData?.usedLimit;
    const progressPercentage = (paperClaimed / paperLimit) * 100;

    const paperAmount_Field = (val)=>{
        if(!val){
            setPaperAmount("");
        }
        if (!/^[0-9]*\.?[0-9]*$/.test(val)) {
            return;
        }
        const value = Number(val);
        if(value > paperRemaining){
            setPaperAmount(paperRemaining);
            return;
        }
        setPaperAmount(val)
    }

    const handle_Deposite_btn = ()=>{
        const key = uuidv4()
        const payload = {
            accountType,
            transactionType : "DEPOSIT",
            asset1 : {type : "FIAT", symbol : "INR"},
            key,
            purpose : `${accountType} DEPOSITE`,
            amount : paperAmount
        }
        WalletService.deposit(payload)
        .then(({res, status})=>{
            if(status !== 202){
                setContext_Error({req : "DEPOSIT", message : res.message});
                return
            }
            setContext_Ok({req : "Paper Deposite", message : res.message});
            setPaperLimitData((prev) => ({...prev, usedLimit : prev.usedLimit + Number(paperAmount)}))
        })
        .catch((err)=>{
            setContext_Error({req : "DEPOSIT", message : "Please try again in a moment" })
        })
    }

    if(!paperLimit || !accountType){
        return <Loader />
    }

    return (
        <div className="min-h-screen bg-slate-50 antialiased py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                
                {/* --- Page Header --- */}
                <div className="mb-8">
                    <button onClick={()=>{navigate(`/portfolio/${accountType}`)}} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors mb-4">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Portfolio
                    </button>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Claim Virtual Funds</h1>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-stretch">
                    
                    {/* LEFT COLUMN: PAPER FAUCET FORM */}
                    <div className="lg:col-span-7">
                        <div className="h-full bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col p-6 sm:p-8 relative">
                            {/* Background Glow Effect */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                            
                            <div className="space-y-8 relative z-10">
                                {/* Title Area */}
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900">Virtual Funds</h2>
                                        <p className="text-sm font-medium text-slate-500">Virtual INR to Practice Trading.</p>
                                    </div>
                                </div>

                                {/* Amount Input */}
                                <div>
                                    <div className="flex justify-between items-end mb-3">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Mint Amount</p>
                                        <p className="text-xs font-bold text-indigo-600">Max allowed: ₹{paperRemaining.toLocaleString()}</p>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 font-black text-xl">₹</span>
                                        <input 
                                            type="text"
                                            inputMode="decimal"
                                            value={paperAmount}
                                            onChange={(e) => {paperAmount_Field(e.target.value)}}
                                            placeholder="0.00" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-10 pr-4 text-2xl font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <button 
                                            onClick={() => setPaperAmount(paperRemaining.toString())} 
                                            className="px-4 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black rounded-lg transition-colors border border-indigo-200"
                                        >
                                            Claim Max
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handle_Deposite_btn} 
                                disabled={!paperAmount || Number(paperAmount) <= 0} 
                                className="mt-10 w-full py-4 bg-indigo-600 disabled:bg-slate-300 disabled:text-slate-500 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex justify-center items-center gap-2"
                            >
                                Claim Virtual Funds
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: PAPER RULES & LIMITS */}
                    <div className="lg:col-span-5">
                        <div className="h-full bg-slate-900 rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-slate-800 flex flex-col">
                            
                            {/* Paper Limit Bar */}
                            <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700 mb-6">
                                <div className="flex justify-between items-end mb-3">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Weekly Virtual Funds Limit</p>
                                        <p className="text-sm font-bold text-slate-300">
                                            ₹{paperClaimed.toLocaleString()} <span className="text-slate-500">/ ₹{paperLimit.toLocaleString()}</span>
                                        </p>
                                    </div>
                                    <span className="text-xs font-black text-indigo-400">{progressPercentage.toFixed(0)}% Used</span>
                                </div>
                                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                                </div>
                            </div>

                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Rules</h3>
                            <div className="space-y-4">
                                
                                <div className="border rounded-xl p-4 flex gap-3 items-start bg-indigo-500/10 border-indigo-500/20">
                                    <div className="mt-0.5 shrink-0 text-indigo-400">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-indigo-400">Simulated Funds Only</h4>
                                        <p className="text-xs font-medium mt-1 leading-relaxed text-indigo-200/80">
                                            Paper funds cannot be withdrawn or converted to fiat. They exist purely for testing strategies risk-free.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-xs bg-slate-800 text-slate-400">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-200">Practice Safely</h4>
                                            <p className="text-xs font-medium text-slate-400 mt-1">Execute limit and market orders using live market data without risking capital.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-xs bg-slate-800 text-slate-400">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-200">Refill Balances</h4>
                                            <p className="text-xs font-medium text-slate-400 mt-1">You can reset your paper trading balance by claming new funds up to your limit every week.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}