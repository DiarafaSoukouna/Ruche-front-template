import React from "react"
import { AgCharts } from "ag-charts-react"
import type {
  AgCartesianAxisOptions,
  AgBarSeriesOptions,
  AgChartOptions,
} from "ag-charts-community"

interface SerieConfig {
  yKey: string
  label?: string
  color?: string
  strokeColor?: string
  strokeWidth?: number
  cornerRadius?: number
}

interface AxesConfig {
  xTitle?: string
  yTitle?: string
  x?: Partial<AgCartesianAxisOptions>
  y?: Partial<AgCartesianAxisOptions>
}

interface BarChartProps {
  data?: any[]
  xKey: string
  series?: SerieConfig[]
  title?: string
  subtitle?: string
  colors?: string[]
  height?: number
  axes?: AxesConfig
  horizontal?: boolean
}

const BarChart: React.FC<BarChartProps> = ({
  data = [],
  xKey,
  series = [],
  title,
  subtitle,
  colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
  height = 300,
  axes = {},
  horizontal = false,
}) => {
  const options: AgChartOptions = {
    data,
    title: title ? { text: title } : undefined,
    subtitle: subtitle ? { text: subtitle } : undefined,
    series: series.map<AgBarSeriesOptions>((serie, index) => ({
      type: "bar",
      direction: horizontal ? "horizontal" : "vertical",
      xKey,
      yKey: serie.yKey,
      yName: serie.label || serie.yKey,
      fill: serie.color || colors[index % colors.length],
      stroke: serie.strokeColor || "transparent",
      strokeWidth: serie.strokeWidth ?? 0,
      cornerRadius: serie.cornerRadius ?? 4,
      tooltip: {
        renderer: ({ datum, xKey, yKey, yName }) => ({
          title: datum[xKey],
          content: `${yName}: ${
            datum[yKey]?.toLocaleString?.() ?? datum[yKey]
          }`,
        }),
      },
    })),
    axes: [
      {
        type: "category",
        position: horizontal ? "left" : "bottom",
        title: axes.xTitle ? { text: axes.xTitle } : undefined,
        ...(axes.x || {}),
      } as AgCartesianAxisOptions,
      {
        type: "number",
        position: horizontal ? "bottom" : "left",
        title: axes.yTitle ? { text: axes.yTitle } : undefined,
        ...(axes.y || {}),
      } as AgCartesianAxisOptions,
    ],
    legend: {
      enabled: series.length > 1,
      position: "bottom",
    },
    background: {
      fill: "transparent",
    },
    padding: {
      top: 20,
      right: 20,
      bottom: 40,
      left: 60,
    },
  }

  return (
    <div style={{ height: `${height}px`, width: "100%" }}>
      <AgCharts options={options} />
    </div>
  )
}

export default BarChart
