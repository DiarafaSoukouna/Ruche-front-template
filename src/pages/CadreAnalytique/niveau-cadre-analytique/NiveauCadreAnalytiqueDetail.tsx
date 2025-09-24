import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import { niveauCadreAnalytiqueService } from "../../../services/niveauCadreAnalytiqueService";
import { getTypeNiveauLabel } from "../../../schemas/niveauCadreAnalytiqueSchema";
import { RiseLoader } from "react-spinners";

export default function NiveauCadreAnalytiqueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const niveauId = parseInt(id || "0");

  const {
    data: niveau,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["niveau-cadre-analytique", niveauId],
    queryFn: () => niveauCadreAnalytiqueService.getById(niveauId),
    enabled: !!niveauId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <RiseLoader color="#3B82F6" />
      </div>
    );
  }

  if (error || !niveau) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erreur lors du chargement du niveau</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Retour
        </Button>
      </div>
    );
  }

  const typeLabel = getTypeNiveauLabel(
    (typeof niveau.type_niveau === "string"
      ? parseInt(niveau.type_niveau)
      : niveau.type_niveau) as 1 | 2 | 3
  );
  const typeColorClass =
    niveau.type_niveau === 1
      ? "bg-blue-100 text-blue-800"
      : niveau.type_niveau === 2
      ? "bg-green-100 text-green-800"
      : "bg-purple-100 text-purple-800";

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
              {niveau.libelle_nca}
            </h1>
            <p className="text-gray-600">
              Détails du niveau de cadre analytique
            </p>
          </div>
        </div>
        <Button
          onClick={() =>
            navigate(
              `/parametrages/niveau-cadre-analytique/${niveau.id_nca}/edit`
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
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Informations générales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {niveau.nombre_nca}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code numérique
              </label>
              <p className="text-lg text-gray-900">{niveau.code_number_nca}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Libellé
              </label>
              <p className="text-lg text-gray-900">{niveau.libelle_nca}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de niveau
              </label>
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${typeColorClass}`}
              >
                {typeLabel}
              </span>
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
              <p className="text-gray-900">#{niveau.id_nca}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
