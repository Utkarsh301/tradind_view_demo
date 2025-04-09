import {
    forwardRef,
    useEffect,
    useLayoutEffect,
    useRef,
} from 'react';
import {createChart, IChartApi} from 'lightweight-charts';
import {ChartProps} from "./ChartComponent.tsx";
import {ChartApiRef, Context} from "./ChartContext.ts";

interface ChartContainerProps extends ChartProps {
    container: HTMLDivElement;
}

export const ChartContainer = forwardRef<IChartApi, ChartContainerProps>(
    (props, ref) => {
        const { children, container, layout, ...rest } = props;

        const chartApiRef = useRef<ChartApiRef>({
            isRemoved: false,
            _api: undefined,
            api() {
                if (!this._api) {
                    this._api = createChart(container, {
                        ...rest,
                        layout,
                        width: container.clientWidth,
                        height: container.clientHeight,
                    });
                    this._api.timeScale().fitContent();
                }
                return this._api;
            },
            free(series) {
                if (this._api && series) {
                    this._api.removeSeries(series);
                }
            },
        });

        useEffect(() => {
            if (!container) return;

            const chart = chartApiRef.current.api();

            const handleResize = () => {
                if (!chartApiRef.current.isRemoved && container.clientWidth) {
                    chart?.applyOptions({
                        ...rest,
                        width: container.clientWidth,
                    });
                }
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                const chart = chartApiRef.current._api;
                if (chart && !chartApiRef.current.isRemoved) {
                    console.log('Unmounting ChartContainer');
                    chartApiRef.current.isRemoved = true;
                    chart.remove();
                    chartApiRef.current._api = undefined;
                }
            };
        }, [container]);

        if (!container) return null;

        return (
            <Context.Provider value={chartApiRef.current}>
                {children}
            </Context.Provider>
        );
    }
);



ChartContainer.displayName = 'ChartContainer';