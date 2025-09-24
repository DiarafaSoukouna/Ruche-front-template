import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import { cadreResultatService } from "../../../services/cadreResultatService";
import { niveauCadreResultatService } from "../../../services/niveauCadreResultatService";
import { acteurService } from "../../../services/acteurService";
import type {
  CadreResultat,
  NiveauCadreResultat,
  Acteur,
} from "../../../types/entities";
import { Eye, Plus, EditIcon, TrashIcon } from "lucide-react";

interface CadreResultatListProps {
  onEdit: (cadre: CadreResultat) => void;
  onCreate: () => void;
  onView: (cadreId: number) => void;
}

export default function CadreResultatList({
  onEdit,
  onCreate,
  onView,
}: CadreResultatListProps) {
  const queryClient = useQueryClient();

  // Fetch data
  const { data: cadres = [] } = useQuery<CadreResultat[]>({
    queryKey: ["cadresResultat"],
    queryFn: () => cadreResultatService.getAll(),
  });

  const { data: niveaux = [] } = useQuery<NiveauCadreResultat[]>({
    queryKey: ["niveauxCadreResultat"],
    queryFn: niveauCadreResultatService.getAll,
  });

  const { data: acteurs = [] } = useQuery<Acteur[]>({
    queryKey: ["acteurs"],
    queryFn: acteurService.getAll,
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: cadreResultatService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadresResultat"] });
    },
  });

  const handleDelete = (cadre: CadreResultat) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer le cadre "${cadre.intutile_cr}" ?`
      )
    ) {
      deleteMutation.mutate(cadre.id_cr);
    }
  };

  const columns = [
    {
      key: "code_cr" as keyof CadreResultat,
      title: "Code",
      render: (_: CadreResultat[keyof CadreResultat], row: CadreResultat) => (
        <span className="font-mono text-sm">{row.code_cr}</span>
      ),
    },
    {
      key: "intutile_cr" as keyof CadreResultat,
      title: "Intitulé",
      render: (_: CadreResultat[keyof CadreResultat], row: CadreResultat) => (
        <div>
          <div className="font-medium text-foreground">{row.intutile_cr}</div>
          {row.abgrege_cr && (
            <div className="text-xs text-muted-foreground">
              {row.abgrege_cr}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "cout_axe" as keyof CadreResultat,
      title: "Coût axe",
      render: (_: CadreResultat[keyof CadreResultat], row: CadreResultat) => (
        <span className="text-sm">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "XOF",
          }).format(row.cout_axe)}
        </span>
      ),
    },
    {
      key: "niveau_cr" as keyof CadreResultat,
      title: "Niveau",
      render: (_: CadreResultat[keyof CadreResultat], row: CadreResultat) => {
        const niveau = niveaux.find((n) => n.id_ncr === row.niveau_cr);
        return (
          <span className="text-sm">
            {niveau
              ? `${niveau.nombre_ncr} - ${niveau.libelle_ncr}`
              : "Non défini"}
          </span>
        );
      },
    },
    {
      key: "parent_cr" as keyof CadreResultat,
      title: "Parent",
      render: (_: CadreResultat[keyof CadreResultat], row: CadreResultat) => {
        const parent = cadres.find((c) => c.id_cr === row.parent_cr);
        return (
          <span className="text-sm">
            {parent ? (
              <div>
                <div className="font-medium text-gray-900">
                  {parent.intutile_cr}
                </div>
                <div className="text-xs text-gray-500">{parent.code_cr}</div>
              </div>
            ) : (
              <span className="text-gray-400 italic">Racine</span>
            )}
          </span>
        );
      },
    },
    {
      key: "partenaire_cr" as keyof CadreResultat,
      title: "Partenaire",
      render: (_: CadreResultat[keyof CadreResultat], row: CadreResultat) => {
        const partenaire = acteurs.find(
          (a) => a.code_acteur === row.partenaire_cr
        );
        return (
          <span className="text-sm">
            {partenaire ? (
              <div>
                <div className="font-medium text-gray-900">
                  {partenaire.nom_acteur}
                </div>
                <div className="text-xs text-gray-500">
                  {partenaire.code_acteur}
                </div>
              </div>
            ) : (
              <span className="text-gray-400">Non défini</span>
            )}
          </span>
        );
      },
    },
    {
      key: "etat" as keyof CadreResultat,
      title: "État",
      render: (_: CadreResultat[keyof CadreResultat], row: CadreResultat) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.etat
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {row.etat ? "Actif" : "Inactif"}
        </span>
      ),
    },
    {
      key: "actions" as keyof CadreResultat,
      title: "Actions",
      render: (_: CadreResultat[keyof CadreResultat], row: CadreResultat) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView(row.id_cr)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
            <EditIcon className="w-3 h-3" />
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(row)}>
            <TrashIcon className="w-3 h-3" />
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
            Cadres de Résultat
          </h1>
        </div>
        <Button onClick={onCreate} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nouveau cadre</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">
            {cadres.length}
          </div>
          <div className="text-sm text-muted-foreground">Total cadres</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {cadres.filter((c) => c.etat === "Actif").length}
          </div>
          <div className="text-sm text-muted-foreground">Actifs</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {cadres.filter((c) => c.parent_cr === null).length}
          </div>
          <div className="text-sm text-muted-foreground">Racines</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {cadres
              .reduce((sum, c) => sum + c.cout_axe, 0)
              .toLocaleString("fr-FR")}
          </div>
          <div className="text-sm text-muted-foreground">Coût total (XOF)</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg">
        <Table<CadreResultat & { id: string | number }>
          title="Liste des cadres de résultat"
          data={cadres.map((c) => ({ ...c, id: c.id_cr }))}
          columns={columns}
        />
      </div>
    </div>
  );
}
