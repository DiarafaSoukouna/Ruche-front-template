import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import { indicateurCmrService } from "../../../services/indicateurCmrService";
import type { IndicateurCmr } from "../../../types/entities";
import { Edit, Trash2, Eye, Plus, TargetIcon } from "lucide-react";

interface IndicateurCmrListProps {
  onEdit: (indicateur: IndicateurCmr) => void;
  onCreate: () => void;
  onView: (indicateurId: number) => void;
  onOpenCiblesCmr: () => void;
}

export default function IndicateurCmrList({
  onEdit,
  onCreate,
  onView,
  onOpenCiblesCmr,
}: IndicateurCmrListProps) {
  const queryClient = useQueryClient();

  // Fetch data
  const { data: indicateurs = [] } = useQuery<IndicateurCmr[]>({
    queryKey: ["indicateursCmr"],
    queryFn: indicateurCmrService.getAll,
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: indicateurCmrService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["indicateursCmr"] });
    },
  });

  const handleDelete = (indicateur: IndicateurCmr) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer l'indicateur "${indicateur.intitule_ref_ind}" ?`
      )
    ) {
      deleteMutation.mutate(indicateur.id_ref_ind_cmr);
    }
  };

  const columns = [
    {
      key: "code_ref_ind" as keyof IndicateurCmr,
      title: "Code",
    },
    {
      key: "intitule_ref_ind" as keyof IndicateurCmr,
      title: "Intitulé",
      render: (_: IndicateurCmr[keyof IndicateurCmr], row: IndicateurCmr) => (
        <div>
          <div className="font-medium text-foreground">
            {row.intitule_ref_ind}
          </div>
          {row.resultat_cmr && (
            <div className="text-xs text-muted-foreground">
              Résultat: {row.resultat_cmr}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "unite_cmr" as keyof IndicateurCmr,
      title: "Unité",
      render: (_: IndicateurCmr[keyof IndicateurCmr], row: IndicateurCmr) => (
        <span className="text-sm">{row.unite_cmr?.unite_ui}</span>
      ),
    },
    {
      key: "annee_reference" as keyof IndicateurCmr,
      title: "Année réf.",
    },
    {
      key: "cible_cmr" as keyof IndicateurCmr,
      title: "Cible",
    },
    {
      key: "fonction_agregat_cmr" as keyof IndicateurCmr,
      title: "Fonction agrégation",
      render: (_: IndicateurCmr[keyof IndicateurCmr], row: IndicateurCmr) => (
        <span className="text-sm">
          {row.fonction_agregat_cmr || "Non définie"}
        </span>
      ),
    },
    {
      key: "responsable_collecte_cmr" as keyof IndicateurCmr,
      title: "Responsable",
    },
    {
      key: "reference_cmr" as keyof IndicateurCmr,
      title: "Référence",
    },
    {
      key: "actions" as keyof IndicateurCmr,
      title: "Actions",
      render: (_: IndicateurCmr[keyof IndicateurCmr], row: IndicateurCmr) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(row.id_ref_ind_cmr)}
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
      {/* Header  */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Indicateurs CMR</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onOpenCiblesCmr}
            className="flex items-center space-x-2"
          >
            <TargetIcon className="h-4 w-4" />
            <span>Cibles CMR</span>
          </Button>
          <Button onClick={onCreate} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nouvel indicateur CMR</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">
            {indicateurs.length}
          </div>
          <div className="text-sm text-muted-foreground">Total indicateurs</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {indicateurs.filter((i) => i.cible_cmr).length}
          </div>
          <div className="text-sm text-muted-foreground">
            Avec cible définie
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {indicateurs.filter((i) => i.unite_cmr).length}
          </div>
          <div className="text-sm text-muted-foreground">
            Avec unité définie
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {new Set(indicateurs.map((i) => i.annee_reference)).size}
          </div>
          <div className="text-sm text-muted-foreground">
            Années de référence
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg">
        <Table<IndicateurCmr & { id: string | number }>
          title="Liste des indicateurs CMR"
          data={indicateurs.map((i) => ({ ...i, id: i.id_ref_ind_cmr }))}
          columns={columns}
        />
      </div>
    </div>
  );
}
