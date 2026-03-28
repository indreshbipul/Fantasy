
function TransactionCard({transaction}) {

    function dateFormatter(date){
        const dates = new Date(date)
        const formatted = new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata"
        }).format(dates);
        return formatted
    }

    return (
        <div>
            {/* ========================================================================= */}
            {/* STATIC CARD 1: DEPOSIT (SUCCESS)                                          */}
            {/* ========================================================================= */}
            {transaction?.type === "DEPOSIT" && (
                <div className="p-4 sm:p-6 border-b border-slate-100 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row gap-4 sm:items-center">
                
                    {/* 1. Icon & Title & Mobile Amount */}
                    <div className="flex justify-between items-start sm:w-[35%]">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900 leading-none">Deposit {transaction?.asset}</h4>
                                <div className="flex items-center gap-1 mt-1.5 text-slate-400">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    <span className="text-[10px] font-bold tracking-widest uppercase truncate max-w-[100px] sm:max-w-none">{transaction?.transactionRef}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Mobile Only: Amount & Status */}
                        <div className="sm:hidden text-right shrink-0 ml-2">
                            <p className="text-base font-black tabular-nums tracking-tight text-emerald-600">+₹{transaction?.amount}</p>
                            <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded border bg-emerald-50 text-emerald-600 border-emerald-200">{transaction?.status}</span>
                        </div>
                    </div>

                    {/* 2. Flat Metadata (Date / Remark) */}
                    <div className="grid grid-cols-2 sm:flex sm:flex-1 sm:justify-end gap-4 sm:gap-8 sm:pr-8">
                        <div className="flex flex-col">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Initiated At</p>
                            <p className="text-xs font-bold text-slate-700">{dateFormatter(transaction?.initiatedAt)}</p>
                        </div>
                        <div className="flex flex-col sm:w-[150px]">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Remark</p>
                            <p className="text-xs font-bold text-slate-700 truncate">{transaction?.remark}</p>
                        </div>
                    </div>

                    {/* 3. Desktop Only: Amount & Status */}
                    <div className="hidden sm:block text-right shrink-0 sm:w-[20%]">
                        <p className="text-lg font-black tabular-nums tracking-tight text-emerald-600">+₹{transaction?.amount}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded border bg-emerald-50 text-emerald-600 border-emerald-200">{transaction?.status}</span>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* STATIC CARD 2: TRADE (BUY)                                                */}
            {/* ========================================================================= */}
            {transaction?.type === "BUY"  &&(
                <div className="p-4 sm:p-6 border-b border-slate-100 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row gap-4 sm:items-center">
    
                    {/* 1. Icon & Title */}
                    <div className="flex justify-between items-start sm:w-[35%]">
                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* Dynamic Icon Color based on BUY/SELL */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${transaction?.type === 'BUY' ? 'bg-indigo-100 text-indigo-600' : 'bg-rose-100 text-rose-600'}`}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                            </div>
                            <div>
                                {/* Dynamically says "Bought SUN" or "Sold SUN" */}
                                <h4 className="text-sm font-black text-slate-900 leading-none">
                                    {transaction?.type === 'BUY' ? 'Bought' : 'Sold'} {transaction?.quoteSymbol}
                                </h4>
                                <div className="flex items-center gap-1 mt-1.5 text-slate-400">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    <span className="text-[10px] font-bold tracking-widest uppercase truncate max-w-[100px] sm:max-w-none">
                                        {transaction?.transactionRef}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Mobile Only: Amount */}
                        <div className="sm:hidden text-right shrink-0 ml-2">
                            <p className={`text-base font-black tabular-nums tracking-tight ${transaction?.type === 'BUY' ? 'text-indigo-600' : 'text-rose-600'}`}>
                                {transaction?.type === 'BUY' ? '+' : '-'}{Number(transaction?.amount).toLocaleString()} {transaction?.asset}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                                {transaction?.quoteSymbol}/{transaction?.asset}
                            </p>
                        </div>
                    </div>

                    {/* 2. Metadata Grid */}
                    <div className="grid grid-cols-2 sm:flex sm:flex-1 sm:justify-end gap-4 sm:gap-8 sm:pr-8 mb-2">
                        <div className="flex flex-col">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Executed At</p>
                            <p className="text-xs font-bold text-slate-700">{dateFormatter(transaction?.initiatedAt)}</p>
                        </div>
                        <div className="flex flex-col sm:w-[150px]">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Remark</p>
                            {/* Uses exactly what your backend sends: "Market Mode" */}
                            <p className="text-xs font-bold text-slate-700 truncate">{transaction?.remark}</p>
                        </div>
                    </div>

                    {/* 3. Desktop Only: Amount & Status */}
                    <div className="hidden sm:block text-right shrink-0 sm:w-[20%]">
                        <p className={`text-lg font-black tabular-nums tracking-tight ${transaction?.type === 'BUY' ? 'text-indigo-600' : 'text-rose-600'}`}>
                            {transaction?.type === 'SELL' ? '+' : '-'}{Number(transaction?.amount).toLocaleString()} {transaction?.asset}
                        </p>
                        <div className="flex flex-col items-end">
                            <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded border ${
                                transaction?.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                transaction?.status === 'FAILED' ? 'bg-rose-50 text-rose-600 border-rose-200' : 
                                'bg-amber-50 text-amber-600 border-amber-200'
                            }`}>
                                {transaction?.status}
                            </span>
                            <p className="text-[10px] font-bold text-slate-400 mt-1">
                                Market: {transaction?.quoteSymbol}/{transaction?.asset}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* STATIC CARD 3: TRADE (SELL)                                                */}
            {/* ========================================================================= */}
            {transaction?.type === "SELL"  &&(
                <div className="p-4 sm:p-6 border-b border-slate-100 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row gap-4 sm:items-center">
    
                    {/* 1. Icon & Title */}
                    <div className="flex justify-between items-start sm:w-[35%]">
                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* Dynamic Icon Color based on BUY/SELL */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${transaction?.type === 'BUY' ? 'bg-indigo-100 text-indigo-600' : 'bg-rose-100 text-rose-600'}`}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                            </div>
                            <div>
                                {/* Dynamically says "Bought SUN" or "Sold SUN" */}
                                <h4 className="text-sm font-black text-slate-900 leading-none">
                                    {transaction?.type === 'BUY' ? 'Bought' : 'Sold'} {transaction?.quoteSymbol}
                                </h4>
                                <div className="flex items-center gap-1 mt-1.5 text-slate-400">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    <span className="text-[10px] font-bold tracking-widest uppercase truncate max-w-[100px] sm:max-w-none">
                                        {transaction?.transactionRef}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Mobile Only: Amount */}
                        <div className="sm:hidden text-right shrink-0 ml-2">
                            <p className={`text-base font-black tabular-nums tracking-tight ${transaction?.type === 'BUY' ? 'text-indigo-600' : 'text-rose-600'}`}>
                                {transaction?.type === 'BUY' ? '+' : '-'}{Number(transaction?.amount).toLocaleString()} {transaction?.asset}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                                {transaction?.quoteSymbol}/{transaction?.asset}
                            </p>
                        </div>
                    </div>

                    {/* 2. Metadata Grid */}
                    <div className="grid grid-cols-2 sm:flex sm:flex-1 sm:justify-end gap-4 sm:gap-8 sm:pr-8">
                        <div className="flex flex-col">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Executed At</p>
                            <p className="text-xs font-bold text-slate-700">{dateFormatter(transaction?.initiatedAt)}</p>
                        </div>
                        <div className="flex flex-col sm:w-[150px]">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Remark</p>
                            {/* Uses exactly what your backend sends: "Market Mode" */}
                            <p className="text-xs font-bold text-slate-700 truncate">{transaction?.remark}</p>
                        </div>
                    </div>

                    {/* 3. Desktop Only: Amount & Status */}
                    <div className="hidden sm:block text-right shrink-0 sm:w-[20%]">
                        <p className={`text-lg font-black tabular-nums tracking-tight ${transaction?.type === 'BUY' ? 'text-indigo-600' : 'text-rose-600'}`}>
                            {transaction?.type === 'BUY' ? '+' : '-'}{Number(transaction?.amount).toLocaleString()} {transaction?.asset}
                        </p>
                        <div className="flex flex-col items-end">
                            <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded border ${
                                transaction?.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                transaction?.status === 'FAILED' ? 'bg-rose-50 text-rose-600 border-rose-200' : 
                                'bg-amber-50 text-amber-600 border-amber-200'
                            }`}>
                                {transaction?.status}
                            </span>
                            <p className="text-[10px] font-bold text-slate-400 mt-1">
                                Market: {transaction?.quoteSymbol}/{transaction?.asset}
                            </p>
                        </div>
                    </div>
                </div>
            )}


            {/* ========================================================================= */}
            {/* STATIC CARD 4: WITHDRAWAL (FAILED)                                        */}
            {/* ========================================================================= */}
            {transaction?.type === "WITHDRAW" &&(
                <div className="p-4 sm:p-6 border-b border-slate-100 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row gap-4 sm:items-center bg-rose-50/10">
                
                    <div className="flex justify-between items-start sm:w-[35%]">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900 leading-none">Withdrawal INR</h4>
                                <div className="flex items-center gap-1 mt-1.5 text-slate-400">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    <span className="text-[10px] font-bold tracking-widest uppercase truncate max-w-[100px] sm:max-w-none">TXN-1109D442</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="sm:hidden text-right shrink-0 ml-2">
                            <p className="text-base font-black tabular-nums tracking-tight text-slate-900">-₹15,000</p>
                            <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded border bg-rose-50 text-rose-600 border-rose-200">FAILED</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:flex sm:flex-1 sm:justify-end gap-4 sm:gap-8 sm:pr-8">
                        <div className="flex flex-col">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Initiated At</p>
                            <p className="text-xs font-bold text-slate-700">Mar 4, 06:45 PM</p>
                        </div>
                        <div className="flex flex-col sm:w-[150px]">
                            <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-0.5">Remark</p>
                            <p className="text-xs font-bold text-rose-600 truncate">Bank Name Mismatch</p>
                        </div>
                    </div>

                    <div className="hidden sm:block text-right shrink-0 sm:w-[20%]">
                        <p className="text-lg font-black tabular-nums tracking-tight text-slate-900">-₹15,000.00</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded border bg-rose-50 text-rose-600 border-rose-200">FAILED</span>
                    </div>
                </div>
            )}
        </div>
  )
}

export default TransactionCard