import React from 'react'
import { AgCharts } from 'ag-charts-react'

interface PieChartProps {
  data?: Record<string, unknown>[]
  angleKey: string
  labelKey: string
  title?: string
  subtitle?: string
  colors?: string[]
  height?: number
  showLabels?: boolean
  showLegend?: boolean
  options?: Record<string, unknown>
  donut?: boolean
  innerRadiusRatio?: number
  showTooltip?: boolean
  legendPosition?: string
}

const PieChart: React.FC<PieChartProps> = ({
  data = [],
  angleKey,
  labelKey,
  title,
  subtitle,
  colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#f97316'],
  height = 400,
  donut = false,
  innerRadiusRatio = 0.6,
  showTooltip = true,
  showLegend = true,
  legendPosition = 'right',
  options = {},
}) => {
  const chartOptions: Record<string, unknown> = {
    data,
    title: title ? { text: title } : undefined,
    subtitle: subtitle ? { text: subtitle } : undefined,
    series: [
      {
        type: 'pie',
        angleKey,
        labelKey,
        fills: colors,
        innerRadius: donut ? `${innerRadiusRatio * 100}%` : 0,
        label: {
          enabled: true,
          fontSize: 12,
        },
        tooltip: {
          enabled: showTooltip,
          renderer: ({ datum, angleKey, labelKey }: { datum: Record<string, unknown>; angleKey: string; labelKey: string }) => ({
            title: datum[labelKey],
            content: `${datum[angleKey]?.toLocaleString?.() || datum[angleKey]}`,
          }),
        },
        highlightStyle: {
          item: {
            fillOpacity: 0.8,
          },
        },
      },
    ],
    legend: {
      enabled: showLegend,
      position: legendPosition,
      item: {
        marker: {
          shape: 'circle',
          size: 8,
        },
      },
    },
    background: {
      fill: 'transparent',
    },
    padding: {
      top: 20,
      right: showLegend && legendPosition === 'right' ? 120 : 20,
      bottom: 20,
      left: 20,
    },
  }

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <AgCharts options={{ ...chartOptions, ...options } as Record<string, unknown>} />
    </div>
  )
}

export default PieChart
