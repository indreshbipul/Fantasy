import { useState } from "react";

export default function RealDeposit() {
    const [accountTarget, setAccountTarget] = useState('PAPER'); 
    const [method, setMethod] = useState('UPI'); 
    const [realAmount, setRealAmount] = useState('');

    return (
        <div className="min-h-screen bg-slate-50 antialiased py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                
                {/* --- Page Header --- */}
                <div className="mb-8">
                    <button className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors mb-4">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Portfolio
                    </button>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Add Real Funds</h1>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-stretch">
                    
                    {/* LEFT COLUMN: REAL FORM */}
                    <div className="lg:col-span-7">
                        <div className="h-full bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col p-6 sm:p-8">
                            <div className="space-y-8">
                                
                                {/* Transfer Method */}
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Transfer Method</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div onClick={() => setMethod('UPI')} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${method === 'UPI' ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 hover:border-slate-200'}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${method === 'UPI' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 text-sm">UPI App</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Instant</p>
                                            </div>
                                        </div>
                                        <div onClick={() => setMethod('BANK')} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${method === 'BANK' ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 hover:border-slate-200'}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${method === 'BANK' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 text-sm">IMPS / NEFT</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">1-2 Hours</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Amount */}
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Deposit Amount</p>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">₹</span>
                                        <input 
                                            type="number" 
                                            value={realAmount}
                                            onChange={(e) => setRealAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-10 pr-4 text-2xl font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {[1000, 5000, 10000, 50000].map(val => (
                                            <button key={val} onClick={() => setRealAmount(val.toString())} className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors">
                                                + ₹{(val/1000)}k
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button 
                                disabled={!realAmount}
                                className="mt-10 w-full py-4 bg-emerald-600 disabled:bg-slate-300 disabled:text-slate-500 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg transition-all active:scale-95"
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: REAL RULES */}
                    <div className="lg:col-span-5">
                        <div className="h-full bg-slate-900 rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-slate-800 flex flex-col">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Deposit Instructions</h3>
                            
                            <div className="space-y-4">
                                <div className="border rounded-xl p-4 flex gap-3 items-start bg-rose-500/10 border-rose-500/20">
                                    <div className="mt-0.5 shrink-0 text-rose-400">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-rose-400">Strict Name Match Policy</h4>
                                        <p className="text-xs font-medium mt-1 leading-relaxed text-rose-200/80">
                                            Your bank account name must exactly match your KYC name. Third-party deposits are rejected and refunded.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-xs bg-emerald-500/20 text-emerald-400">1</div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-200">Generate Request</h4>
                                            <p className="text-xs font-medium text-slate-400 mt-1">Enter your amount and proceed to your banking app.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-xs bg-emerald-500/20 text-emerald-400">2</div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-200">Secure Transfer</h4>
                                            <p className="text-xs font-medium text-slate-400 mt-1">Complete the transfer via your chosen banking app or UPI provider securely.</p>
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