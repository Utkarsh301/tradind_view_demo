import { useBinanceKlines, Kline } from '../hooks/useBinanceKlines';

interface Props {
    symbol: string;
    interval?: string;
    limit?: number;
}

export const BinanceKlinesTable: React.FC<Props> = ({
                                                        symbol,
                                                        interval = '1h',
                                                        limit = 20,
                                                    }) => {
    const { data, loading, error } = useBinanceKlines({ symbol, interval: interval as any, limit });

    if (loading) return <p className="text-center text-gray-500">Loading OHLC data for {symbol}...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;
    if (!data) return null;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">{symbol} — {interval} Candles</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b">Open Time</th>
                        <th className="py-2 px-4 border-b">Open</th>
                        <th className="py-2 px-4 border-b">High</th>
                        <th className="py-2 px-4 border-b">Low</th>
                        <th className="py-2 px-4 border-b">Close</th>
                        <th className="py-2 px-4 border-b">Volume</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((k: Kline) => (
                        <tr key={k.openTime} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">{new Date(k.openTime).toLocaleString()}</td>
                            <td className="py-2 px-4 border-b">{k.open.toFixed(2)}</td>
                            <td className="py-2 px-4 border-b">{k.high.toFixed(2)}</td>
                            <td className="py-2 px-4 border-b">{k.low.toFixed(2)}</td>
                            <td className="py-2 px-4 border-b">{k.close.toFixed(2)}</td>
                            <td className="py-2 px-4 border-b">{k.volume.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
