import { Group } from '@visx/group';
import { BarGroup } from '@visx/shape';
import { GradientDarkgreenGreen } from '@visx/gradient';
import { AxisBottom } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { guranteed, paid } from './data';

export type BarGroupProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
  data: Array<{
    time: string;
    Prudential: number;
    Manulife: number;
    AIA: number;
  }>
};

type ProductName = 'Prudential' | 'Manulife' | 'AIA';

type Product = {
  time: string;
  Prudential: number;
  Manulife: number;
  AIA: number;
}

type TooltipData = {
  // bar: SeriesPoint<Product>;
  data: {
    Prudential: Array<String>;
    Manulife: Array<String>;
    AIA: Array<String>;
  };
  index: number;
};

let tooltipTimeout: number;

const blue = '#aeeef8';
const green = '#e5fd3d';
const purple = '#9caff6';

const defaultMargin = { top: 40, right: 0, bottom: 40, left: 0 };

// accessors
const getDate = (d: Product) => d.time;

export default function BargroupClusterChart({
  width,
  height,
  events = false,
  margin = defaultMargin,
  data
}: BarGroupProps) {

  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipData>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({scroll: true,});

  const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    backgroundColor: 'rgba(0,0,0,0.9)',
    color: 'white',
  };

  const keys = Object.keys(data[0]).filter(d => d !== 'time') as ProductName[];
  // scales
  const dateScale = scaleBand<string>({
    domain: data.map((item)=>(item.time)),
    padding: 0.2,
  });
  const cityScale = scaleBand<string>({
    domain: keys,
    padding: 0.1,
  });
  const tempScale = scaleLinear<number>({
    domain: [0, Math.max(...data.map(d => Math.max(...keys.map(key => d[key]))))],
  });
  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: [blue, green, purple],
  });

  const legend = guranteed.map((item)=>(item.time))


  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // update scale output dimensions
  dateScale.rangeRound([0, xMax]);
  cityScale.rangeRound([0, dateScale.bandwidth()]);
  tempScale.range([yMax, 0]);

  return width < 10 ? null : (
    <div>
    <svg ref={containerRef} width={width} height={height}>
      <GradientDarkgreenGreen id="teal" />
      <rect width={width} height={height} fill="url(#teal)" rx={14} />
      <Group top={margin.top} left={margin.left}>
        <BarGroup
          data={data}
          keys={keys}
          height={yMax}
          x0={getDate}
          x0Scale={dateScale}
          x1Scale={cityScale}
          yScale={tempScale}
          color={colorScale}
        >
          {barGroups =>
            barGroups.map(barGroup => (
              <Group key={`bar-group-${barGroup.index}-${barGroup.x0}`} left={barGroup.x0}>
                {barGroup.bars.map(bar => (
                  <rect
                    key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    fill={bar.color}
                    rx={4}
                    onClick={() => {
                      if (!events) return;
                      const { key, value } = bar;
                      alert(JSON.stringify({ key, value }));
                    }}
                    onMouseLeave={() => {
                      tooltipTimeout = window.setTimeout(() => {
                        hideTooltip();
                      }, 300);
                    }}
                    onMouseMove={event => {
                      if (tooltipTimeout) clearTimeout(tooltipTimeout);
                      // TooltipInPortal expects coordinates to be relative to containerRef
                      // localPoint returns coordinates relative to the nearest SVG, which
                      // is what containerRef is set to in this example.
                      const eventSvgCoords = localPoint(event);
                      const left = barGroup.x0 + bar.width / 2;
                      var newBar = {
                        data: {
                          Prudential: [barGroup.bars[0].value.toString(), barGroup.bars[0].color],
                          Manulife: [barGroup.bars[1].value.toString(), barGroup.bars[1].color],
                          AIA: [barGroup.bars[2].value.toString(), barGroup.bars[2].color],
                        },
                        index: barGroup.index,
                      }
                      showTooltip({
                        tooltipData: newBar,
                        tooltipTop: eventSvgCoords?.y,
                        tooltipLeft: left,
                      });
                    }}
                  />
                ))}
              </Group>
            ))
          }
        </BarGroup>
      </Group>
      <AxisBottom
        top={yMax + margin.top}
        numTicks={data.length}
        scale={dateScale}
        stroke={green}
        tickStroke={green}
        hideAxisLine
        tickLabelProps={() => ({
          fill: green,
          fontSize: 12,
          textAnchor: 'middle',
        })}
      />
    </svg>
    {tooltipOpen && tooltipData && (
      <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
        <div>
          <strong>{legend[tooltipData.index]}</strong>
        </div>
        <div>
          Premiums Paid: ${paid[tooltipData.index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </div>
        {
          Object.entries(tooltipData.data).map((item)=>{
            return (
              <div style={{ color: colorScale(item[0]) }}>
                {item[0]}: ${item[1][0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </div>
            )
          })
        }
      </TooltipInPortal>
    )}
    </div>
  );
}