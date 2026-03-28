import React, { useState } from 'react';

function OrderCard({ order }) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    function dateFormatter(date) {
        if (!date) return "--";
        const dates = new Date(date);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata"
        }).format(dates);
    }
   
    return (
        <>
            {/* ==================================================================================== */}
            {/* 1. MOBILE VIEW (Visible ONLY on small screens: md:hidden)                            */}
            {/* ==================================================================================== */}
            <tr className="md:hidden block mb-4 border border-slate-200 rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
                <td className="block p-0" colSpan="8">
                    
                    {/* --- Mobile Summary Card (Always Visible) --- */}
                    <div onClick={() => setIsExpanded(!isExpanded)} className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                        
                        {/* Top Row: Icon, Pair, Date, and Badges */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isExpanded ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /> 
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm leading-none mb-1">{order?.quote}/{order?.base}</h4>
                                    <p className="text-[10px] font-bold text-slate-400">{dateFormatter(order?.initiated)}</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-1.5">
                                <div className="flex items-center gap-1.5">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                        order?.orderType === 'BUY' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-rose-600 bg-rose-50 border border-rose-100'
                                    }`}>
                                        {order?.orderType}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                        order?.status === 'SUCCESS' ? 'text-emerald-600 bg-emerald-50 border border-emerald-200' :
                                        order?.status === 'FAILED' ? 'text-rose-600 bg-rose-50 border border-rose-200' :
                                        'text-amber-600 bg-amber-50 border border-amber-200'
                                    }`}>
                                        {order?.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row: The Numbers Grid */}
                        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Price</span>
                                <span className="font-mono text-xs font-bold text-slate-700">₹{order?.price}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Amount</span>
                                <span className="font-mono text-xs font-bold text-slate-700">{order?.quantity}</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total</span>
                                <span className="font-mono text-xs font-black text-slate-900">₹{order?.amount}</span>
                            </div>
                        </div>

                        {/* Expand Chevron Centered at Bottom */}
                        <div className="flex justify-center mt-3 -mb-1">
                            <svg className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-indigo-500' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* --- Mobile Expanded Details --- */}
                    {isExpanded && (
                        <div className="p-4 border-t border-slate-100 bg-indigo-50/20 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Reference</span>
                                <span className="font-mono text-xs font-bold text-slate-800 break-all">{order?.orderRef || "--"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Execution Mode</span>
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest w-max">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                        {order?.orderMode || "MARKET"}
                                    </span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Remark</span>
                                    <span className="text-xs font-bold text-slate-700">{order?.remark || "Market Mode"}</span>
                                </div>
                            </div>
                            <div className="flex flex-col p-3 bg-white rounded-lg border border-slate-100">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold text-slate-400">Initiated:</span>
                                    <span className="text-[10px] font-bold text-slate-800 tabular-nums">{dateFormatter(order?.initiated)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-emerald-500">Updated:</span>
                                    <span className="text-[10px] font-bold text-slate-800 tabular-nums">{dateFormatter(order?.lastUpdate)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </td>
            </tr>


            {/* ==================================================================================== */}
            {/* 2. DESKTOP VIEW (Visible ONLY on md and above screens: hidden md:table-row)          */}
            {/* ==================================================================================== */}
            
            {/* --- Desktop Main Row --- */}
            <tr 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`hidden md:table-row transition-colors cursor-pointer group ${isExpanded ? 'bg-indigo-50/40' : 'border-b border-slate-100 hover:bg-slate-50'}`}
            >
                <td className="py-4 pl-8 text-slate-500 text-xs font-medium whitespace-nowrap">
                    {dateFormatter(order?.initiated)}
                </td>
                <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${isExpanded ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /> 
                            </svg>
                        </div>
                        <span className="font-bold text-slate-900 text-sm whitespace-nowrap">
                            {order?.quote}/{order?.base}
                        </span>
                    </div>
                </td>
                <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${
                        order?.orderType === 'BUY' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-rose-600 bg-rose-50 border border-rose-100'
                    }`}>
                        {order?.orderType}
                    </span>
                </td>
                <td className="py-4 px-4 font-mono tabular-nums text-slate-700 text-sm">
                    ₹{order?.price}
                </td>
                <td className="py-4 px-4 font-mono tabular-nums text-slate-700 text-sm whitespace-nowrap">
                    {order?.quantity} {order?.quote}
                </td>
                <td className="py-4 px-4 font-black tabular-nums text-slate-900 text-sm">
                    ₹{order?.amount}
                </td>
                <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${
                        order?.status === 'SUCCESS' ? 'text-emerald-600 bg-emerald-50 border border-emerald-200' :
                        order?.status === 'FAILED' ? 'text-rose-600 bg-rose-50 border border-rose-200' :
                        'text-amber-600 bg-amber-50 border border-amber-200'
                    }`}>
                        {order?.status}
                    </span>
                </td>
                <td className="py-4 pr-8 text-right">
                    <button className={`p-2 rounded-lg shadow-sm transition-all border ${isExpanded ? 'text-indigo-600 bg-white border-indigo-200 shadow-indigo-100' : 'text-slate-400 group-hover:text-slate-800 bg-transparent group-hover:bg-white border-transparent group-hover:border-slate-200'}`}>
                        <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </td>
            </tr>

            {/* --- Desktop Expanded Details --- */}
            {isExpanded && (
                <tr className="hidden md:table-row border-b border-slate-200 bg-slate-50/80 animate-in fade-in duration-200">
                    <td colSpan="8" className="p-0 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"></div>
                        
                        <div className="w-full py-6 pl-8 pr-8">
                            <div className="w-full flex bg-white border border-indigo-100/80 rounded-2xl shadow-sm overflow-hidden relative">
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                                <div className="flex-1 p-5 border-r border-slate-100 hover:bg-slate-50/50 transition-colors z-10">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Order Reference</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-black text-slate-800 font-mono truncate">{order?.orderRef || "--"}</span>
                                    </div>
                                </div>

                                <div className="flex-1 p-5 border-r border-slate-100 hover:bg-slate-50/50 transition-colors z-10">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Execution Mode</p>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest shadow-sm shadow-indigo-200">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                        {order?.orderMode || "MARKET"}
                                    </span>
                                </div>

                                <div className="flex-[1.5] p-5 border-r border-slate-100 hover:bg-slate-50/50 transition-colors z-10">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Processing Timeline</p>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <span className="block text-slate-400 text-[9px] font-black uppercase tracking-wider mb-0.5">Initiated</span>
                                            <span className="text-slate-800 font-bold text-xs">{dateFormatter(order?.initiated)}</span>
                                        </div>
                                        <div className="flex-1 h-px bg-slate-200 relative mt-2 min-w-[20px] mx-2">
                                            <div className="absolute right-0 -top-1 w-2 h-2 border-t border-r border-slate-300 rotate-45"></div>
                                        </div>
                                        <div className="relative">
                                            <span className="block text-emerald-500 text-[9px] font-black uppercase tracking-wider mb-0.5">Updated</span>
                                            <span className="text-slate-800 font-bold text-xs">{dateFormatter(order?.lastUpdate)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 p-5 bg-indigo-50/30 z-10">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Remark</p>
                                    <p className="text-xs font-bold text-slate-700">{order?.remark || "Market Mode"}</p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

export default OrderCard;