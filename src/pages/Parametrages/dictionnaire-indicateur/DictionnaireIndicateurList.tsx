import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import { dictionnaireIndicateurService } from "../../../services/dictionnaireIndicateurService";
import type { DictionnaireIndicateur } from "../../../types/entities";
import { Edit, Trash2, Eye, Plus, BookOpen } from "lucide-react";

interface DictionnaireIndicateurListProps {
  onEdit: (dictionnaire: DictionnaireIndicateur) => void;
  onCreate: () => void;
  onView: (dictionnaire: DictionnaireIndicateur) => void;
}

export default function DictionnaireIndicateurList({
  onEdit,
  onCreate,
  onView,
}: DictionnaireIndicateurListProps) {
  const queryClient = useQueryClient();

  // Fetch data
  const { data: dictionnaires = [] } = useQuery<DictionnaireIndicateur[]>({
    queryKey: ["dictionnaireIndicateur"],
    queryFn: dictionnaireIndicateurService.getAll,
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: dictionnaireIndicateurService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dictionnaireIndicateur"] });
    },
  });

  const handleDelete = (dictionnaire: DictionnaireIndicateur) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer l'indicateur "${dictionnaire.intitule_ref_ind}" ?`
      )
    ) {
      deleteMutation.mutate(dictionnaire.id_ref_ind_ref);
    }
  };

  // Note: Status toggle functionality removed as statut_ref_ind is not in current schema

  const getTypologieColor = (typologie?: string) => {
    const colors = {
      "Valeur absolue":
        "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20",
      "Valeur relative":
        "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20",
      "Typologie quantitative":
        "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20",
      "Typologie qualitative":
        "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20",
    };

    return typologie
      ? colors[typologie as keyof typeof colors] ||
          "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20"
      : "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
  };

  const columns = [
    {
      key: "code_ref_ind" as keyof DictionnaireIndicateur,
      title: "Code",
    },
    {
      key: "intitule_ref_ind" as keyof DictionnaireIndicateur,
      title: "Intitulé",
    },
    {
      key: "echelle" as keyof DictionnaireIndicateur,
      title: "Échelle",
      render: (
        _: DictionnaireIndicateur[keyof DictionnaireIndicateur],
        row: DictionnaireIndicateur
      ) => <span>{row.echelle?.nom_type_zone || "Non défini"}</span>,
    },
    {
      key: "typologie" as keyof DictionnaireIndicateur,
      title: "Typologie",
      render: (
        _: DictionnaireIndicateur[keyof DictionnaireIndicateur],
        row: DictionnaireIndicateur
      ) =>
        row.typologie ? (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypologieColor(
              row.typologie
            )}`}
          >
            {row.typologie}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Non défini</span>
        ),
    },
    {
      key: "unite_cmr" as keyof DictionnaireIndicateur,
      title: "Unité de mesure",
      render: (
        _: DictionnaireIndicateur[keyof DictionnaireIndicateur],
        row: DictionnaireIndicateur
      ) => (
        <span>
          {row.unite_cmr
            ? `${row.unite_cmr.unite_ui} - ${row.unite_cmr.definition_ui}`
            : "Non défini"}
        </span>
      ),
    },
    {
      key: "fonction_agregat_cmr" as keyof DictionnaireIndicateur,
      title: "Fonction d'agrégation",
      render: (
        _: DictionnaireIndicateur[keyof DictionnaireIndicateur],
        row: DictionnaireIndicateur
      ) => (
        <span className="text-sm">
          {row.fonction_agregat_cmr || "Non défini"}
        </span>
      ),
    },
    {
      key: "responsable_collecte_cmr" as keyof DictionnaireIndicateur,
      title: "Responsable collecte",
      render: (
        _: DictionnaireIndicateur[keyof DictionnaireIndicateur],
        row: DictionnaireIndicateur
      ) => (
        <span className="text-sm">
          {row.responsable_collecte_cmr?.nom_acteur || "Non défini"}
        </span>
      ),
    },
    {
      key: "seuil_minimum" as keyof DictionnaireIndicateur,
      title: "Seuils",
      render: (
        _: DictionnaireIndicateur[keyof DictionnaireIndicateur],
        row: DictionnaireIndicateur
      ) => (
        <div className="text-sm">
          {row.seuil_minimum !== undefined && row.seuil_maximum !== undefined
            ? `${row.seuil_minimum} - ${row.seuil_maximum}`
            : row.seuil_minimum !== undefined
            ? `Min: ${row.seuil_minimum}`
            : row.seuil_maximum !== undefined
            ? `Max: ${row.seuil_maximum}`
            : "Non défini"}
        </div>
      ),
    },
    {
      key: "actions" as keyof DictionnaireIndicateur,
      title: "Actions",
      render: (
        _: DictionnaireIndicateur[keyof DictionnaireIndicateur],
        row: DictionnaireIndicateur
      ) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(row)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row)}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/20"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row)}
            disabled={deleteMutation.isPending}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dictionnaire des indicateurs
          </h1>
        </div>
        <Button onClick={onCreate} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Ajouter un indicateur</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-foreground">
                {dictionnaires.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Total indicateurs
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {dictionnaires.filter((d) => d.unite_cmr).length}
          </div>
          <div className="text-sm text-muted-foreground">Avec unité</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {dictionnaires.filter((d) => d.typologie === "Impact").length}
          </div>
          <div className="text-sm text-muted-foreground">Impact</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {dictionnaires.filter((d) => d.typologie === "Effet").length}
          </div>
          <div className="text-sm text-muted-foreground">Effet</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg">
        <Table<DictionnaireIndicateur & { id?: string | number }>
          title="Liste des indicateurs"
          data={dictionnaires}
          columns={columns}
        />
      </div>
    </div>
  );
}
