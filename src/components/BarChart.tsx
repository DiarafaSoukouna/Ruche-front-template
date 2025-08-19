import React from 'react'
import { AgCharts } from 'ag-charts-react'

interface ChartSeries {
  yKey: string
  label?: string
  color?: string
  strokeColor?: string
  strokeWidth?: number
  cornerRadius?: number
}

interface ChartAxes {
  xTitle?: string
  yTitle?: string
  x?: Record<string, unknown>
  y?: Record<string, unknown>
}

interface BarChartProps {
  data?: Record<string, unknown>[]
  xKey: string
  series?: ChartSeries[]
  title?: string
  subtitle?: string
  colors?: string[]
  height?: number
  axes?: ChartAxes
  options?: Record<string, unknown>
  horizontal?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  legendPosition?: string
}

const BarChart: React.FC<BarChartProps> = ({
  data = [],
  xKey,
  series = [],
  title,
  subtitle,
  colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'],
  height = 400,
  axes = {},
  horizontal = false,
  showTooltip = true,
  showLegend = true,
  legendPosition = 'bottom',
  options = {},
}) => {
  const chartOptions: Record<string, unknown> = {
    data,
    title: title ? { text: title } : undefined,
    subtitle: subtitle ? { text: subtitle } : undefined,
    series: series.map((serie, index) => ({
      type: 'bar',
      direction: horizontal ? 'horizontal' : 'vertical',
      xKey,
      yKey: serie.yKey,
      yName: serie.label || serie.yKey,
      fill: serie.color || colors[index % colors.length],
      stroke: serie.strokeColor || 'transparent',
      strokeWidth: serie.strokeWidth || 0,
      cornerRadius: serie.cornerRadius || 4,
      tooltip: showTooltip
        ? {
            renderer: ({ datum, xKey, yKey, yName }: { datum: Record<string, unknown>; xKey: string; yKey: string; yName: string }) => ({
              title: datum[xKey],
              content: `${yName}: ${datum[yKey]?.toLocaleString?.() || datum[yKey]}`,
            }),
          }
        : undefined,
    })),
    axes: [
      {
        type: 'category',
        position: horizontal ? 'left' : 'bottom',
        title: axes.xTitle ? { text: axes.xTitle } : undefined,
        ...axes.x,
      },
      {
        type: 'number',
        position: horizontal ? 'bottom' : 'left',
        title: axes.yTitle ? { text: axes.yTitle } : undefined,
        ...axes.y,
      },
    ],
    legend: showLegend
      ? {
          enabled: series.length > 1,
          position: legendPosition,
        }
      : undefined,
    background: {
      fill: 'transparent',
    },
    padding: {
      top: 20,
      right: 20,
      bottom: 40,
      left: 60,
    },
  }

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <AgCharts options={{ ...chartOptions, ...options } as Record<string, unknown>} />
    </div>
  )
}

export default BarChart
