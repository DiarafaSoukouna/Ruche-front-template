import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Calendar, Target, Code, Building, FolderOpen } from "lucide-react";
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

  const { data: cible, isLoading, error } = useQuery({
    queryKey: ["cible-cmr-projet", cibleId],
    queryFn: () => cibleCmrProjetService.getById(cibleId),
    enabled: !!cibleId,
  });

  // Récupérer les détails de l'indicateur si disponible
  const { data: indicateur } = useQuery({
    queryKey: ["indicateur-cadre-resultat", cible?.code_indicateur_crp],
    queryFn: () => indicateurCadreResultatService.getById(cible!.code_indicateur_crp!),
    enabled: !!cible?.code_indicateur_crp,
  });

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
        <p className="text-red-600">Erreur lors du chargement de la cible CMR projet</p>
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
          onClick={() => navigate(`/parametrages/cible-cmr-projet/${cible.id_cible_indicateur_crp}/edit`)}
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
                {indicateur && (
                  <p className="text-sm text-gray-600 mt-1">
                    {indicateur.libelle_icr}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code UG
                </label>
                <p className="text-gray-900">
                  {cible.code_ug || "Non défini"}
                </p>
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
