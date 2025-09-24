import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Calendar,
  Target,
  Code,
  Building,
  FolderOpen,
} from "lucide-react";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import { cibleCmrProjetService } from "../../../services/cibleCmrProjetService";
import { indicateurCadreResultatService } from "../../../services/indicateurCadreResultatService";
import { formatValeurCible } from "../../../schemas/cibleCmrProjetSchema";
import { RiseLoader } from "react-spinners";

export default function CibleCmrProjetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cibleId = parseInt(id || "0");

  const {
    data: cible,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cible-cmr-projet", cibleId],
    queryFn: () => cibleCmrProjetService.getById(cibleId),
    enabled: !!cibleId && !isNaN(cibleId) && cibleId > 0,
  });

  // Récupérer tous les indicateurs pour trouver celui correspondant au code
  const { data: indicateurs = [], isLoading: isLoadingIndicateurs } = useQuery({
    queryKey: ["indicateurs-cadre-resultat"],
    queryFn: indicateurCadreResultatService.getAll,
    enabled: !!cible?.code_indicateur_crp,
    staleTime: 5 * 60 * 1000, // Cache pendant 5 minutes
  });

  // Trouver l'indicateur correspondant au code
  const indicateur = indicateurs.find(
    (ind) => ind.code_indicateur_cr_iop === cible?.code_indicateur_crp
  );

  // Validation de l'ID après les hooks
  if (!id || isNaN(cibleId) || cibleId <= 0) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">ID de cible invalide</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Retour
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <RiseLoader color="#3B82F6" />
      </div>
    );
  }

  if (error || !cible) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">
          Erreur lors du chargement de la cible CMR projet
        </p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Cible CMR Projet - {cible.annee}
            </h1>
            <p className="text-gray-600">Détails de la cible CMR projet</p>
          </div>
        </div>
        <Button
          onClick={() =>
            navigate(
              `/parametrages/cible-cmr-projet/${cible.id_cible_indicateur_crp}/edit`
            )
          }
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Modifier
        </Button>
      </div>

      {/* Informations principales */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Informations de la cible
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Année de la cible
                </label>
                <p className="text-lg font-semibold text-blue-600">
                  {cible.annee}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valeur cible
                </label>
                <p className="text-lg font-semibold text-green-600">
                  {formatValeurCible(cible.valeur_cible_indcateur_crp)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Informations de liaison */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Code className="h-5 w-5 text-purple-500" />
            Informations de liaison
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Code className="h-5 w-5 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code indicateur CRP
                </label>
                <p className="text-gray-900">
                  {cible.code_indicateur_crp || "Non défini"}
                </p>
                {isLoadingIndicateurs && cible.code_indicateur_crp && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">
                      Chargement des informations de l'indicateur...
                    </p>
                  </div>
                )}
                {!isLoadingIndicateurs && indicateur && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-900">
                      {indicateur.intitule_indicateur_cr_iop as string}
                    </p>
                    <p className="text-xs text-blue-700">
                      Niveau: {indicateur.niveau_iop as number}
                    </p>
                  </div>
                )}
                {!isLoadingIndicateurs &&
                  !indicateur &&
                  cible.code_indicateur_crp && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded-md">
                      <p className="text-sm text-yellow-800">
                        Indicateur non trouvé
                      </p>
                    </div>
                  )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code UGL
                </label>
                <p className="text-gray-900">{cible.code_ug || "Non défini"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <FolderOpen className="h-5 w-5 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code du projet concerné
                </label>
                <p className="text-gray-900">
                  {cible.code_projet || "Non défini"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Informations système */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Informations système
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID
              </label>
              <p className="text-gray-900">#{cible.id_cible_indicateur_crp}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
