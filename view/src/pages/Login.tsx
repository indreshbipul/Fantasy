import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthServices from "../services/AuthServices"
import useAuth from "../hooks/useAuth"

function Login(){
    const navigate = useNavigate()
    const [email, setEmail] = useState<String | null>()
    const [password, setPassword] = useState<string | null>()
    const [error, setError] = useState<string | null>()
    const {user, setUser, loading} = useAuth()

    const handleSubmit = ()=>{
        if(!email || !password){
            setError("! PLEASE ENTER YOUR EMAIL AND PASSWORD")
            return
        }
        const data = {
            "email" : email,
            "password" : password,
        }
        AuthServices.login(data)
        .then(({res,status})=>{
            if(status !== 200){
                setError(res.message)
                return
            }
            setError("")
            setUser(res.data)
            navigate("/")                         
        })
        .catch(()=>{
            setError("Please try again in a moment")
        })
    }

    return(
        <div className="antialiased text-[#0F172A] bg-gray-100 ">
            <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col lg:grid lg:grid-cols-2 gap-14 items-center">
                <div>
                    <h1 className="text-6xl md:text-7xl font-[900] tracking-tighter leading-[0.9] mb-15">
                        Fan<span className="text-indigo-600">tasy</span><br/><span>Exchange</span>
                    </h1>
                    <p className="text-gray-500 text-xl font-medium max-w-md leading-relaxed">
                        Access the next generation of crypto trading. Fast, secure, and built for the modern investor.
                    </p>
                    
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 w-full md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden">                    
                    <div className="relative">
                        {error && (
                            <div className="text-rose-500 text-center">! {error?.toUpperCase()}</div>
                        )}
                        <h2 className="text-3xl tracking-tight mb-2 text-indigo-600 font-extrabold">Welcome Back</h2>
                        <p className="text-gray-400 font-medium mb-6">Sign in to manage your portfolio</p>

                        <form className="space-y-2">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Email Address</label>
                                <input onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="example@email.com" 
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-[#6366F1] outline-none transition-all font-semibold"/>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Password</label>
                                <input onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="••••••••" 
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-[#6366F1] outline-none transition-all font-semibold"/>
                            </div>

                            <div className="flex justify-end mt-2">
                                <a href="#" className="text-sm font-bold text-[#6366F1]">Forgot Password?</a>
                            </div>

                            <button onClick={(e)=>{e.preventDefault(), handleSubmit()}} className="w-full bg-[#0F172A] text-white font-bold py-5 rounded-2xl hover:scale-[1.01] hover:bg-indigo-700 hover:cursor-pointer transition-all shadow-xl shadow-indigo-200 mt-4 text-lg">
                                Login to Account
                            </button>
                        </form>

                        <div className=" pt-4 border-t border-gray-50 flex flex-col items-center gap-4">
                            <p className="text-gray-400 font-medium text-sm">New to Fantasy?</p>
                            <Link to="/signup" className="  text-indigo-600 font-extrabold text-center hover:text-black  transition-colors ">
                                Create Trading Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )

}
export default Login