import React from 'react'
import { AgCharts } from 'ag-charts-react'

/**
 * Composant PieChart modulaire utilisant AG Charts
 * 
 * @param {Object} props - Props du composant
 * @param {Array} props.data - Données du graphique
 * @param {string} props.angleKey - Clé pour les valeurs (angles)
 * @param {string} props.labelKey - Clé pour les labels
 * @param {string} props.title - Titre du graphique
 * @param {string} props.subtitle - Sous-titre du graphique
 * @param {Array} props.colors - Couleurs personnalisées
 * @param {number} props.height - Hauteur du graphique (défaut: 300)
 * @param {boolean} props.showLabels - Afficher les labels (défaut: true)
 * @param {boolean} props.showLegend - Afficher la légende (défaut: true)
 * @param {number} props.innerRadius - Rayon intérieur pour donut chart (0-1)
 * @returns {JSX.Element}
 */
const PieChart = ({
  data = [],
  angleKey,
  labelKey,
  title,
  subtitle,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'],
  height = 300,
  showLabels = true,
  showLegend = true,
  innerRadius = 0
}) => {
  const options = {
    data,
    title: title ? { text: title } : undefined,
    subtitle: subtitle ? { text: subtitle } : undefined,
    series: [
      {
        type: 'pie',
        angleKey,
        labelKey,
        fills: colors,
        innerRadius,
        label: {
          enabled: showLabels,
          fontSize: 12,
        },
        tooltip: {
          renderer: ({ datum, angleKey, labelKey }) => ({
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
      position: 'right',
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
      right: showLegend ? 120 : 20,
      bottom: 20,
      left: 20,
    },
  }

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <AgCharts options={options} />
    </div>
  )
}

export default PieChart
