import Decimal from 'decimal.js'
import useStream from '../hooks/useStream'
import useCoinContext from '../hooks/useCoinsDetails'

function PortfolioCard({wallet}) {
    const {marketStream} = useStream()
    const {coinsData} = useCoinContext()

    // Price Calculation
    let price = ""
    if(marketStream?.latestTickers && wallet){
        price = marketStream?.latestTickers[wallet.asset]?.currentPrice
        if(!price) return;
        const p = new Decimal(price)
        price = p.toFixed(3).toString()
    }

    // Balance and profit Calculation
    let balance = ""
    let profit = ""
    if(price && wallet){
        balance = (new Decimal(price).mul(wallet?.balance)).toString()
        const prev_balance = (new Decimal(wallet?.averageBuyPrice).mul(wallet?.balance)).toString()
        if (!new Decimal (prev_balance).isZero()) {
            profit = new Decimal (balance)
                .minus(prev_balance)
                .div(prev_balance)
                .mul(100)
                .toFixed(2);
        }
    }

    let static_data = {}
    if(coinsData && wallet && wallet.asset){
        coinsData.forEach(coin => {
            if(coin.symbol === wallet.asset){
                static_data = coin
            }
        });
    }
    
  
    return (
        <tr className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
            <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                    <img src={static_data?.image} className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg  "/>
                    <div>
                        <div className="font-black text-slate-900">{static_data?.name}</div>
                        <div className="text-xs font-bold text-slate-400">{static_data?.symbol}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-5">
                <div className="font-bold text-slate-900">{wallet?.balance}</div>
            </td>
            <td className="px-6 py-5">
                <div className="font-bold text-slate-900">₹{price}</div>
                <div className={`text-xs font-bold  ${Number(profit) < 0 ? "text-pink-500" : "text-emerald-500"} ${profit === "" ? "hidden" : ""}`}>{profit}%</div>
            </td>
            <td className="px-6 py-5 text-right">
                <div className="font-black text-slate-900">₹{balance}</div>
            </td>
        </tr>
    )
}

export default PortfolioCard