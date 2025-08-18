import React from 'react'
import { AgCharts } from 'ag-charts-react'

/**
 * Composant LineChart modulaire utilisant AG Charts
 * 
 * @param {Object} props - Props du composant
 * @param {Array} props.data - Données du graphique
 * @param {string} props.xKey - Clé pour l'axe X
 * @param {Array} props.series - Configuration des séries
 * @param {string} props.title - Titre du graphique
 * @param {string} props.subtitle - Sous-titre du graphique
 * @param {Object} props.colors - Couleurs personnalisées
 * @param {number} props.height - Hauteur du graphique (défaut: 300)
 * @param {Object} props.axes - Configuration des axes
 * @returns {JSX.Element}
 */
const LineChart = ({
  data = [],
  xKey,
  series = [],
  title,
  subtitle,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  height = 300,
  axes = {}
}) => {
  const options = {
    data,
    title: title ? { text: title } : undefined,
    subtitle: subtitle ? { text: subtitle } : undefined,
    series: series.map((serie, index) => ({
      type: 'line',
      xKey,
      yKey: serie.yKey,
      yName: serie.label || serie.yKey,
      stroke: serie.color || colors[index % colors.length],
      strokeWidth: serie.strokeWidth || 2,
      marker: {
        enabled: serie.showMarkers !== false,
        fill: serie.color || colors[index % colors.length],
        stroke: serie.color || colors[index % colors.length],
        size: serie.markerSize || 4,
      },
      tooltip: {
        renderer: ({ datum, xKey, yKey, yName }) => ({
          title: datum[xKey],
          content: `${yName}: ${datum[yKey]?.toLocaleString?.() || datum[yKey]}`,
        }),
      },
    })),
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
  }

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <AgCharts options={options} />
    </div>
  )
}

export default LineChart
