import React from 'react';
import { AgCharts } from 'ag-charts-react';
import { AgChartOptions, AgSeriesTooltipRendererParams } from 'ag-charts-community';

interface LineChartSeries {
  yKey: string;
  label?: string;
  color?: string;
  strokeWidth?: number;
  showMarkers?: boolean;
  markerSize?: number;
}

interface LineChartAxes {
  xTitle?: string;
  yTitle?: string;
  x?: Record<string, unknown>;
  y?: Record<string, unknown>;
}

interface LineChartProps {
  data: Record<string, any>[];
  xKey: string;
  series?: LineChartSeries[];
  title?: string;
  subtitle?: string;
  colors?: string[];
  height?: number;
  axes?: LineChartAxes;
}

const LineChart: React.FC<LineChartProps> = ({
  data = [],
  xKey,
  series = [],
  title,
  subtitle,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  height = 300,
  axes = {}
}) => {

  const options: AgChartOptions = {
    data,
    title: title ? { text: title } : undefined,
    subtitle: subtitle ? { text: subtitle } : undefined,
    series: series.map((serie, index) => {
      const yKey = serie.yKey;
      const yName = serie.label || serie.yKey;
      const color = serie.color || colors[index % colors.length];

      return {
        type: 'line',
        xKey,
        yKey,
        yName,
        stroke: color,
        strokeWidth: serie.strokeWidth || 2,
        marker: {
          enabled: serie.showMarkers !== false,
          fill: color,
          stroke: color,
          size: serie.markerSize || 4,
        },
        tooltip: {
          renderer: ({ datum }: AgSeriesTooltipRendererParams<Record<string, any>>) => ({
            title: datum[xKey],
            content: `${yName}: ${datum[yKey]?.toLocaleString?.() || datum[yKey]}`,
          }),
        },
      };
    }),

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
      enabled: series.length > 1,
      position: 'bottom',
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
  };

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <AgCharts options={options} />
    </div>
  );
};

export default LineChart;
