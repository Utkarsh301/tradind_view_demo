import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BinanceKlinesTable} from "./components/BinanceKlinesTable.tsx";
import {Chart} from "./components/ChartComponent.tsx";
import {Series} from "./components/SeriesComponent.tsx";
import {useBinanceKlines} from "./hooks/useBinanceKlines.tsx";
import {CandlestickSeries, UTCTimestamp} from "lightweight-charts";

function App() {
    const [count, setCount] = useState(0);
    const {data, loading, error} = useBinanceKlines({
        symbol: 'BTCUSDT',
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
            <div style={{padding: 20, width: '700px', height: '700px'}}>
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
