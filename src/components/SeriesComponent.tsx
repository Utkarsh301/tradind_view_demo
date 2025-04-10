import {
    forwardRef, ReactNode,
    useContext,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
} from 'react';
import {
    AreaSeries,
    AreaSeriesOptions, CandlestickSeries, CandlestickSeriesOptions,
    DeepPartial, HistogramSeries, HistogramSeriesOptions,
    ISeriesApi, LineSeries, LineSeriesOptions, SeriesOptionsCommon, SeriesPartialOptions, SeriesType,
} from 'lightweight-charts';
import {Context, SeriesContextRef} from "./ChartContext.ts";

interface SeriesProps {
    children?: ReactNode;
    data: any[];
    type: SeriesType;
    options: SeriesPartialOptions<SeriesProps>[SeriesType] & SeriesOptionsCommon;
    refresh? : boolean;
}

export const Series = forwardRef<ISeriesApi<SeriesType>, SeriesProps>(
    (props, ref) => {
        const parent = useContext(Context);

        if (!parent) {
            throw new Error('Series must be used within a ChartContainer');
        }

        const context = useRef<SeriesContextRef>({
            api() {
                const {data, type, options, refresh} = props;
                // if (refresh && this._api) {
                //     parent.free()
                // }
                // if (!this._api) {

                    switch (type) {
                        case "Line":
                            this._api = parent.api().addSeries(LineSeries, options);
                            break;
                        case "Area":
                            this._api = parent.api().addSeries(AreaSeries, options);
                            break;
                        case "Candlestick":
                            this._api = parent.api().addSeries(CandlestickSeries, options);
                            break;
                        case "Histogram":
                            this._api = parent.api().addSeries(HistogramSeries, options);
                            break;
                        default:
                            throw new Error(`Unsupported series type: ${type}`);
                    }

                    if (this._api) {
                        this._api.setData(data);
                        console.log('Setting data for series:', this._api);
                    }
                // }
                return this._api as ISeriesApi<SeriesType>;
            },
            free() {
                if (this._api && !parent.isRemoved) {
                    parent.free(this._api);
                }
            },
        });

        useLayoutEffect(() => {
            const currentRef = context.current;
            console.log('Mounting Series');

            try {
                currentRef.api();
            } catch (err) {
                console.error('Error creating series:', err);
            }

            return () => {
                if (!parent?.isRemoved && context.current._api) {
                    console.log('Unmounting Series');
                    context.current.free();
                }
            };
        }, []);

        useLayoutEffect(() => {
            const currentRef = context.current;
            const api = currentRef.api();
            if (api) {
                api.applyOptions(props.options);
                api.setData(props.data);
            }
        }, [props.data, props.options, props.type]);

        useImperativeHandle(ref, () => context.current.api(), []);

        return null;
    }
);


Series.displayName = 'Series';