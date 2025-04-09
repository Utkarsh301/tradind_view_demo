import {ChartContainer} from "./ChartContainerComponent.tsx";
import {ReactNode, useCallback, useEffect, useRef, useState} from "react";
import {ChartOptions, DeepPartial, LayoutOptions} from "lightweight-charts";

export interface ChartProps extends DeepPartial<ChartOptions> {
    children?: ReactNode;
    layout?: DeepPartial<LayoutOptions>;
}

export function Chart(props: ChartProps) {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    const refCallback = useCallback((node: HTMLDivElement | null) => {
        if (node !== null) {
            setContainer(node);
        }
    }, []);

    return (
        <div ref={refCallback} className="w-full h-full">
            {container && <ChartContainer {...props} container={container} />}
        </div>
    );
}

