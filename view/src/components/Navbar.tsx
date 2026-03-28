import { Link, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { useState } from "react"
import AuthServices from "../services/AuthServices"

function Navbar(){
    const navigate = useNavigate()
    const [mobile_btn, setMobile_btn] = useState(false)
    const [error, setError] = useState<any | null>(null)
    const {user,setUser,loading} = useAuth()

    const login_btn = ()=>{
        if(!user){
            setMobile_btn(false)
            navigate('/login')
        }
    }
    const handle_Logout = ()=>{
        if(user){
            AuthServices.logout()
            .then(({res,status})=>{
                if(status !== 200){
                    setError(res)
                    console.log(res)
                    return
                }
                setUser(null)
                navigate('/login')
            })
            .catch((err)=>{
                setError("Please try again in a moment")
            })
        }
    }

    const [accountType, setAccountType] = useState(() => {
        return localStorage.getItem("accountType") || "PAPER";
    });
    const realAccountSwitch = () => {
        if (accountType !== "REAL") {
            localStorage.setItem("accountType", "REAL");
            setAccountType("REAL");
            window.location.reload(); 
        }
    };

    const paperAccountSwitch = () => {
        if (accountType !== "PAPER") {
            localStorage.setItem("accountType", "PAPER");
            setAccountType("PAPER");
            window.location.reload();
        }
    };
    

    return(
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    
                    {/* --- Left Side: Logo only --- */}
                    <div onClick={() => { navigate('/') }} className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-colors shadow-sm shadow-indigo-200">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <span className="text-slate-900 font-black text-2xl tracking-tighter">
                            Fan<span className="text-indigo-600">tasy</span>
                        </span>
                    </div>

                    {/* --- Right Side: Wallet, Profile & Permanent Menu --- */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        
                        {/*  Portfolio Button  */}
                        <button 
                            onClick={(e) => { e.preventDefault(), navigate(`/portfolio/${accountType}`) }} 
                            className={`${!user ? "hidden" : "flex"} group items-center gap-2.5 bg-white border-2 border-slate-200 hover:border-indigo-600 pr-4 pl-1.5 py-1.5 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-95`}
                        >
                            <div className="bg-slate-100 p-1.5 rounded-xl group-hover:bg-indigo-600 transition-colors">
                                <svg className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12V7H5a2 2-0 010-4h14v4" /><path d="M3 5v14a2 2 0 002 2h16v-5" /><path d="M18 12a2 2-0 000 4h4v-4h-4z" />
                                </svg>
                            </div>
                            <span className="text-sm font-black text-slate-700 group-hover:text-indigo-700 transition-colors hidden sm:inline-block">Portfolio</span>
                        </button>

                        {/* Profile/Auth with Name Visible */}
                        <button onClick={login_btn} className="flex items-center gap-2.5 text-sm font-bold text-slate-700 hover:text-indigo-600 transition-all p-1 sm:pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200">
                            {user ? (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 font-black">
                                        {user.firstName[0]}
                                    </div>
                                    {/* Name visible on sm, md, lg screens */}
                                    <span className="hidden sm:block text-slate-800 font-extrabold tracking-tight">
                                        {user.firstName}
                                    </span>
                                </>
                            ) : (
                                <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full font-black">Sign In</span>
                            )}
                        </button>

                        {/* Vertical Divider */}
                        <div className="h-6 w-px bg-slate-200 mx-1"></div>

                        {/* PERMANENT Menu Trigger */}
                        <button 
                            onClick={() => { setMobile_btn((prev) => (!prev)) }} 
                            className={`p-2 rounded-xl transition-all duration-200 border ${mobile_btn ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200'}`}
                        >
                            {mobile_btn ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Right-Aligned Sidebar/Dropdown Menu --- */}
            <div className={`${mobile_btn ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0 pointer-events-none"} absolute top-[calc(100%+8px)] right-4 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl transition-all duration-300 overflow-hidden`}>
                
                {/*  Account Switcher Section */}
                {user?.status !== "UNVERIFIED" ?(
                        <div className={`p-4 bg-slate-50 border-b border-slate-100 ${user ? "" : "hidden"}`}>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Active Account</p>
                            <div className="relative flex items-center p-1 bg-slate-200/60 rounded-xl">
                                
                                {/* Real Account */}
                                <button 
                                    onClick={realAccountSwitch} 
                                    className={`flex-1 flex items-center justify-center py-2 text-xs font-bold transition-all rounded-lg ${accountType === "REAL" ? "font-black text-emerald-700 bg-white shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-700"}`}>
                                    Real Trading
                                </button>
                                
                                {/* Paper Account */}
                                <button 
                                    onClick={paperAccountSwitch} 
                                    className={`flex-1 flex items-center justify-center py-2 text-xs font-bold transition-all rounded-lg ${accountType === "PAPER" ? "font-black text-indigo-700 bg-white shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-700"}`}>
                                    Paper Trading
                                </button>

                            </div>
                        </div>
                    ):
                    <div className="p-4 bg-red-200 border-b border-slate-100">
                        <h1 className="text-center text-slate-600  font-black ">Verification Pending</h1>
                        <p className="text-[10px] text-center  text-slate-500 uppercase tracking-widest mb-1">please verify your Account </p>
                        <button onClick={() => { setMobile_btn(false), navigate('/verify') }} className="px-3 bg-gray-200 rounded-md border hover:bg-gray-300 translate-x-20 hover:scale-105">Validate</button>
                    </div>
                }

                {/* Navigation Links */}
                <div className="p-4 space-y-1">
                    <div className="px-4 py-2 mb-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Menu</p>
                    </div>
                    <Link onClick={() => { setMobile_btn(false) }} to="/market" className="flex items-center px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Markets</Link>
                    {user?.firstName &&(
                        <Link onClick={() => { setMobile_btn(false) }} to="/profile" className="flex items-center px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Profile</Link>
                    )}
                    {user?.firstName &&(
                        <Link onClick={() => { setMobile_btn(false) }} to="/history" className="flex items-center px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Transactions</Link>
                    )}
                    {user?.firstName &&(
                        <Link onClick={() => { setMobile_btn(false) }} to="/orders" className="flex items-center px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Trades</Link>
                    )}
                    <Link onClick={() => { setMobile_btn(false) }} to="/setting" className="flex items-center px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Setting</Link>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <button 
                            onClick={() => { navigate('/login'), setMobile_btn(false), handle_Logout() }} 
                            className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all bg-slate-900 text-white hover:bg-indigo-600 active:scale-95 shadow-lg shadow-indigo-100"
                        >
                            {user ? "Sign Out" : 'Get Started'}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar