import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import WalletService from "../services/WalletServices";
import TransactionCard from "../components/TransactionCard";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState();
    const [activeFilter, setActiveFilter] = useState('ALL');
    const accountType = localStorage.getItem("accountType");
    const {setContext_Error} = useAuth()

    useEffect(()=>{
        WalletService.getTransactions({accountType})
        .then(({res, status})=>{
            if(status !== 200){
                setContext_Error({req : "Transaction", message : res.message});
                return;
            }
            setTransactions(res.data);
        })
        .catch((err)=>{
            // setLoading(false)
            setContext_Error({req : "Transaction", message : "Please try again in a moment"});
        })
    },[]) 

    return (
        <div className="min-h-screen bg-slate-50 antialiased py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                
                {/* --- Page Header --- */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">Transaction History</h1>
                        <p className="mt-2 text-sm font-medium text-slate-500">View and track all your account activity.</p>
                    </div>

                    <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm w-full sm:w-auto">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download CSV
                    </button>
                </div>

                {/* --- Main Content Area --- */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                    
                    {/* Fixed Filter Bar - Fixed Mobile Cutoff Issue */}
                    <div className="border-b border-slate-100 bg-slate-50/50 w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] hidden md:block">
                        {/* Added w-max and pr-4 so the last button has padding on the right when swiped on mobile */}
                        <div className="flex gap-2 p-3 px-4 sm:px-6 w-max">
                            <button className="px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all bg-slate-900 text-white shadow-md">ALL</button>
                            <button className="px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all bg-white border border-slate-200 text-slate-500 hover:bg-slate-100">DEPOSIT</button>
                            <button className="px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all bg-white border border-slate-200 text-slate-500 hover:bg-slate-100">WITHDRAW</button>
                            <button className="px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all bg-white border border-slate-200 text-slate-500 hover:bg-slate-100">TRADE</button>
                            {/* Invisible spacer ensures mobile scroll doesn't hug the right edge */}
                            <div className="w-2 sm:hidden shrink-0"></div>
                        </div>
                    </div>

                    {/* Transaction List */}
                    <div className="flex-1 overflow-y-auto bg-white">
                        <div className="flex flex-col">
                            
                            {/* Transaction Cards */}
                            {transactions &&(
                                transactions?.map((txn) =>{
                                    return <TransactionCard key = {txn?.transactionRef} transaction = {txn} />
                                })
                            )}
                            

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}