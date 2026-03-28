import { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";
import UserServices from "../services/UserServices";
import useAuth from "../hooks/useAuth";

export default function Orders() {
    const accountType = localStorage.getItem("accountType") || "PAPER"
    const [orders, setOrders] = useState();
    const {setContext_Error} = useAuth()
    useEffect(()=>{
        UserServices.getOrders({accountType})
        .then(({res,status})=>{
            if(status !== 200){
                setContext_Error({req : "Orders", message : res.message});
            }
            setOrders(res.data)
        })
        .catch((err)=>{
            setContext_Error({req : "Orders", message : "Please try again in a moment" })
        })
        
    },[])


    return (
        <div className="text-slate-900 min-h-screen pb-12 font-sans antialiased">
            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-6">

                {/* --- Header --- */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">All Orders</h1>
                        <p className="text-slate-500 font-medium text-sm mt-1">View and manage all your trading activity in one place.</p>
                    </div>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Search Pair..." 
                            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm transition-all"
                        />
                        <button className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-colors text-slate-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>
                    </div>
                </div>

                {/* --- Main Table Container --- */}
 
                <div className="bg-transparent md:bg-white rounded-[2.5rem] border-transparent md:border-gray-100 md:shadow-sm overflow-hidden">
                    
                    <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            
                            {/* Table Header */}
                            <thead className="bg-slate-50/80 border-b border-slate-100 hidden md:table-header-group">
                                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <th className="py-4 pl-6 sm:pl-8">Date</th>
                                    <th className="py-4 px-4">Pair</th>
                                    <th className="py-4 px-4">Side</th>
                                    <th className="py-4 px-4">Price</th>
                                    <th className="py-4 px-4">Amount</th>
                                    <th className="py-4 px-4">Total</th>
                                    <th className="py-4 px-4">Status</th>
                                    <th className="py-4 pr-6 sm:pr-8 text-right">Details</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm font-bold text-slate-900">
                                
                                {/* ========================================================= */}
                                {/*  ROW (Default State)                                      */}
                                {/* ========================================================= */}
                                
                                {orders &&(
                                    orders.map((order) =>{
                                        return <OrderCard order={order} key={order?.orderRef} />
                                    })
                                )}
                                    

                            </tbody>
                        </table>
                    </div>
                    
                    {/* Load More Footer */}
                    <div className="py-5 border-t border-slate-100 flex justify-center bg-slate-50/50">
                        <button className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors px-6 py-2 rounded-lg hover:bg-indigo-50">
                            Load Older Orders
                        </button>
                    </div>
                </div>

            </main>
        </div>
    )
}