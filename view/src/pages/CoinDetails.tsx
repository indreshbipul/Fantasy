import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import useCoinDetails from "../hooks/useCoinsDetails";
import useStream from "../hooks/useStream";
import coinServices from "../services/CoinServices";
import useAuth from "../hooks/useAuth";
import TradeCard from "../components/TradeCard";

function Coin() {
    const { coinSymbol } = useParams();
    const [coin, setCoin] = useState<any | null>(null);
    const { coinsData } = useCoinDetails();
    const { coinStream, subscribe, marketStream } = useStream();
    const {setContext_Error, user} = useAuth();

    const targetSymbol = coinSymbol?.toUpperCase() || "";

    useEffect(() => {
        if (!coinSymbol) return;
        coinServices.coinDetails(coinSymbol)
            .then(({ res }) => setCoin(res?.data))
            .catch(err => console.error(err));

    }, [coinSymbol]);

    const coinData = useMemo(() => {
        if (!coinsData || !coinSymbol) return null;
        return coinsData.find(c => c.symbol?.toLowerCase() === coinSymbol.toLowerCase());
    }, [coinsData, coinSymbol]);

    
    let liveCoinData
    if(marketStream){
        liveCoinData = marketStream?.latestTickers[targetSymbol]
    }

    if (!coinsData || !coinData || !coin || !marketStream) return <Loader />;

    return (
        <div className="min-h-screen p-4 md:p-6 text-slate-800 bg-gray-50 font-sans">
            <div className="max-w-[1400px] mx-auto space-y-6">
                
                {/* 1. HEADER SECTION */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shrink-0">
                            <img src={coinData.image} className="w-10 h-10" alt={coinData.name} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl md:text-3xl font-black">{coinData.name}</h1>
                                <span className="text-slate-400 font-bold tracking-tight">{targetSymbol}</span>
                            </div>
                            <div className="flex gap-2 mt-1">
                                <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded uppercase tracking-tighter">Rank #{coin?.rank || "N/A"}</span>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase">Nerd Stat: {coin?.nerd_stat?.toFixed(4)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="md:border-l border-slate-100 md:pl-8 text-right md:text-left w-full md:w-auto">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Price</p>
                        <div className="flex items-baseline gap-3 justify-end md:justify-start">
                            <span className="text-4xl font-black">₹{liveCoinData?.currentPrice?.toLocaleString() || "0.00"} </span>
                            <span className={`text-sm font-bold ${liveCoinData?.changePercent > 0 ? "text-green-500" : "text-red-500"}`}>
                                {liveCoinData?.changePercent > 0 ? '▲' : '▼'} {Math.abs(liveCoinData?.changePercent || 0).toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. MAIN LAYOUT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                    
                    {/* LEFT COLUMN: Graph & About (Spans 2 cols on LG, 3 cols on XL) */}
                    <div className="lg:col-span-2 xl:col-span-3 space-y-6">
                        
                        {/* A. GRAPH PLACEHOLDER */}
                        <div className="bg-white min-h-[500px] rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
                            <div className="absolute top-6 left-8 flex items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic underline decoration-blue-500 underline-offset-4 tracking-wider">Live Market Data</span>
                            </div>
                            <div className="opacity-[0.03] pointer-events-none select-none text-[12rem] font-black text-slate-900 absolute uppercase rotate-12">{targetSymbol}</div>
                            <p className="text-slate-400 z-10 font-semibold tracking-wide">TradingView Chart Integration Pending...</p>
                        </div>

                        {/* B. ASSET OVERVIEW (Moved here to fill space) */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                                <h3 className="text-xl font-bold italic text-slate-800">Overview</h3>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                <div className="xl:col-span-2 space-y-6">
                                    <div className="text-slate-600 leading-relaxed text-sm space-y-4 text-justify">
                                        {coinData.description ? (
                                            coinData.description.split('\n').map((p: string, i: number) => p.trim() && <p key={i}>{p}</p>)
                                        ) : (
                                            <p className="italic text-slate-400 font-medium">Analyzing fundamental data for {coinData.name}...</p>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {coinData.tags?.map((tag: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-blue-50/50 text-blue-500 text-[9px] font-black uppercase rounded-lg border border-blue-100 tracking-wider">
                                                #{tag.replace(/_/g, ' ')}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                                        {coin?.website && <SocialButton href={coin.website} label="Website" icon="globe" />}
                                        {coin?.whitepaper_url && <SocialButton href={coin.whitepaper_url} label="Whitepaper" icon="file" />}
                                        {coin?.github_url && <SocialButton href={coin.github_url} label="GitHub" icon="github" />}
                                        {coin?.explorers && <SocialButton href={coin.explorers.split(',')[0]} label="Explorer" icon="link" />}
                                    </div>
                                </div>

                                {/* Integrated Social Card */}
                                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative overflow-hidden h-fit">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Latest Stream</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-[10px]">
                                                {targetSymbol[0]}
                                            </div>
                                            <span className="text-xs font-black tracking-tight">@{coin?.x_handle || 'official'}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-4">
                                            "{coin?.x_message || "No recent broadcast updates."}"
                                        </p>
                                        <a href={coin?.x_url} target="_blank" rel="noreferrer" className="inline-block text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">
                                            View Thread →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar (Spans 1 col) */}
                    <div className="space-y-6">
                        {/* QUICK TRADE COMPONENT */}
                        <TradeCard symbol = {targetSymbol} />

                        {/* Metrics */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Metrics</h4>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] text-slate-400 font-black uppercase">Circulating Supply</span>
                                        <span className="text-xs font-black text-slate-800">{coin?.circulatingSupply?.toLocaleString() || "---"}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
                                            style={{ width: coin?.maxSupply ? `${(coin.circulatingSupply / coin.maxSupply) * 100}%` : '100%' }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                        <span>Max: {coin?.maxSupply?.toLocaleString() || " ∞"}</span>
                                        <span>Total: {coin?.totalSupply?.toLocaleString() || "---"}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <MetricRow label="Market Cap" value={`₹${coin?.marketCap?.toLocaleString()}`} highlight />
                                    <MetricRow label="FDV" value={`₹${coin?.fullDiluted_marketCap?.toLocaleString()}`} />
                                    <MetricRow label="24h Volume" value={`₹${parseFloat(coin?.volume_24h || 0).toLocaleString()}`} />
                                </div>
                            </div>
                        </div>

                        {/* PRICE RECORDS */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Price Records</h4>
                            <HistoryCard type="high" value={coin?.allTime_hp} />
                            <HistoryCard type="low" value={coin?.allTime_lp} date={coin?.allTimeLowDate} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// UI COMPONENTS
const MetricRow = ({ label, value, highlight }: any) => (
    <div className="flex justify-between items-center">
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{label}</span>
        <span className={`text-sm font-bold ${highlight ? "text-blue-600" : "text-slate-800"}`}>{value || "---"}</span>
    </div>
);

const HistoryCard = ({ type, value, date }: any) => (
    <div className={`flex items-center gap-3 p-3 rounded-2xl border ${type === 'high' ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 ${type === 'high' ? 'bg-green-500' : 'bg-red-500'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {type === 'high' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />}
            </svg>
        </div>
        <div>
            <p className="text-xs font-black text-slate-800">₹{value?.toLocaleString() || "---"}</p>
            <div className="flex flex-col">
                <span className={`text-[9px] font-bold uppercase tracking-widest ${type === 'high' ? 'text-green-600' : 'text-red-600'}`}>
                    {type === 'high' ? 'All Time High' : 'All Time Low'}
                </span>
                {date && <span className="text-[8px] text-slate-400 font-bold">{new Date(date).toLocaleDateString()}</span>}
            </div>
        </div>
    </div>
);

const SocialButton = ({ href, label, icon }: any) => (
    <a href={href} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all text-[9px] font-black uppercase tracking-widest">
        {icon === 'globe' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>}
        {icon === 'github' && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>}
        {icon === 'file' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        {icon === 'link' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
        {label}
    </a>
);

export default Coin;