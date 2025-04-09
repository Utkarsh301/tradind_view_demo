import { useState, useEffect } from 'react';

export type KlineInterval =
    | '1m' | '3m' | '5m' | '15m' | '30m'
    | '1h' | '2h' | '4h' | '6h' | '8h' | '12h'
    | '1d' | '3d' | '1w' | '1M';

export interface Kline {
    openTime: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    closeTime: number;
    quoteAssetVolume: number;
    numberOfTrades: number;
    takerBuyBaseAssetVolume: number;
    takerBuyQuoteAssetVolume: number;
}

interface UseKlinesOptions {
    symbol: string;         // e.g. 'BTCUSDT'
    interval?: KlineInterval;
    limit?: number;         // number of data points (max 1000)
    startTime?: number;         // number of data points (max 1000)
    endTime?: number;         // number of data points (max 1000)
}

export function useBinanceKlines({
                                     symbol,
                                     interval,
                                     limit,
                                     startTime = new Date('2025-04-01T00:00:00Z').getTime(),
                                     endTime = Date.now(),
                                 }: UseKlinesOptions) {
    const [data, setData] = useState<Kline[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        const params = {
            symbol: symbol,
            interval: interval,
            limit: limit,
            startTime: startTime,
            endTime: endTime,
        };

        const query = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, val]) => {
                if (val !== undefined && val !== null) {
                    acc[key] = String(val);
                }
                return acc;
            }, {} as Record<string, string>)
        ).toString();

        fetch(`https://api.binance.com/api/v3/klines?${query}`)
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error(`Binance API error: ${res.statusText}`);
                }
                const raw: any[][] = await res.json();
                // transform raw arrays into Kline objects
                const klines: Kline[] = raw.map((item) => ({
                    openTime: item[0],
                    open: parseFloat(item[1]),
                    high: parseFloat(item[2]),
                    low: parseFloat(item[3]),
                    close: parseFloat(item[4]),
                    volume: parseFloat(item[5]),
                    closeTime: item[6],
                    quoteAssetVolume: parseFloat(item[7]),
                    numberOfTrades: item[8],
                    takerBuyBaseAssetVolume: parseFloat(item[9]),
                    takerBuyQuoteAssetVolume: parseFloat(item[10]),
                }));
                if (isMounted) {
                    setData(klines);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err.message);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [symbol, interval, limit]);

    return { data, loading, error };
}
