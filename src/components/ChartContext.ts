import {IChartApi, ISeriesApi, SeriesType} from "lightweight-charts";
import {createContext} from "react";

// Type for the chart API reference
export interface ChartApiRef {
    isRemoved: boolean;
    _api?: IChartApi;
    api(): IChartApi;
    free(series?: ISeriesApi<SeriesType>): void;
}

// Type for the series context reference
export interface SeriesContextRef {
    _api?: ISeriesApi<SeriesType>;
    api(): ISeriesApi<SeriesType>;
    free(): void;
}

// Create a typed context
export const Context = createContext<ChartApiRef | null>(null);