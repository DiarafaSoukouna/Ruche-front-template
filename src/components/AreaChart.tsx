import React from 'react'
import { AgCharts } from 'ag-charts-react'

interface ChartSeries {
  yKey: string
  label?: string
  color?: string
  strokeColor?: string
  strokeWidth?: number
  opacity?: number
  showMarkers?: boolean
  markerSize?: number
}

interface ChartAxes {
  xTitle?: string
  yTitle?: string
  x?: Record<string, unknown>
  y?: Record<string, unknown>
}

interface AreaChartProps {
  data?: Record<string, unknown>[]
  xKey: string
  series?: ChartSeries[]
  title?: string
  subtitle?: string
  colors?: string[]
  height?: number
  axes?: ChartAxes
  stacked?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  legendPosition?: string
  options?: Record<string, unknown>
}

const AreaChart: React.FC<AreaChartProps> = ({
  data = [],
  xKey,
  series = [],
  title,
  subtitle,
  colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'],
  height = 400,
  axes = {},
  stacked = false,
  showTooltip = true,
  showLegend = true,
  legendPosition = 'bottom',
  options = {},
}) => {
  const chartOptions: Record<string, unknown> = {
    data,
    title: title ? { text: title } : undefined,
    subtitle: subtitle ? { text: subtitle } : undefined,
    series: series.map(
      (s, index) =>
        ({
          type: 'area',
          xKey,
          yKey: s.yKey,
          yName: s.label || s.yKey,
          fill: s.color || colors[index % colors.length],
          stroke: s.strokeColor || s.color || colors[index % colors.length],
          strokeWidth: s.strokeWidth || 2,
          fillOpacity: s.opacity || 0.7,
          marker: {
            enabled: s.showMarkers !== false,
            size: s.markerSize || 4,
          },
          stacked,
        } as Record<string, unknown>)
    ),
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: axes.xTitle ? { text: axes.xTitle } : undefined,
        ...axes.x,
      },
      {
        type: 'number',
        position: 'left',
        title: axes.yTitle ? { text: axes.yTitle } : undefined,
        ...axes.y,
      },
    ],
    legend: {
      enabled: showLegend,
      position: legendPosition,
    },
    background: {
      fill: 'transparent',
    },
    padding: {
      top: 20,
      right: 20,
      bottom: 40,
      left: 60,
    },
    tooltip: showTooltip
      ? {
          renderer: ({
            datum,
            xKey,
            yKey,
            yName,
          }: {
            datum: Record<string, unknown>
            xKey: string
            yKey: string
            yName: string
          }) => ({
            title: datum[xKey],
            content: `${yName}: ${
              typeof datum[yKey] === 'number'
                ? datum[yKey].toLocaleString()
                : datum[yKey]
            }`,
          }),
        }
      : undefined,
  }

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <AgCharts
        options={{ ...chartOptions, ...options } as Record<string, unknown>}
      />
    </div>
  )
}

export default AreaChart
