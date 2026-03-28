import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserServices from "../services/UserServices";
import useAuth from "../hooks/useAuth";
// Import your services and hooks if you need to use them here
// import UserServices from "../services/UserServices";

function VerifyAccount() {
    const navigate = useNavigate();
    const phoneRef = useRef(null);
    const locationRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {user, setContext_Error, setContext_Ok} = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const payload = {
            mobile : phoneRef.current.value,
            location : locationRef.current.value,
        }
        UserServices.verifyProfile(payload)
        .then(({res, status})=>{
            setIsSubmitting(false)
            if(status !== 200){
                setContext_Error({req : "Profile Validation", message : res.message});
                return             
            }
            setContext_Ok({req : "Profile Validation", message : res.message})
            navigate('/profile')
        })
        .catch(err =>{
            setIsSubmitting(false)
            setContext_Error({req : "Profile Validation", message : "Please try again in a moment"})
        })
    };
    if(user && user.status === "VERIFIED"){
        navigate("/profile")
    }
    return (
        <div className="min-h-screen flex items-start md:pt-11 justify-center font-sans relative overflow-hidden">
            
            {/* Background   */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>

            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 relative z-10">
                
                {/* Header Icon */}
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner rotate-3">
                    <svg className="w-8 h-8 -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                    Secure Your Account
                </h2>
                <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                    You're almost there! We just need your location and phone number to verify your identity and unlock trading features.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Location Field */}
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 ml-1">
                            Current Location
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <input ref={locationRef} type="text" required placeholder="e.g. Mumbai, India" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all"/>
                        </div>
                    </div>

                    {/* Phone Number Field */}
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 ml-1">
                            Mobile Number
                        </label>
                        <div className="relative flex items-center">
                            <div className="absolute left-0 top-0 bottom-0 px-4 bg-slate-100 border-y border-l border-slate-200 rounded-l-xl flex items-center justify-center text-slate-600 font-bold">
                                +91
                            </div>
                            <input ref={phoneRef} type="tel" required pattern="[0-9]{10}" placeholder="Enter 10 digit number" className="w-full pl-16 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all"/>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" disabled={isSubmitting} className="w-full mt-4 py-4 bg-slate-900 hover:bg-indigo-600 text-white font-extrabold text-base rounded-xl shadow-lg shadow-slate-200 hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>Verifying...
                            </>
                        ) : (
                            "Verify Account"
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
}

export default VerifyAccount;