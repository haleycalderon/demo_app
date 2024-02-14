import React from 'react';
import { Group } from '@visx/group';
import genBins, { Bin, Bins } from '@visx/mock-data/lib/generators/genBins';
import { scaleLinear } from '@visx/scale';
import { HeatmapCircle, HeatmapRect } from '@visx/heatmap';
import { getSeededRandom } from '@visx/mock-data';
import heatmapBins from "./ionoMap"
import { AxisBottom, AxisLeft } from '@visx/axis';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { BinItem } from './ionoMap'


const hot1 = '#77312f';
const hot2 = '#f33d15';
const cool1 = '#122549';
const cool2 = '#b4fbde';

//const red = "ee4848"
//const green = "6fd356"

export const background = '#28272c';

const seededRandom = getSeededRandom(0.41);

var binData = genBins(
  /* length = */ 16,
  /* height = */ 16,
  /** binFunc */(idx) => 150 * idx,
  /** countFunc */(i, number) => 25 * (number - i) * seededRandom(),
);

binData = heatmapBins

function max<Datum>(data: Datum[], value: (d: Datum) => number): number {
    return Math.max(...data.map(value));
}

function min<Datum>(data: Datum[], value: (d: Datum) => number): number {
    return Math.min(...data.map(value));
}

// accessors
const bins = (d: Bins) => d.bins;
const count = (d: Bin) => d.count;

const colorMax = max(binData, (d) => max(bins(d), count));
const bucketSizeMax = max(binData, (d) => bins(d).length);
console.log(bucketSizeMax)
// scales
const xScale = scaleLinear<number>({
    domain: [0, binData.length],
});
const yScale = scaleLinear<number>({
    domain: [0, bucketSizeMax],
});
const circleColorScale = scaleLinear<string>({
    range: [hot1, hot2],
    domain: [0, colorMax],
});
const rectColorScale = scaleLinear<string>({
    range: [cool1, cool2],
    domain: [0, colorMax],
});
const opacityScale = scaleLinear<number>({
    range: [0.1, 0.9],
    domain: [0, colorMax],
});

export type HeatmapProps = {
    width: number;
    height: number;
    margin?: { top: number; right: number; bottom: number; left: number };
    separation?: number;
    events?: boolean;
};

const defaultMargin = { top: 10, left: 70, right: 20, bottom: 110 };

function Example({
    width,
    height,
    events = false,
    margin = defaultMargin,
    separation = 0,
}: HeatmapProps) {

    const {
        tooltipData,
        tooltipTop,
        tooltipLeft,
        showTooltip,
        hideTooltip
    } = useTooltip<BinItem>();

    // Event handlers
    const handleMouseOver = (event: React.MouseEvent<SVGRectElement>, binData: BinItem) => {
        showTooltip({
            tooltipData: binData,
            tooltipTop: height/2 + event.clientY,
            tooltipLeft: event.clientX
        });
    };

    // bounds
    const size =
        width > margin.left + margin.right ? width - margin.left - margin.right - separation : width;
    const xMax = size;
    const yMax = height - margin.bottom - margin.top;

    const binWidth = xMax / binData.length;
    const binHeight = yMax / bucketSizeMax;
    const radius = min([binWidth, binHeight], (d) => d) / 2;
    //console.log("height: ", height)
    //console.log("ymax: ", yMax)
    //console.log("bucketsizemax: ", bucketSizeMax)
    //console.log("bin heihgt: ", binHeight)
    xScale.range([0, xMax]);
    yScale.range([yMax, 0]);

    return width < 10 ? null : (
        <div>
            <svg width={width} height={height}>
                <rect x={0} y={0} width={width} height={height} rx={14} className='fill-gray-100' />
                <Group top={margin.top} left={margin.left} className='bg-red-600'>
                    <HeatmapRect
                        data={binData}
                        xScale={(d) => xScale(d) ?? 0}
                        yScale={(d) => yScale(d) ?? 0}
                        colorScale={rectColorScale}
                        opacityScale={opacityScale}
                        binWidth={binWidth}
                        binHeight={binHeight}
                        gap={0}
                    >
                        {(heatmap) =>
                            heatmap.map((heatmapBins) =>
                                heatmapBins.map((bin) => (
                                    <rect
                                        key={`heatmap-rect-${bin.row}-${bin.column}`}
                                        className="visx-heatmap-rect"
                                        width={bin.width}
                                        height={bin.height}
                                        x={bin.x}
                                        y={bin.y}
                                        fill={bin.color}
                                        fillOpacity={bin.opacity}
                                        onClick={() => {
                                            if (!events) return;
                                            const { row, column } = bin;
                                            alert(JSON.stringify({ row, column, bin: bin.bin }));
                                        }}
                                        onMouseEnter={(e) => handleMouseOver(e, bin as BinItem)}
                                        onMouseMove={(e) => handleMouseOver(e, bin as BinItem)}
                                        //onMouseMove={handleMouseOver(events, bin)}  // Update tooltip position on mouse move
                                        onMouseLeave={hideTooltip}     // Hide tooltip when mouse leaves
                                    />
                                )),
                            )
                        }
                    </HeatmapRect>
                </Group>
                <AxisLeft
                    scale={yScale}
                    top={margin.top + binHeight}
                    left={margin.left}
                    label="Virtual height (km)"
                    stroke="#333"
                    labelProps={{
                        fontSize: 18, // Set the font size here
                        textAnchor: 'middle',
                        fill: '#333'
                    }}
                />
                <AxisBottom
                    scale={xScale}
                    //bottom={margin.bottom}
                    top={margin.top + ((bucketSizeMax+1)*binHeight)}
                    left={margin.left}
                    label="Frequency (MHz)"
                    stroke="#333"
                    labelProps={{
                        fontSize: 18, // Set the font size here
                        textAnchor: 'middle',
                        fill: '#333'
                    }}
                />
            </svg>
            {tooltipData && (
                <TooltipWithBounds
                    top={tooltipTop}
                    left={tooltipLeft}
                    style={defaultStyles}
                >
                    {`Power: ${tooltipData.count}`}
                </TooltipWithBounds>
            )}
        </div>
    );
}

export default Example;