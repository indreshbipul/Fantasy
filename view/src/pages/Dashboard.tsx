import { useState } from "react";
import DashboardCard from "../components/DashboardCard";
import Gainer_LosserCard from "../components/Gainer_LosserCard";
import useCoinContext from "../hooks/useCoinsDetails";
import useStream from "../hooks/useStream";

const PRIORITY_COINS = [
  "Bitcoin", "Ethereum", "Tether", "BNB", "Solana", "Ripple", "USD Coin", 
  "Dogecoin", "Toncoin", "Cardano", "Shiba Inu", "Avalanche", "Tron", "Polkadot", "Chainlink",
  "Polygon", "Litecoin", "Near Protocol", "Internet Computer", "Uniswap", "Aptos",
  "Cosmos", "Stellar", "Monero", "Filecoin", "Arbitrum", "Optimism", "Injective", "Render", "Sui",
   "Bonk", "Floki", "Fetch.ai", "Aave", "Maker", "The Graph", "Lido DAO", "Kaspa"
];

function Dashboard() {
    const [loadMore, setLoadMore] = useState(35);
    const { coinsData } = useCoinContext();
    const { marketStream } = useStream();
    
    // Kept your original variable names
    const lossers = marketStream?.losser;
    const gainer = marketStream?.gainer;

    const handel_LoadMore = () => {
        setLoadMore((prev) => prev + 25);
    };

    return (
        <div className=" min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Top Gainers & Top Losers Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
                    
                    {/* Gainers Card */}
                    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-slate-200 p-4 sm:p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1.5 h-5 bg-emerald-500 rounded-full"></div>
                            <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">Top Gainers</h2>
                        </div>
                        <div className="space-y-2">
                            {/* Added .slice(0, 4) to ensure the list doesn't get infinitely long */}
                            {gainer && gainer.map((coin, index) => ( 
                                <Gainer_LosserCard key={index} typ="gainer" coin={coin} />
                            ))}
                        </div>
                    </div>

                    {/* Losers Card */}
                    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-slate-200 p-4 sm:p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1.5 h-5 bg-rose-500 rounded-full"></div>
                            <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">Top Losers</h2>
                        </div>
                        
                        <div className="space-y-2">
                            {lossers && lossers.map((coin, index) => (
                                <Gainer_LosserCard key={index} typ={"losser"} coin={coin}  />
                            ))}
                        </div>
                    </div>

                </div>

                {/* Coins Market Section */}
                <div>
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Coins Market
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        {coinsData &&
                            Object.entries(coinsData)
                                .sort((a, b) => {
                                    const coinA = a[1]; 
                                    const coinB = b[1]; 
                                    const indexA = PRIORITY_COINS.indexOf(coinA.name);
                                    const indexB = PRIORITY_COINS.indexOf(coinB.name);
                                    const weightA = indexA === -1 ? Infinity : indexA;
                                    const weightB = indexB === -1 ? Infinity : indexB;
                                    return weightA - weightB;
                                })
                                .slice(0, loadMore)
                                .map((coin) => (
                                    <DashboardCard key={coin[0]} coin={coin[1]} />
                                ))
                        }
                    </div>

                    {/* Load More Button Container */}
                    <div className="flex justify-center mt-10 mb-4">
                        <button 
                            onClick={handel_LoadMore} 
                            className="px-8 py-3 bg-slate-900 hover:bg-indigo-600 text-white text-sm sm:text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                        >
                            Load more coins
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;