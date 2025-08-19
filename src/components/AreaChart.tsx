import React from "react"
import { AgCharts } from "ag-charts-react"
import type {
  AgCartesianAxisOptions,
  AgAreaSeriesOptions,
  AgChartOptions,
} from "ag-charts-community"

interface SerieConfig {
  yKey: string
  label?: string
  color?: string
  opacity?: number
  strokeColor?: string
  strokeWidth?: number
  showMarkers?: boolean
  markerSize?: number
}

interface AxesConfig {
  xTitle?: string
  yTitle?: string
  x?: Partial<AgCartesianAxisOptions>
  y?: Partial<AgCartesianAxisOptions>
}

interface AreaChartProps {
  data?: any[]
  xKey: string
  series?: SerieConfig[]
  title?: string
  subtitle?: string
  colors?: string[]
  height?: number
  axes?: AxesConfig
  stacked?: boolean
}

const AreaChart: React.FC<AreaChartProps> = ({
  data = [],
  xKey,
  series = [],
  title,
  subtitle,
  colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
  height = 300,
  axes = {},
  stacked = false,
}) => {
  const options: AgChartOptions = {
    data,
    title: title ? { text: title } : undefined,
    subtitle: subtitle ? { text: subtitle } : undefined,
    series: series.map<AgAreaSeriesOptions>((serie, index) => ({
      type: "area",
      xKey,
      yKey: serie.yKey,
      yName: serie.label || serie.yKey,
      fill: serie.color || colors[index % colors.length],
      fillOpacity: serie.opacity ?? 0.7,
      stroke: serie.strokeColor || serie.color || colors[index % colors.length],
      strokeWidth: serie.strokeWidth ?? 2,
      marker: {
        enabled: serie.showMarkers !== false,
        fill: serie.color || colors[index % colors.length],
        stroke: serie.color || colors[index % colors.length],
        size: serie.markerSize ?? 4,
      },
      stacked,
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
        position: "bottom",
        title: axes.xTitle ? { text: axes.xTitle } : undefined,
        ...(axes.x || {}),
      } as AgCartesianAxisOptions,
      {
        type: "number",
        position: "left",
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

export default AreaChart
