'use client'

import { useEffect, useState } from 'react'
import { getAllDecaissementPtba } from '../functions/decaissement_ptba/gets'
import type { SuiviDecaissement } from '../types/decaissement_ptba'
import type React from 'react'
import { useMemo } from 'react'
import { Pie, Bar } from 'react-chartjs-2'
import Card from '../components/Card'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import { useRoot } from '../contexts/RootContext'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
)

const Graphiques: React.FC = () => {
  const [decaissements, setDecaissements] = useState<SuiviDecaissement[]>([])
  const { currentProgramme } = useRoot() // A remplacer par le contexte ou la prop appropriée

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllDecaissementPtba()
      const filteredData = data.filter(
        (d: SuiviDecaissement) =>
          d.projet?.programme_projet?.code_programme ===
          currentProgramme?.code_programme
      )
      setDecaissements(filteredData)
    }
    fetchData()
  }, [])

  // 📊 Pie Chart : montant décaissé par activité
  const pieData = useMemo(() => {
    const grouped: Record<string, number> = {}
    decaissements.forEach((d) => {
      const key = d.activite_ptba.intitule_activite_ptba
      grouped[key] = (grouped[key] || 0) + d.montant_decaisse
    })
    return {
      labels: Object.keys(grouped),
      datasets: [
        {
          label: 'Montant décaissé par activité',
          data: Object.values(grouped),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
          ],
        },
      ],
    }
  }, [decaissements])

  // 📊 Bar Chart : montant décaissé par année
  const barData = useMemo(() => {
    const grouped: Record<string, number> = {}
    decaissements.forEach((d) => {
      const year = new Date(d.periode_suivi_dec).getFullYear().toString()
      grouped[year] = (grouped[year] || 0) + d.montant_decaisse
    })
    return {
      labels: Object.keys(grouped).sort(),
      datasets: [
        {
          label: 'Montant décaissé par année',
          data: Object.keys(grouped)
            .sort()
            .map((year) => grouped[year]),
          backgroundColor: '#36A2EB',
        },
      ],
    }
  }, [decaissements])

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            )
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value.toLocaleString()} (${percentage}%)`
          },
        },
      },
    },
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => value.toLocaleString(),
        },
      },
    },
  }

  return (
    <div className="space-y-8 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Montant décaissé par activité">
          <div className="w-full max-w-md mx-auto h-[350px] flex items-center justify-center">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </Card>

        <Card title="Montant total décaissé par année">
          <div className="w-full h-[350px] flex items-center justify-center">
            <Bar data={barData} options={barOptions} />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Graphiques
