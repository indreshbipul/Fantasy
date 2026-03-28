import { Link } from "react-router-dom";
import useStream from "../hooks/useStream";

function DashboardCard({ coin }) {
    const { marketStream } = useStream();

    if (!coin) return null;
    const symbolKey = coin.symbol.toUpperCase();
    const liveData = marketStream?.latestTickers?.[symbolKey];
    if(!liveData){
        return null
    }

    // Finding Live Data form Market Stream
    const currentPrice = liveData?.currentPrice  ?? 0;
    const priceChange = liveData?.changePercent ?? 0;
    const volume = liveData?.volume24h ?? 0;
    const displayPrice = (currentPrice).toFixed(3);
    
    // Determine color based on whether change is positive or negative
    const isPositive = priceChange > 0;
    const colorClass = isPositive ? "text-green-600" : "text-red-600";
    const sign = isPositive ? "+" : "";

    return (
        <Link to={`/coin/${coin.symbol}`} className="bg-white rounded-lg shadow-md p-4 sm:p-5 hover:shadow-lg transition-shadow duration-200 block">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center min-w-0 gap-3 sm:gap-4 pr-4">
                    <img src={coin.image} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shrink-0" alt={coin.name} />
                    <div className="flex flex-col min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                            {coin.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 font-bold uppercase">
                            {symbolKey}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                    <p className="text-base sm:text-lg font-bold text-gray-800">
                        ₹{displayPrice}
                    </p>
                    <p className={`text-xs sm:text-sm ${colorClass} font-bold`}>
                        {sign}{Number(priceChange).toFixed(3)}%
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default DashboardCard;