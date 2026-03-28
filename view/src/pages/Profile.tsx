import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import UserServices from "../services/UserServices";
import Loader from "../components/Loader";

function Profile() {
    const { user, setContext_Error } = useAuth();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        UserServices.getProfile()
            .then(({ res, status }) => {
                if (status !== 200) {
                    setContext_Error({ req: "profile", message: res.message });
                    return;
                }
                setUserData(res.data);
            })
            .catch(() => {
                setContext_Error({ req: "profile", message: "Please try again in a moment" });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [user, setContext_Error]);

    if (isLoading) return <Loader />;

    return (
        <div className="min-h-screen   py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                
                <main className="space-y-8">
                    {/* Main Container */}
                    <div className="bg-white rounded-[2rem] p-6 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                        
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>

                        {/* Top Profile Banner */}
                        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6">
                            
                            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                                <div className="relative group">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white flex items-center justify-center border-4 border-slate-100 shadow-md transition-transform group-hover:scale-105">
                                        <span className="text-3xl sm:text-4xl font-black text-indigo-500">
                                            {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                                        </span>
                                    </div>
                                    <button className="absolute bottom-1 right-1 bg-slate-900 p-2.5 rounded-full text-white shadow-lg hover:bg-indigo-600 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                                    </button>
                                </div>
                                
                                <div className="space-y-1">
                                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                        {userData?.firstName} {userData?.lastName}
                                    </h2>
                                    <div className="flex items-center justify-center sm:justify-start gap-2">
                                        <span className={`w-2 h-2 rounded-full ${userData?.status === "UNVERIFIED" ? "bg-rose-500" : "bg-emerald-500"}`}></span>
                                        <p className={`text-sm font-bold uppercase tracking-wide ${userData?.status === "UNVERIFIED" ? "text-rose-500" : "text-emerald-600"}`}>
                                            {userData?.status}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setIsEditing(!isEditing)} 
                                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                {isEditing ? "Cancel Editing" : "Edit Profile"}
                            </button>
                        </div>

                        {/* Form Section */}
                        <div className="mt-10">
                            <h3 className="text-xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4 flex items-center gap-3">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                Personal Information
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                
                                {/* Left Column */}
                                <div className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">First Name</label>
                                        <input 
                                            type="text" 
                                            defaultValue={userData?.firstName} 
                                            disabled={!isEditing}
                                            className={`w-full px-5 py-3.5 rounded-xl font-bold transition-all outline-none ${isEditing ? 'bg-slate-50 border-2 border-indigo-100 focus:border-indigo-400 text-slate-900' : 'bg-slate-50/50 border border-slate-100 text-slate-600'}`}
                                        />
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            defaultValue={userData?.email} 
                                            disabled // Usually email shouldn't be freely edited
                                            className="w-full px-5 py-3.5 bg-slate-100 border border-slate-100 rounded-xl font-bold text-slate-500 cursor-not-allowed outline-none"
                                        />
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Location</label>
                                        <input 
                                            type="text" 
                                            placeholder="Add your location" 
                                            disabled={!isEditing}
                                            className={`w-full px-5 py-3.5 rounded-xl font-bold transition-all outline-none ${isEditing ? 'bg-slate-50 border-2 border-indigo-100 focus:border-indigo-400 text-slate-900' : 'bg-slate-50/50 border border-slate-100 text-slate-600'}`}
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Last Name</label>
                                        <input 
                                            type="text" 
                                            defaultValue={userData?.lastName} 
                                            disabled={!isEditing}
                                            className={`w-full px-5 py-3.5 rounded-xl font-bold transition-all outline-none ${isEditing ? 'bg-slate-50 border-2 border-indigo-100 focus:border-indigo-400 text-slate-900' : 'bg-slate-50/50 border border-slate-100 text-slate-600'}`}
                                        />
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Phone Number</label>
                                        <div className="flex">
                                            <span className={`px-4 py-3.5 font-bold rounded-l-xl border-r-0 transition-colors ${isEditing ? 'bg-slate-100 border-2 border-indigo-100 text-slate-600' : 'bg-slate-50/50 border border-slate-100 text-slate-500'}`}>
                                                +91
                                            </span>
                                            <input 
                                                type="text" 
                                                defaultValue={userData?.mobile}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3.5 rounded-r-xl font-bold transition-all outline-none ${isEditing ? 'bg-slate-50 border-2 border-l-0 border-indigo-100 focus:border-indigo-400 text-slate-900' : 'bg-slate-50/50 border border-slate-100 border-l-0 text-slate-600'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Action Buttons - Only show when editing is true */}
                            {isEditing && (
                                <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 animate-fade-in-up">
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors w-full sm:w-auto"
                                    >
                                        Cancel
                                    </button>
                                    <button className="px-10 py-3.5 bg-indigo-600 text-white font-extrabold rounded-xl shadow-lg shadow-indigo-200/50 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all w-full sm:w-auto">
                                        Save Changes
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Profile;