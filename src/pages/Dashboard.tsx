import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Card from "../components/Card";
import BarChart from "../components/BarChart";
import SelectInput from "../components/SelectInput";
import { RiseLoader } from "react-spinners";

import {
  ClipboardListIcon,
  CheckCircle2Icon,
  TrendingUpIcon,
  AlertCircleIcon,
  LucideIcon,
  CalendarIcon,
} from "lucide-react";

import ptbaService from "../services/ptbaService";
import tacheActivitePtbaService from "../services/tacheActivitePtbaService";
import versionPtbaService from "../services/versionPtbaService";
import { planSiteService } from "../services/planSiteService";
import { useRoot } from "../contexts/RootContext";
import type {
  Ptba,
  TacheActivitePtba,
  PlanSite,
  Programme,
  VersionPtba,
} from "../types/entities";

interface Stat {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange";
}

interface ExecutionData extends Record<string, unknown> {
  statut: string;
  count: number;
}

interface ServiceData extends Record<string, unknown> {
  service: string;
  tachesTerminees: number;
  tachesTotal: number;
  pourcentage: number;
}

interface IndicateurData extends Record<string, unknown> {
  service: string;
  indicateursRealises: number;
  indicateursTotal: number;
  pourcentage: number;
}

const Dashboard: React.FC = () => {
  const { currentProgramme }: { currentProgramme: Programme } = useRoot();
  const [selectedAnneeExecution, setSelectedAnneeExecution] = useState<
    number | null
  >(null);
  const [selectedAnneeTaches, setSelectedAnneeTaches] = useState<number | null>(
    null
  );
  const [selectedAnneeIndicateurs, setSelectedAnneeIndicateurs] = useState<
    number | null
  >(null);

  // Récupération des données
  const { data: activites = [], isLoading: loadingActivites } = useQuery<
    Ptba[]
  >({
    queryKey: ["ptba-activites-dashboard", currentProgramme?.code_programme],
    queryFn: () => ptbaService.getAll(currentProgramme?.code_programme || ""),
    enabled: !!currentProgramme,
  });

  const { data: taches = [], isLoading: loadingTaches } = useQuery<
    TacheActivitePtba[]
  >({
    queryKey: ["taches-dashboard"],
    queryFn: tacheActivitePtbaService.getAll,
  });

  const { data: versions = [], isLoading: loadingVersions } = useQuery<
    VersionPtba[]
  >({
    queryKey: ["versions-ptba-dashboard"],
    queryFn: versionPtbaService.getAll,
  });

  const { data: plansSites = [], isLoading: loadingPlansSites } = useQuery<
    PlanSite[]
  >({
    queryKey: ["plans-sites-dashboard"],
    queryFn: planSiteService.getAll,
  });

  const isLoading =
    loadingActivites || loadingTaches || loadingVersions || loadingPlansSites;

  // Obtenir les années disponibles
  const anneesDisponibles = useMemo(() => {
    const annees = [...new Set(versions.map((v) => v.annee_ptba))].sort(
      (a, b) => b - a
    );
    return annees;
  }, [versions]);

  // Définir les années par défaut (la plus récente)
  useMemo(() => {
    if (anneesDisponibles.length > 0) {
      const anneeParDefaut = anneesDisponibles[0];
      if (!selectedAnneeExecution) setSelectedAnneeExecution(anneeParDefaut);
      if (!selectedAnneeTaches) setSelectedAnneeTaches(anneeParDefaut);
      if (!selectedAnneeIndicateurs)
        setSelectedAnneeIndicateurs(anneeParDefaut);
    }
  }, [
    anneesDisponibles,
    selectedAnneeExecution,
    selectedAnneeTaches,
    selectedAnneeIndicateurs,
  ]);

  // Fonction helper pour filtrer les activités par année
  const filtrerActivitesParAnnee = (annee: number | null) => {
    if (!annee) return activites;
    const versionsDeAnnee = versions.filter((v) => v.annee_ptba === annee);
    const idsVersions = versionsDeAnnee.map((v) => v.id_version_ptba);
    return activites.filter((a) => idsVersions.includes(a.version_ptba));
  };

  // Fonction helper pour filtrer les tâches par activités
  const filtrerTachesParActivites = (activitesFiltrees: Ptba[]) => {
    const idsActivites = activitesFiltrees.map((a) => a.id_ptba);
    return taches.filter((t) => {
      const idPtba =
        typeof t.id_ptba === "number" ? t.id_ptba : Number(t.id_ptba);
      return idsActivites.includes(idPtba);
    });
  };

  // Filtrer pour le graphique d'exécution
  const activitesFiltreesExecution = useMemo(() => {
    return filtrerActivitesParAnnee(selectedAnneeExecution);
  }, [activites, versions, selectedAnneeExecution]);

  // Filtrer pour le graphique des tâches
  const activitesFiltreesTaches = useMemo(() => {
    return filtrerActivitesParAnnee(selectedAnneeTaches);
  }, [activites, versions, selectedAnneeTaches]);

  const tachesFiltreesTaches = useMemo(() => {
    return filtrerTachesParActivites(activitesFiltreesTaches);
  }, [taches, activitesFiltreesTaches]);

  // Filtrer pour le graphique des indicateurs
  const activitesFiltreesIndicateurs = useMemo(() => {
    return filtrerActivitesParAnnee(selectedAnneeIndicateurs);
  }, [activites, versions, selectedAnneeIndicateurs]);

  const tachesFiltreesIndicateurs = useMemo(() => {
    return filtrerTachesParActivites(activitesFiltreesIndicateurs);
  }, [taches, activitesFiltreesIndicateurs]);

  // Calcul des statistiques basées sur toutes les données (non filtrées)
  const stats: Stat[] = useMemo(() => {
    const totalTaches = taches.length;
    const tachesValidees = taches.filter(
      (t) =>
        t.valider_gt?.toLowerCase() === "validé" ||
        t.valider_gt?.toLowerCase() === "valide"
    ).length;
    const tachesEnCours = taches.filter(
      (t) => t.valider_gt?.toLowerCase() === "en cours"
    ).length;
    const tachesEnRetard = taches.filter((t) => {
      if (!t.date_fin_gt) return false;
      const dateFin = new Date(t.date_fin_gt);
      const aujourd_hui = new Date();
      return dateFin < aujourd_hui && t.valider_gt?.toLowerCase() !== "validé";
    }).length;

    const tauxRealisation =
      totalTaches > 0 ? ((tachesValidees / totalTaches) * 100).toFixed(1) : "0";

    return [
      {
        title: "Total des tâches",
        value: totalTaches.toString(),
        subtitle: "Tâches PTBA",
        icon: ClipboardListIcon,
        color: "blue",
      },
      {
        title: "Tâches validées",
        value: tachesValidees.toString(),
        subtitle: `${tauxRealisation}% de réalisation`,
        icon: CheckCircle2Icon,
        color: "green",
      },
      {
        title: "Tâches en cours",
        value: tachesEnCours.toString(),
        subtitle: "En progression",
        icon: TrendingUpIcon,
        color: "purple",
      },
      {
        title: "Tâches en retard",
        value: tachesEnRetard.toString(),
        subtitle: "Nécessitent attention",
        icon: AlertCircleIcon,
        color: "orange",
      },
    ];
  }, [taches]);

  // Données pour le graphique d'exécution des PTBA par statut
  const executionData: ExecutionData[] = useMemo(() => {
    const statutCounts: Record<string, number> = {};

    activitesFiltreesExecution.forEach((activite) => {
      const statut = activite.statut_activite || "Non défini";
      statutCounts[statut] = (statutCounts[statut] || 0) + 1;
    });

    return Object.entries(statutCounts).map(([statut, count]) => ({
      statut,
      count,
    }));
  }, [activitesFiltreesExecution]);

  // Données pour l'avancement des tâches par service
  const avancementParService: ServiceData[] = useMemo(() => {
    const serviceMap: Record<string, { total: number; terminees: number }> = {};

    tachesFiltreesTaches.forEach((tache) => {
      // Utiliser n_lot_gt comme identifiant du service/direction
      const serviceId = tache.n_lot_gt?.toString() || "Non assigné";

      if (!serviceMap[serviceId]) {
        serviceMap[serviceId] = { total: 0, terminees: 0 };
      }

      serviceMap[serviceId].total += 1;

      if (
        tache.valider_gt?.toLowerCase() === "validé" ||
        tache.valider_gt?.toLowerCase() === "valide"
      ) {
        serviceMap[serviceId].terminees += 1;
      }
    });

    return Object.entries(serviceMap)
      .map(([serviceId, data]) => {
        // Trouver le nom du service dans plansSites
        const planSite = plansSites.find(
          (ps) => ps.id_ds === Number(serviceId)
        );
        const serviceName = planSite?.intutile_ds || `Service ${serviceId}`;

        return {
          service: serviceName,
          tachesTerminees: data.terminees,
          tachesTotal: data.total,
          pourcentage:
            data.total > 0
              ? Math.round((data.terminees / data.total) * 100)
              : 0,
        };
      })
      .sort((a, b) => b.pourcentage - a.pourcentage)
      .slice(0, 10); // Top 10 services
  }, [tachesFiltreesTaches, plansSites]);

  // Données pour les indicateurs par service (simulation basée sur les tâches)
  const indicateursParService: IndicateurData[] = useMemo(() => {
    const serviceMap: Record<string, { total: number; terminees: number }> = {};

    tachesFiltreesIndicateurs.forEach((tache) => {
      const serviceId = tache.n_lot_gt?.toString() || "Non assigné";

      if (!serviceMap[serviceId]) {
        serviceMap[serviceId] = { total: 0, terminees: 0 };
      }

      serviceMap[serviceId].total += 1;

      if (
        tache.valider_gt?.toLowerCase() === "validé" ||
        tache.valider_gt?.toLowerCase() === "valide"
      ) {
        serviceMap[serviceId].terminees += 1;
      }
    });

    return Object.entries(serviceMap)
      .map(([serviceId, data]) => {
        const planSite = plansSites.find(
          (ps) => ps.id_ds === Number(serviceId)
        );
        const serviceName = planSite?.intutile_ds || `Service ${serviceId}`;

        return {
          service: serviceName,
          indicateursRealises: data.terminees,
          indicateursTotal: data.total,
          pourcentage:
            data.total > 0
              ? Math.round((data.terminees / data.total) * 100)
              : 0,
        };
      })
      .sort((a, b) => b.pourcentage - a.pourcentage)
      .slice(0, 8);
  }, [tachesFiltreesIndicateurs, plansSites]);

  const getStatColor = (color: Stat["color"]): string => {
    const colors: Record<Stat["color"], string> = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
    };
    return colors[color] || colors.blue;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RiseLoader color="#3B82F6" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-2">
            Vue d'ensemble de l'exécution du PTBA
            {currentProgramme && ` - ${currentProgramme.intitule_programme}`}
          </p>
        </div>
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
                  <span className="text-xs text-gray-500">{stat.subtitle}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${getStatColor(stat.color)}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exécution des PTBA par statut */}
        <Card
          title="Exécution des PTBA par statut"
          headerAction={
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <SelectInput
                options={[
                  { value: 0, label: "Toutes" },
                  ...anneesDisponibles.map((annee) => ({
                    value: annee,
                    label: annee.toString(),
                  })),
                ]}
                value={
                  anneesDisponibles
                    .map((annee) => ({ value: annee, label: annee.toString() }))
                    .find((opt) => opt.value === selectedAnneeExecution) || {
                    value: 0,
                    label: "Toutes",
                  }
                }
                onChange={(option) => {
                  if (option && !Array.isArray(option)) {
                    const value = option.value as number;
                    setSelectedAnneeExecution(value === 0 ? null : value);
                  }
                }}
              />
            </div>
          }
        >
          <BarChart
            data={executionData}
            xKey="statut"
            series={[
              { yKey: "count", label: "Nombre d'activités", color: "#3B82F6" },
            ]}
            height={300}
            axes={{
              yTitle: "Nombre d'activités",
              xTitle: "Statut",
            }}
          />
        </Card>

        {/* Avancement des tâches par service */}
        <Card
          title="Avancement des tâches par service (Top 10)"
          headerAction={
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <SelectInput
                options={[
                  { value: 0, label: "Toutes" },
                  ...anneesDisponibles.map((annee) => ({
                    value: annee,
                    label: annee.toString(),
                  })),
                ]}
                value={
                  anneesDisponibles
                    .map((annee) => ({ value: annee, label: annee.toString() }))
                    .find((opt) => opt.value === selectedAnneeTaches) || {
                    value: 0,
                    label: "Toutes",
                  }
                }
                onChange={(option) => {
                  if (option && !Array.isArray(option)) {
                    const value = option.value as number;
                    setSelectedAnneeTaches(value === 0 ? null : value);
                  }
                }}
              />
            </div>
          }
        >
          <BarChart
            data={avancementParService}
            xKey="service"
            series={[
              {
                yKey: "pourcentage",
                label: "Taux de réalisation (%)",
                color: "#10B981",
              },
            ]}
            height={300}
            axes={{
              yTitle: "Pourcentage (%)",
              xTitle: "Services",
            }}
          />
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Détail des tâches par service */}
        <Card title="Détail des tâches par service">
          <BarChart
            data={avancementParService.slice(0, 6)}
            xKey="service"
            series={[
              {
                yKey: "tachesTerminees",
                label: "Tâches terminées",
                color: "#3B82F6",
              },
              { yKey: "tachesTotal", label: "Total tâches", color: "#9CA3AF" },
            ]}
            height={300}
            axes={{
              yTitle: "Nombre de tâches",
              xTitle: "Services",
            }}
          />
        </Card>

        {/* Avancement des indicateurs par service */}
        <Card
          title="Avancement des indicateurs par service"
          headerAction={
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <SelectInput
                options={[
                  { value: 0, label: "Toutes" },
                  ...anneesDisponibles.map((annee) => ({
                    value: annee,
                    label: annee.toString(),
                  })),
                ]}
                value={
                  anneesDisponibles
                    .map((annee) => ({ value: annee, label: annee.toString() }))
                    .find((opt) => opt.value === selectedAnneeIndicateurs) || {
                    value: 0,
                    label: "Toutes",
                  }
                }
                onChange={(option) => {
                  if (option && !Array.isArray(option)) {
                    const value = option.value as number;
                    setSelectedAnneeIndicateurs(value === 0 ? null : value);
                  }
                }}
              />
            </div>
          }
        >
          <BarChart
            data={indicateursParService}
            xKey="service"
            series={[
              {
                yKey: "pourcentage",
                label: "Taux de réalisation (%)",
                color: "#8B5CF6",
              },
            ]}
            height={300}
            axes={{
              yTitle: "Pourcentage (%)",
              xTitle: "Services",
            }}
          />
        </Card>
      </div>

      {/* Tableau récapitulatif */}
      <Card title="Récapitulatif par service">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tâches terminées
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total tâches
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taux de réalisation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {avancementParService.map((service, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {service.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.tachesTerminees}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.tachesTotal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${service.pourcentage}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">
                        {service.pourcentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
