import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../../../components/Button";
import Table from "../../../../components/Table";
import { niveauCadreResultatService } from "../../../../services/niveauCadreResultatService";
import { getTypeNiveauLabel } from "../../../../schemas/cadreResultatSchemas";
import type { NiveauCadreResultat } from "../../../../types/entities";
import { Edit, Trash2, Eye, Plus } from "lucide-react";

interface NiveauCadreResultatListProps {
  onEdit: (niveau: NiveauCadreResultat) => void;
  onCreate: () => void;
  onView: (niveauId: number) => void;
}

export default function NiveauCadreResultatList({
  onEdit,
  onCreate,
  onView,
}: NiveauCadreResultatListProps) {
  const queryClient = useQueryClient();

  // Fetch data
  const { data: niveaux = [] } = useQuery<NiveauCadreResultat[]>({
    queryKey: ["niveauxCadreResultat"],
    queryFn: niveauCadreResultatService.getAll,
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: niveauCadreResultatService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["niveauxCadreResultat"] });
    },
  });

  const handleDelete = (niveau: NiveauCadreResultat) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer le niveau "${niveau.libelle_ncr}" ?`
      )
    ) {
      deleteMutation.mutate(niveau.id_ncr);
    }
  };

  const columns = [
    {
      key: "nombre_ncr" as keyof NiveauCadreResultat,
      title: "Nombre",
      render: (
        _: NiveauCadreResultat[keyof NiveauCadreResultat],
        row: NiveauCadreResultat
      ) => <span className="font-mono text-sm">{row.nombre_ncr}</span>,
    },
    {
      key: "libelle_ncr" as keyof NiveauCadreResultat,
      title: "Libellé",
      render: (
        _: NiveauCadreResultat[keyof NiveauCadreResultat],
        row: NiveauCadreResultat
      ) => (
        <div>
          <div className="font-medium text-foreground">{row.libelle_ncr}</div>
          <div className="text-xs text-muted-foreground">
            Code: {row.code_number_ncr}
          </div>
        </div>
      ),
    },
    {
      key: "type_niveau" as keyof NiveauCadreResultat,
      title: "Type",
      render: (
        _: NiveauCadreResultat[keyof NiveauCadreResultat],
        row: NiveauCadreResultat
      ) => {
        const typeValue =
          typeof row.type_niveau === "string"
            ? parseInt(row.type_niveau)
            : row.type_niveau;
        const label = getTypeNiveauLabel(typeValue as 1 | 2 | 3);
        const colorClass =
          typeValue === 1
            ? "bg-blue-100 text-blue-800"
            : typeValue === 2
            ? "bg-green-100 text-green-800"
            : "bg-purple-100 text-purple-800";

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
          >
            {label}
          </span>
        );
      },
    },
    {
      key: "actions" as keyof NiveauCadreResultat,
      title: "Actions",
      render: (
        _: NiveauCadreResultat[keyof NiveauCadreResultat],
        row: NiveauCadreResultat
      ) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(row.id_ncr)}
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Niveaux de Cadre de Résultat
          </h1>
        </div>
        <Button onClick={onCreate} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Ajouter des niveaux</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">
            {niveaux.length}
          </div>
          <div className="text-sm text-muted-foreground">Total niveaux</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {niveaux.filter((n) => n.type_niveau === 1).length}
          </div>
          <div className="text-sm text-muted-foreground">Effet</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {niveaux.filter((n) => n.type_niveau === 2).length}
          </div>
          <div className="text-sm text-muted-foreground">Produit</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {niveaux.filter((n) => n.type_niveau === 3).length}
          </div>
          <div className="text-sm text-muted-foreground">Impact</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg">
        <Table<NiveauCadreResultat & { id: string | number }>
          title="Liste des niveaux de cadre de résultat"
          data={niveaux.map((n) => ({ ...n, id: n.id_ncr }))}
          columns={columns}
        />
      </div>
    </div>
  );
}
