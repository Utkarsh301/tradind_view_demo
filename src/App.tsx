import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BinanceKlinesTable} from "./components/BinanceKlinesTable.tsx";
import {Chart} from "./components/ChartComponent.tsx";
import {Series} from "./components/SeriesComponent.tsx";
import {useBinanceKlines} from "./hooks/useBinanceKlines.tsx";
import {CandlestickSeries, UTCTimestamp} from "lightweight-charts";
import {Autocomplete, AutocompleteItem} from "@heroui/react";

export const binanceSymbols = [
    {id: 'BTCUSDT', name: 'Bitcoin / Tether'},
    {id: 'ETHUSDT', name: 'Ethereum / Tether'},
    {id: 'BNBUSDT', name: 'BNB / Tether'},
    {id: 'SOLUSDT', name: 'Solana / Tether'},
    {id: 'XRPUSDT', name: 'XRP / Tether'},
    {id: 'DOGEUSDT', name: 'Dogecoin / Tether'},
    {id: 'ADAUSDT', name: 'Cardano / Tether'},
    {id: 'AVAXUSDT', name: 'Avalanche / Tether'},
    {id: 'MATICUSDT', name: 'Polygon / Tether'},
    {id: 'LTCUSDT', name: 'Litecoin / Tether'},
    {id: 'DOTUSDT', name: 'Polkadot / Tether'},
    {id: 'SHIBUSDT', name: 'Shiba Inu / Tether'},
    {id: 'LINKUSDT', name: 'Chainlink / Tether'},
    {id: 'OPUSDT', name: 'Optimism / Tether'},
    {id: 'ARBUSDT', name: 'Arbitrum / Tether'},
];


function App() {
    const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
    const {data, loading, error} = useBinanceKlines({
        symbol: selectedSymbol,
        interval: '1h'
    });


    const candlestickData = data?.map(d => ({
        time: (d.openTime) / 1000 as UTCTimestamp,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
    })) ?? [];

    const volumeData = data?.map(d => ({
        time: (d.openTime) / 1000 as UTCTimestamp,
        value: d.volume,
    })) ?? [];
    if (loading) return <p>Loading chart...</p>;
    else if (error) return <p>Error loading chart: {error}</p>;
    return (
        <>
            <Autocomplete
                className={"max-w-xs mb-3"}
                defaultItems={binanceSymbols}
                selectedKey={selectedSymbol}
                onSelectionChange={(key) => {
                    const selectedSymbol = binanceSymbols.find((symbol) => symbol.id === key);
                    if (selectedSymbol) {
                        setSelectedSymbol(selectedSymbol.id);
                    }
                }}
            >
                {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
            </Autocomplete>
            <div className="p-5 w-[800px] h-[600px] bg-indigo-500 rounded-2xl shadow-lg border border-gray-800">
                <Chart>
                    {candlestickData.length > 1 && <Series
                        type={"Candlestick"}
                        data={candlestickData}
                        options={{
                            upColor: '#26a69a',
                            downColor: '#ef5350',
                            borderVisible: true,
                            wickUpColor: '#26a69a',
                            wickDownColor: '#ef5350',
                            scaleMargins: {top: 0, bottom: 0.2}
                        }}
                    />}
                    {volumeData.length > 1 && <Series
                        type={"Histogram"}
                        data={volumeData}
                        options={{
                            color: '#26a69a',
                            base: 0,
                            priceScaleId: '',
                            scaleMargins: {top: 0.8, bottom: 0}
                        }}
                    />}
                </Chart>
                {/*<BinanceKlinesTable symbol="BTCUSDT" interval="1h" limit={30} />*/}
            </div>
        </>
    )
}

export default App
