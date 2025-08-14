import React, { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import {
  UsersIcon,
  ShoppingBagIcon,
  BarChartIcon as ChartBarIcon,
  TrendingUpIcon,
  PlusIcon,
  EyeIcon,
} from 'lucide-react'

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false)

  const stats = [
    {
      title: 'Utilisateurs Total',
      value: '2,847',
      change: '+12%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'blue',
    },
    {
      title: 'Produits Actifs',
      value: '1,234',
      change: '+8%',
      changeType: 'increase',
      icon: ShoppingBagIcon,
      color: 'green',
    },
    {
      title: 'Ventes du Mois',
      value: '€45,287',
      change: '+23%',
      changeType: 'increase',
      icon: ChartBarIcon,
      color: 'purple',
    },
    {
      title: 'Croissance',
      value: '18.7%',
      change: '+5%',
      changeType: 'increase',
      icon: TrendingUpIcon,
      color: 'indigo',
    },
  ]

  const recentActivities = [
    {
      id: 1,
      action: 'Nouvel utilisateur inscrit',
      user: 'Marie Dupont',
      time: 'Il y a 2 minutes',
    },
    {
      id: 2,
      action: 'Commande traitée',
      user: 'Jean Martin',
      time: 'Il y a 15 minutes',
    },
    { id: 3, action: 'Produit ajouté', user: 'Admin', time: 'Il y a 1 heure' },
    {
      id: 4,
      action: 'Paiement reçu',
      user: 'Sophie Bernard',
      time: 'Il y a 2 heures',
    },
  ]

  const getStatColor = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Bienvenue dans votre espace d'administration
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Ajouter un élément
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="hover:scale-105 transform transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-green-600 font-medium">
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    vs mois dernier
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${getStatColor(stat.color)}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <Card title="Ventes Mensuelles" className="lg:col-span-2">
          <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-blue-600 font-medium">Graphique des ventes</p>
              <p className="text-blue-500 text-sm">Données en temps réel</p>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card
          title="Activités Récentes"
          headerAction={
            <Button variant="outline" size="sm">
              <EyeIcon className="w-4 h-4 mr-2" />
              Voir tout
            </Button>
          }
        >
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600">{activity.user}</p>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card
          title="Activités Récentes"
          headerAction={
            <Button variant="outline" size="sm">
              <EyeIcon className="w-4 h-4 mr-2" />
              Voir tout
            </Button>
          }
        >
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600">{activity.user}</p>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card
          title="Activités Récentes"
          headerAction={
            <Button variant="outline" size="sm">
              <EyeIcon className="w-4 h-4 mr-2" />
              Voir tout
            </Button>
          }
        >
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600">{activity.user}</p>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Modal Example */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Ajouter un nouvel élément"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'élément
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Entrez le nom..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Entrez la description..."
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <Button className="flex-1">Ajouter</Button>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Dashboard
