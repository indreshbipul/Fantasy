import { useEffect, useState } from "react";
import UserServices from "../services/UserServices";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Loader from '../components/Loader';

function Account(){
    const [paperAccount, setPaperAccount] = useState(null);
    const [realAccount, SetRealAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const {setContext_Error, user} = useAuth();
    const navigate = useNavigate();
    useEffect(()=>{
        UserServices.getAccounts()
        .then(({res, status}) =>{
            setLoading(false);
            if(status !== 200){
                setContext_Error({req : "Account", message : res.message});
                return;
            }
            res.data?.forEach(acc =>{
                if(acc.accountType === "REAL"){
                    SetRealAccount(acc);
                }
                if(acc.accountType === "PAPER"){
                    setPaperAccount(acc);
                }
            })
        })
        .catch((err)=>{
            setLoading(false);
            setContext_Error({req  : "Account" , message : "Please try again in a moment"});
        })
    },[user])

    const createAccount = (payload) =>{
        UserServices.createAccounts(payload)
        .then(({res, status}) =>{
            if(status === 403){
                navigate('/verify')
                return
            }
            if(status !== 200){
                setContext_Error({req : "Account", message : res.message});
                return;
            }
            if(payload.type === "REAL"){
                SetRealAccount(res.data);
                return;
            }
            setPaperAccount(res.data);
        })
        .catch((err)=>{
            setContext_Error({req  : "Account" , message : "Please try again in a moment"});
        })
    }

    const paperAcc_btn = ()=>{
        if(paperAccount !== null){
            localStorage.setItem("accountType", "PAPER");
            navigate('/portfolio/PAPER');
            window.location.reload();
            return
        }
        createAccount({type : "PAPER"})
    }

    const realAcc_btn = ()=>{
        if(realAccount !== null){
            localStorage.setItem("accountType", "REAL")
            navigate('/portfolio/REAL');
            window.location.reload();
            return
        }
        createAccount({type : "REAL"})
    }

    if(loading){
        return <Loader />
    }

    return(
        <div className="min-h-screen  text-slate-900 antialiased font-sans relative flex items-center justify-center p-4 sm:p-4 overflow-hidden">
    
            {/* --- Ambient Background Glows (Same as Landing Page) --- */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/50 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/30 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-4xl w-full relative z-10">
                {/* --- Header Section --- */}
                <div className="text-center mb-12">
                     
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Path</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">
                       You can always switch between modes later in your dashboard.
                    </p>
                </div>

                {/* --- Account Selection Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    
                    {/* Option 1: Paper Trading */}
                    <div className="group relative bg-emerald-50/30 border-2 border-emerald-100 hover:border-emerald-400 rounded-[2rem] p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-100 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-400/20 transition-colors"></div>
                        
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100 mb-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            
                            <h2 className="text-2xl font-black text-slate-900 mb-3">Paper Trading</h2>
                            <p className="text-slate-600 font-medium mb-6 leading-relaxed">
                                Learn the terminal and test strategies risk-free. Start instantly with a <span className="font-bold text-emerald-700">₹10,000</span> virtual balance.
                            </p>
                            
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    Zero financial risk
                                </li>
                                <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    Real-time market data
                                </li>
                                <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    Instant setup (No KYC needed), just by Verifying your mobile number in profile
                                </li>
                            </ul>
                        </div>

                        {/*  Button for backend integration */}
                        <button onClick={paperAcc_btn} className="w-full py-4 bg-white border-2 border-emerald-200 text-emerald-700 font-black rounded-xl group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all active:scale-95 shadow-sm">
                            {paperAccount ? "Go" : "Enable Paper Trading"}
                        </button>
                    </div>

                    {/* Option 2: Real Trading */}
                    <div className="group relative bg-indigo-50/30 border-2 border-indigo-100 hover:border-indigo-500 rounded-[2rem] p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-200 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-colors"></div>
                        
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100 mb-6 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            
                            <h2 className="text-2xl font-black text-slate-900 mb-3">Real Trading</h2>
                            <p className="text-slate-600 font-medium mb-6 leading-relaxed">
                                Trade with real capital. Access live markets, AI Insights, and Agentic Trading with direct local payments.
                            </p>
                            
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    Full AI Terminal Access
                                </li>
                                <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    0% fee on first 10 trades
                                </li>
                                <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    Asset Sweeper enabled
                                </li>
                            </ul>
                        </div>

                        {/* Button for backend integration */}
                        <button onClick={realAcc_btn} className="w-full py-4 bg-slate-900 border-2 border-slate-900 text-white font-black rounded-xl group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-900/20">
                            {realAccount ? "GO" : "Enable Real Trading"}
                        </button>
                    </div>

                </div>

                {/* --- Identity Verification Requirement Banner --- */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Real Trading Comming Sooon</h3>
                            <p className="text-sm font-medium text-amber-800/80 mt-1">
                                You can enable <span className="font-bold">Real Trading Account </span>now but later, you must complete a quick identity verification (KYC) to secure your account and start real trading, till now enjoy paper trading.
                            </p>
                        </div>
                    </div>
                    
                    {/* Dummy Verify Button for backend integration */}
                    <button className="whitespace-nowrap px-6 py-3 bg-white border border-amber-300 text-amber-700 font-bold rounded-xl hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all active:scale-95 shadow-sm w-full sm:w-auto">
                        Comming Sooon
                    </button>
                </div>

            </div>
        </div>
    )
}
export default Account
