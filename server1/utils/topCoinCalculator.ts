import { latestTickers } from "../services/market_Stream.service.js";

interface RankedTicker {
  coin: string;
  currentPrice: number;
  changePercent: number;
  volume24h: number;
}

function toArray(): RankedTicker[] {
  return Object.entries(latestTickers).map(([coin, data]) => ({
    coin,
    currentPrice: data.currentPrice,
    changePercent: data.changePercent,
    volume24h: data.volume24h
  }));
}

function topGainer(): RankedTicker[] {
  return toArray()
    .filter(c => c.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);
}

function topLosser(): RankedTicker[] {
  return toArray()
    .filter(c => c.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);
}

export { topGainer, topLosser }