import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Plus, Eye, BarChart3 } from "lucide-react";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import type { IndicateurCadreResultat } from "../../../types/entities";
import { indicateurCadreResultatService } from "../../../services/indicateurCadreResultatService";

interface IndicateurCadreResultatListProps {
  onEdit: (indicateur: IndicateurCadreResultat) => void;
  onAdd: () => void;
  onView: (indicateur: IndicateurCadreResultat) => void;
}

export default function IndicateurCadreResultatList({
  onEdit,
  onAdd,
  onView,
}: IndicateurCadreResultatListProps) {
  const queryClient = useQueryClient();

  // Fetch indicateurs data
  const { data: indicateurs = [] } = useQuery<IndicateurCadreResultat[]>({
    queryKey: ["indicateursCadreResultat"],
    queryFn: indicateurCadreResultatService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: indicateurCadreResultatService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["indicateursCadreResultat"] });
    },
  });


  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet indicateur ?")) {
      deleteMutation.mutate(id);
    }
  };


  const columns = [
    {
      key: "code_indicateur_cr_iop" as keyof IndicateurCadreResultat,
      title: "Code Indicateur",
      render: (
        _: IndicateurCadreResultat[keyof IndicateurCadreResultat],
        indicateur: IndicateurCadreResultat
      ) => (
        <span className="font-mono text-sm">
          {indicateur.code_indicateur_cr_iop}
        </span>
      ),
    },
    {
      key: "code_cr_iop" as keyof IndicateurCadreResultat,
      title: "Code CR",
      render: (
        _: IndicateurCadreResultat[keyof IndicateurCadreResultat],
        indicateur: IndicateurCadreResultat
      ) => (
        <span className="font-mono text-sm">
          {indicateur.code_cr_iop}
        </span>
      ),
    },
    {
      key: "intitule_indicateur_cr_iop" as keyof IndicateurCadreResultat,
      title: "Intitulé",
      render: (
        _: IndicateurCadreResultat[keyof IndicateurCadreResultat],
        indicateur: IndicateurCadreResultat
      ) => (
        <div className="max-w-xs">
          <span className="font-medium">
            {indicateur.intitule_indicateur_cr_iop}
          </span>
          {indicateur.description_iop && (
            <p
              className="text-xs text-muted-foreground mt-1 truncate"
              title={indicateur.description_iop}
            >
              {indicateur.description_iop}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "niveau_iop" as keyof IndicateurCadreResultat,
      title: "Niveau IOP",
      render: (
        _: IndicateurCadreResultat[keyof IndicateurCadreResultat],
        indicateur: IndicateurCadreResultat
      ) => {
        if (!indicateur.niveau_iop) return "-";
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            Niveau {indicateur.niveau_iop}
          </span>
        );
      },
    },
    {
      key: "periodicite_iop" as keyof IndicateurCadreResultat,
      title: "Périodicité",
      render: (
        _: IndicateurCadreResultat[keyof IndicateurCadreResultat],
        indicateur: IndicateurCadreResultat
      ) => <span className="text-sm">{indicateur.periodicite_iop || "-"}</span>,
    },
    {
      key: "responsable_iop" as keyof IndicateurCadreResultat,
      title: "Responsable",
      render: (
        _: IndicateurCadreResultat[keyof IndicateurCadreResultat],
        indicateur: IndicateurCadreResultat
      ) => (
        <span className="text-sm">
          {indicateur.responsable_iop || "-"}
        </span>
      ),
    },
    {
      key: "source_iop" as keyof IndicateurCadreResultat,
      title: "Source",
      render: (
        _: IndicateurCadreResultat[keyof IndicateurCadreResultat],
        indicateur: IndicateurCadreResultat
      ) => (
        <span className="text-sm">
          {indicateur.source_iop || "-"}
        </span>
      ),
    },
    {
      key: "actions" as keyof IndicateurCadreResultat,
      title: "Actions",
      render: (
        _: IndicateurCadreResultat[keyof IndicateurCadreResultat],
        indicateur: IndicateurCadreResultat
      ) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(indicateur)}
            className="p-1"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(indicateur)}
            className="p-1"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(indicateur.id_indicateur_cr_iop)}
            className="p-1 border-red-600 text-red-600 hover:bg-red-50"
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h2 className="text-2xl text-foreground font-bold">
            Indicateurs de cadre de résultat
          </h2>
        </div>
        <Button variant="primary" onClick={onAdd}>
          <Plus size={20} />
          Nouvel Indicateur
        </Button>
      </div>

      <Table<IndicateurCadreResultat & { id?: string | number }>
        title="Liste des indicateurs de cadre de résultat"
        columns={columns}
        data={indicateurs.map((i) => ({
          ...i,
          id: i.id_indicateur_cr_iop,
        }))}
      />
    </div>
  );
}
