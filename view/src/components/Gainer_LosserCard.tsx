import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import useCoinContext from "../hooks/useCoinsDetails";

function Gainer_LosserCard({ typ, coin }) {
    const navigate = useNavigate();
    const { coinsData } = useCoinContext();
    
    const details = coinsData?.find((ele) => ele.symbol === coin?.coin);

    if (!typ || !details || !coin) {
        return
    }

    return (
        <div 
            onClick={() => navigate(`/coin/${details.symbol}`)} 
            className={`group flex items-center justify-between p-2 sm:p-2.5 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                typ === "gainer" 
                    ? "hover:border-emerald-200 hover:bg-emerald-50/40" 
                    : "hover:border-rose-200 hover:bg-rose-50/40"
            }`}
        >
            {/* Left Side: Image & Name */}
            <div className="flex items-center min-w-0 gap-2 sm:gap-3 pr-2">
                <img src={details.image} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-contain shrink-0 group-hover:scale-110 transition-transform duration-300" alt={details.name}/>
                <div className="flex flex-col min-w-0">
                    <p className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                        {details.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider truncate">
                        {details.symbol}
                    </p>
                </div>
            </div>

            {/* Right Side: Price & Percent */}
            <div className="flex flex-col items-end shrink-0">
                <p className="font-bold text-xs sm:text-sm text-slate-800">
                    ₹{Number(coin.currentPrice).toLocaleString('en-IN', { maximumFractionDigits: 4 })}
                </p>
                <p className={`text-[10px] sm:text-xs font-bold ${
                    typ === "gainer" ? "text-emerald-500" : "text-rose-500"
                }`}>
                    {typ === "gainer" ? "+" : ""}{Number(coin.changePercent).toFixed(2)}%
                </p>
            </div>
        </div>
    );
}

export default Gainer_LosserCard;