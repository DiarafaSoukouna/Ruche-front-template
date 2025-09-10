import { useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  UsersIcon,
  ShoppingCartIcon,
  DollarSignIcon,
  CalendarIcon,
  DownloadIcon,
  AlertTriangleIcon,
  FilterIcon,
  EyeIcon,
  PlusIcon,
} from "lucide-react";
// import { authStore } from '../../stores/auth' // Unused for now
import DataTable from "../../components/DataTable";
import { ProjetProvider } from "../../contexts/ProjetContext";
import HeadZone from "./HeadZone";

export default () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [showFilters, setShowFilters] = useState(false);

  // KPIs avec tendances
  const kpis = [
    {
      title: "Chiffre d'Affaires",
      value: "€127,450",
      change: "+12.5%",
      trend: "up",
      target: "€120,000",
      progress: 106,
      icon: DollarSignIcon,
      color: "green",
      description: "vs mois dernier",
    },
    {
      title: "Nouveaux Clients",
      value: "1,247",
      change: "+8.3%",
      trend: "up",
      target: "1,200",
      progress: 104,
      icon: UsersIcon,
      color: "blue",
      description: "ce mois",
    },
    {
      title: "Commandes",
      value: "3,891",
      change: "-2.1%",
      trend: "down",
      target: "4,000",
      progress: 97,
      icon: ShoppingCartIcon,
      color: "orange",
      description: "vs objectif",
    },
    {
      title: "Taux de Conversion",
      value: "3.2%",
      change: "+0.8%",
      trend: "up",
      target: "3.0%",
      progress: 107,
      icon: TrendingUpIcon,
      color: "purple",
      description: "amélioration",
    },
  ];

  // Données pour les graphiques
  const revenueData = [
    { month: "Jan", revenue: 85000, orders: 1200, customers: 890 },
    { month: "Fév", revenue: 92000, orders: 1350, customers: 950 },
    { month: "Mar", revenue: 78000, orders: 1100, customers: 820 },
    { month: "Avr", revenue: 105000, orders: 1480, customers: 1100 },
    { month: "Mai", revenue: 118000, orders: 1650, customers: 1250 },
    { month: "Jun", revenue: 127450, orders: 1780, customers: 1380 },
  ];

  const categoryPerformance = [
    { category: "Électronique", sales: 45000, margin: 18, orders: 650 },
    { category: "Vêtements", sales: 32000, margin: 25, orders: 480 },
    { category: "Maison", sales: 28000, margin: 22, orders: 390 },
    { category: "Sports", sales: 22450, margin: 20, orders: 260 },
  ];

  const topProducts = [
    { name: "iPhone 15 Pro", sales: 15600, units: 78, margin: 22 },
    { name: "MacBook Air M2", sales: 12400, units: 31, margin: 18 },
    { name: "AirPods Pro", sales: 8900, units: 178, margin: 35 },
    { name: "iPad Air", sales: 7200, units: 36, margin: 20 },
    { name: "Apple Watch", sales: 6800, units: 85, margin: 28 },
  ];

  const conversionFunnel = [
    { stage: "Visiteurs", value: 12450, percentage: 100 },
    { stage: "Intérêts", value: 3890, percentage: 31.2 },
    { stage: "Paniers", value: 1247, percentage: 10.0 },
    { stage: "Commandes", value: 398, percentage: 3.2 },
  ];

  const periods = [
    { value: "7d", label: "7 jours" },
    { value: "30d", label: "30 jours" },
    { value: "90d", label: "3 mois" },
    { value: "1y", label: "1 an" },
  ];

  const getTrendIcon = (trend: string) => {
    const IconComponent = trend === "up" ? TrendingUpIcon : TrendingDownIcon;
    return <IconComponent className="w-4 h-4 mr-1" />;
  };

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600";
  };

  const getKpiColor = (color: string) => {
    const colors: Record<string, string> = {
      green: "bg-green-500",
      blue: "bg-blue-500",
      orange: "bg-orange-500",
      purple: "bg-purple-500",
    };
    return colors[color] || colors.blue;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <ProjetProvider>
      <div className="space-y-8">
        <HeadZone />

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => (
            <Card
              key={index}
              className="hover:scale-105 transform transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${getKpiColor(kpi.color)}`}>
                  <kpi.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center ${getTrendColor(kpi.trend)}`}>
                  {getTrendIcon(kpi.trend)}
                  <span className="text-sm font-medium">{kpi.change}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-xs text-gray-500">{kpi.description}</p>
                </div>

                {/* Barre de progression vers objectif */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Objectif: {kpi.target}</span>
                    <span className="font-medium">{kpi.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(
                        kpi.progress
                      )}`}
                      style={{ width: `${Math.min(kpi.progress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <Card title="Évolution du Chiffre d'Affaires" className="lg:col-span-2">
            <LineChart
              data={revenueData}
              xKey="month"
              series={[
                { yKey: "revenue", label: "CA (€)", color: "#3B82F6" },
                { yKey: "orders", label: "Commandes", color: "#10B981" },
              ]}
              height={300}
              axes={{
                yTitle: "Montant (€)",
                xTitle: "Mois",
              }}
            />
          </Card>

          {/* Conversion Funnel */}
          <Card title="Entonnoir de Conversion">
            <div className="space-y-4">
              {conversionFunnel.map((stage) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <span className="text-sm text-gray-600">
                      {stage.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">
                      {stage.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Performance par catégorie */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Performance par Catégorie">
            <BarChart
              data={categoryPerformance}
              xKey="category"
              series={[{ yKey: "sales", label: "Ventes (€)", color: "#8B5CF6" }]}
              height={300}
              axes={{
                yTitle: "Ventes (€)",
                xTitle: "Catégories",
              }}
            />
          </Card>

          <Card title="Répartition des Marges">
            <PieChart
              data={categoryPerformance}
              angleKey="margin"
              labelKey="category"
              height={300}
              showLegend={true}
            />
          </Card>
        </div>

        {/* Top Produits */}
        <Card
          title="Top Produits"
          headerAction={
            <Button variant="outline" size="sm">
              <EyeIcon className="w-4 h-4 mr-2" />
              Voir tout
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Produit
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Ventes
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Unités
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Marge
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr
                    key={product.name}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                          {index + 1}
                        </span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      €{product.sales.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600">
                      {product.units}
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {product.margin}%
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">
                      <div className="w-20 bg-gray-200 rounded-full h-2 ml-auto">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (product.sales / 15600) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ✅ DataTable avec données détaillées */}
        <Card title="Transactions Récentes">
          <DataTable
            columns={[
              {
                header: "ID",
                accessor: "id",
              },
              {
                header: "Client",
                accessor: (row: Record<string, unknown>) => (
                  <div>
                    <div className="font-medium text-gray-900">
                      {String(row.customer)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {String(row.email)}
                    </div>
                  </div>
                ),
              },
              {
                header: "Produit",
                accessor: "product",
              },
              {
                header: "Catégorie",
                accessor: (row: Record<string, unknown>) => (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.category === "Électronique"
                      ? "bg-blue-100 text-blue-800"
                      : row.category === "Vêtements"
                        ? "bg-green-100 text-green-800"
                        : row.category === "Maison"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {String(row.category)}
                  </span>
                ),
              },
              {
                header: "Montant",
                accessor: (row: Record<string, unknown>) => (
                  <span className="font-medium text-gray-900">
                    €{Number(row.amount).toLocaleString("fr-FR")}
                  </span>
                ),
              },
              {
                header: "Statut",
                accessor: (row: Record<string, unknown>) => (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === "Payé"
                      ? "bg-green-100 text-green-800"
                      : row.status === "En attente"
                        ? "bg-yellow-100 text-yellow-800"
                        : row.status === "Annulé"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {String(row.status)}
                  </span>
                ),
              },
              {
                header: "Date",
                accessor: (row: Record<string, unknown>) => (
                  <span className="text-sm text-gray-600">
                    {new Date(String(row.date)).toLocaleDateString("fr-FR")}
                  </span>
                ),
              },
              {
                header: "Actions",
                accessor: () => (
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Voir
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 text-sm">
                      Modifier
                    </button>
                  </div>
                ),
              },
            ]}
            rowKey={(row: Record<string, unknown>) => String(row.id)}
            endpoint="mock/transactions"
            className="h-96"
          />
        </Card>

        {/* Alertes et Recommandations */}
        <Card title="Alertes & Recommandations">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">
                  Stock faible détecté
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  3 produits ont un stock inférieur à 10 unités. Recommandation:
                  réapprovisionner rapidement.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <TrendingUpIcon className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">
                  Opportunité de croissance
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  La catégorie "Électronique" montre une croissance de +15%.
                  Considérez augmenter l'inventaire.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ProjetProvider>
  );
};

