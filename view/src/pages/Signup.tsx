import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthServices from "../services/AuthServices"
import useAuth from "../hooks/useAuth"

function Signup(){
    const [firstName, setFirstName] = useState<string | null>()
    const [lastName, setLastName] = useState<string | null>()
    const [email, setEmail] = useState<string | null>()
    const [password, setPassword] = useState<string | null>()
    const [checked, setChecked] = useState(false)
    const [error, setError] = useState<string | null>()
    const {setContext_Error, setContext_Ok} = useAuth()
    const navigate = useNavigate()

    const handleSubmite = ()=>{
        if(!firstName || !lastName || !email, !password){
            setError("Please FIll the Details")
            return
        }
        if(!checked){
            setError("Please check Terms of Service and Privacy Policy")
            return
        }
        const data = {
                "firstName" : firstName,
                "lastName" : lastName,
                "email" : email,
                "password" : password
            }
        AuthServices.signup(data)
        .then(({res,status})=>{
            if(status != 200 && status != 201){
                setError(res.message)
                return
            }
            setError("")
            setContext_Ok({res: "Signup", message : `Register Sucessfully`})
            navigate('/login')
        })
        .catch((err)=>{
            setContext_Error({res : "Signup", message : "Please try agian in a Moment"})
        })
    }
    return (
        <div className="antialiased text-[#0F172A] bg-gray-100">

            <main className="max-w-[1200px] mx-auto px-6 py-6 grid lg:grid-cols-2 gap-20 items-center">
                
                <div className="space-y-8 md:mb-15">
                    <h1 className="text-6xl font-[900] tracking-tighter leading-[0.95]">
                        Start your <br/>
                        <span className="text-indigo-600">Journey</span> here.
                    </h1>
                    <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-sm">
                        Join thousands of modern investors. Access real-time data and high-speed execution.
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-gray-50">
                    {error &&(
                        <div className="text-center text-sm text-rose-400 font-black mb-2">{error}</div>
                    )}
                    <h2 className="text-3xl text-indigo-600 font-extrabold tracking-tight mb-2">Create Account</h2>
                    <p className="text-gray-400 font-medium mb-4 text-sm">Fill in your details to get started.</p>

                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">First Name</label>
                                <input onChange={(e)=>{setFirstName(e.target.value)}} type="text" placeholder="John" 
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-[#6366F1] outline-none transition-all font-semibold placeholder:text-gray-300"/>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Last Name</label>
                                <input onChange={(e)=>{setLastName(e.target.value)}} type="text" placeholder="Doe" 
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-[#6366F1] outline-none transition-all font-semibold placeholder:text-gray-300"/>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Email Address</label>
                            <input onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="name@example.com" 
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-[#6366F1] outline-none transition-all font-semibold placeholder:text-gray-300"/>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Password</label>
                            <input onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="••••••••••••" 
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-[#6366F1] outline-none transition-all font-semibold placeholder:text-gray-300"/>
                        </div>

                        <div className="flex items-start gap-3 py-2">
                            <input onChange={(e)=>{setChecked(e.target.checked)}} type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-[#6366F1] focus:ring-[#6366F1]"/>
                            <p className="text-xs text-gray-500 font-medium leading-normal">
                                I agree to the <a href="#" className="text-[#6366F1] font-bold">Terms of Service</a> and <a href="#" className="text-[#6366F1] font-bold">Privacy Policy</a>.
                            </p>
                        </div>

                        <button onClick={(e)=>{e.preventDefault(), handleSubmite()
                        }} className="w-full bg-[#0F172A] text-white font-bold py-5 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 hover:cursor-pointer transition-all mt-2 text-lg">
                            Start Trading Now
                        </button>
                    </form>

                    <div className=" pt-4 border-t border-gray-50 text-center">
                        <p className="text-gray-500 font-semibold text-sm">
                            Already have an account? <Link to="/login" className="text-[#6366F1] font-[800] ml-1">Login here</Link>
                        </p>
                    </div>
                </div>
            </main>

        </div>
    )
}
export default Signup