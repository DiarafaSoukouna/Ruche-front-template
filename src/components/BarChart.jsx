import React from 'react'
import { AgCharts } from 'ag-charts-react'

/**
 * Composant BarChart modulaire utilisant AG Charts
 * 
 * @param {Object} props - Props du composant
 * @param {Array} props.data - Données du graphique
 * @param {string} props.xKey - Clé pour l'axe X (catégories)
 * @param {Array} props.series - Configuration des séries
 * @param {string} props.title - Titre du graphique
 * @param {string} props.subtitle - Sous-titre du graphique
 * @param {Object} props.colors - Couleurs personnalisées
 * @param {number} props.height - Hauteur du graphique (défaut: 300)
 * @param {Object} props.axes - Configuration des axes
 * @param {boolean} props.horizontal - Orientation horizontale (défaut: false)
 * @returns {JSX.Element}
 */
const BarChart = ({
  data = [],
  xKey,
  series = [],
  title,
  subtitle,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  height = 300,
  axes = {},
  horizontal = false
}) => {
  const options = {
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

export default BarChart
