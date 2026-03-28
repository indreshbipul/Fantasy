import { useNavigate } from "react-router-dom"

function Landing() {
    const navigate = useNavigate()
    
    return (
        <div className=  "font-sans">
            
            {/* --- Hero Section with Ambient Glow --- */}
            <section className="relative p-15 pb-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">
                {/* Background ambient gradients */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/50 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/30 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-5xl mx-auto relative z-10 mt-10">
                    <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-slate-900 mb-6 tracking-wide">
                        Fan<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">tasy </span> 
                        <span className="block ">Exchange</span>
                    </h1>
                    
                    <h2 className="text-2xl md:text-4xl font-extrabold text-slate-700 tracking-tight mb-8">
                        Trade Smarter, Not Harder.
                    </h2>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-20">
                        <button 
                            onClick={() => { navigate('/account') }} 
                            className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_60px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                        >
                            Get Started
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                        <button 
                            onClick={() => { navigate('/market') }} 
                            className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all hover:-translate-y-1 active:scale-95 shadow-sm"
                        >
                            Explore Market
                        </button>
                    </div>
                </div>
            </section>

            {/* --- Platform Tools (UPDATED Bento Grid) --- */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-slate-100 relative">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Tools</span></h2>
                    <p className="mt-4 text-slate-500 font-medium text-lg">Five powerful ways to dominate the markets.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[1fr]">
                    
                    {/* 1. AI Insights (Wide Dark Card) */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 border border-slate-700 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/30 transition-colors"></div>
                        <div className="relative z-10 h-full flex flex-col justify-center">
                            <div className="w-14 h-14 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 rounded-2xl flex items-center justify-center mb-6 shadow-inner backdrop-blur-md">
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 className="text-3xl font-black mb-3 text-white tracking-tight">AI Insights</h3>
                            <p className="text-slate-300 leading-relaxed font-medium">
                                Predictive market sentiment and automated technical analysis. Let our algorithms process the news and charts for you.
                            </p>
                        </div>
                    </div>

                    {/* 2. Paper Trading */}
                    <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100 hover:bg-emerald-50 hover:shadow-xl hover:shadow-emerald-100 hover:-translate-y-1 transition duration-300 flex flex-col">
                        <div className="w-12 h-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-slate-900">Paper Trading</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-4">Learn without risk. Your account receives a fresh <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">₹10,000</span> virtual balance every week on the Basic plan.</p>
                    </div>

                    {/* 3. Real Trading */}
                    <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100 hover:bg-indigo-50 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition duration-300 flex flex-col">
                        <div className="w-12 h-12 bg-white text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-slate-900">Real Trading</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Execute live trades with direct local payments and ultra-low fees. Built for speed and maximum security.</p>
                    </div>

                    {/* 4. Agentic AI (Buy, Sell, Check Assets) */}
                    <div className="col-span-1 md:col-span-2 bg-fuchsia-50/50 p-8 rounded-[2.5rem] border border-fuchsia-100 hover:bg-fuchsia-100/50 hover:shadow-xl hover:shadow-fuchsia-100 hover:-translate-y-1 transition duration-300 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 bg-white text-fuchsia-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-fuchsia-100">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2 text-slate-900">Agentic Trading</h3>
                            <p className="text-slate-500 font-medium">Chat with your portfolio. Tell our AI agent to <span className="text-slate-800 font-bold bg-white px-2 py-0.5 rounded shadow-sm">"Buy,"</span> <span className="text-slate-800 font-bold bg-white px-2 py-0.5 rounded shadow-sm">"Sell,"</span> or <span className="text-slate-800 font-bold bg-white px-2 py-0.5 rounded shadow-sm">"Check my assets"</span> and watch it execute instantly.</p>
                        </div>
                    </div>

                    {/* 5. Real Time Price Updates */}
                    <div className="col-span-1 md:col-span-2 bg-amber-50/50 p-8 rounded-[2.5rem] border border-amber-100 hover:bg-amber-100/50 hover:shadow-xl hover:shadow-amber-100 hover:-translate-y-1 transition duration-300 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 bg-white text-amber-500 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-amber-100">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2 text-slate-900">Real-Time Sync</h3>
                            <p className="text-slate-500 font-medium">Never miss a tick. Get live, millisecond-level price updates directly to you to catch every market movement.</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* --- FAQ Section --- */}
            <section className="max-w-3xl mx-auto px-4 sm:px-6 py-24 border-t border-slate-100">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
                </div>
                
                <div className="space-y-4">
                    <details className="group bg-slate-50 border border-slate-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden overflow-hidden hover:border-indigo-300 transition-colors">
                        <summary className="flex justify-between items-center font-bold text-lg cursor-pointer p-6 bg-transparent text-slate-800">
                            Is Fantasy AI free to use?
                            <span className="text-indigo-600 bg-indigo-100 w-8 h-8 flex items-center justify-center rounded-full group-open:rotate-180 transition-transform duration-300">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                            </span>
                        </summary>
                        <div className="px-6 pb-6 text-slate-600 font-medium text-sm leading-relaxed border-t border-slate-200/50 mt-2 pt-4">
                            Yes, basic AI insights are free for all active traders. Advanced predictive signals require a Pro subscription which will launch soon.
                        </div>
                    </details>

                    <details className="group bg-slate-50 border border-slate-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden overflow-hidden hover:border-indigo-300 transition-colors">
                        <summary className="flex justify-between items-center font-bold text-lg cursor-pointer p-6 bg-transparent text-slate-800">
                            How does Paper Trading work?
                            <span className="text-indigo-600 bg-indigo-100 w-8 h-8 flex items-center justify-center rounded-full group-open:rotate-180 transition-transform duration-300">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                            </span>
                        </summary>
                        <div className="px-6 pb-6 text-slate-600 font-medium text-sm leading-relaxed border-t border-slate-200/50 mt-2 pt-4">
                            It uses real-time market data but virtual money, allowing you to learn the terminal without losing real capital. You can reset your balance at any time with minimal cost.
                        </div>
                    </details>
                </div>
            </section>

            {/* --- Footer --- */}
            <footer className="bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    
                    <div className="text-center md:text-left">
                        <div className="text-3xl font-black mb-2 tracking-tighter text-white">
                            Fan<span className="text-indigo-500">tasy</span>
                        </div>
                        <p className="text-sm font-medium">© 2026 Fantasy Exchange. Secure. Fast. Intelligent.</p>
                    </div>
                    
                    <div className="flex gap-8 text-sm font-semibold">
                        <a href="#" className="hover:text-white hover:underline underline-offset-4 transition-all">Privacy</a>
                        <a href="#" className="hover:text-white hover:underline underline-offset-4 transition-all">Terms</a>
                        <a href="#" className="hover:text-white hover:underline underline-offset-4 transition-all">Support</a>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all cursor-pointer">
                            <span className="font-bold text-lg">𝕏</span>
                        </div>
                        <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all cursor-pointer">
                            <span className="font-bold text-lg">in</span>
                        </div>
                    </div>
                    
                </div>
            </footer>

        </div>
    )
}

export default Landing