import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import DataTable from "../../../components/DataTable";
import Button from "../../../components/Button";
import { personnelService } from "../../../services/personnelService";
import { apiClient } from "../../../lib/api";
import type { Personnel, Region, Structure, UGL } from "../../../types/entities";

interface PersonnelListProps {
  onEdit: (personnel: Personnel) => void;
  onAdd: () => void;
}

export default function PersonnelList({ onEdit, onAdd }: PersonnelListProps) {
  const queryClient = useQueryClient();

  // Fetch related data for lookups
  const { data: regions = [] } = useQuery<Region[]>({
    queryKey: ["/localite/"],
    queryFn: async (): Promise<Region[]> => {
      const response = await apiClient.request("/localite/");
      return Array.isArray(response) ? response : [];
    },
  });

  const { data: structures = [] } = useQuery<Structure[]>({
    queryKey: ["/acteur/"],
    queryFn: async (): Promise<Structure[]> => {
      const response = await apiClient.request("/acteur/");
      return Array.isArray(response) ? response : [];
    },
  });

  const { data: ugls = [] } = useQuery<UGL[]>({
    queryKey: ["/ugl/"],
    queryFn: async (): Promise<UGL[]> => {
      const response = await apiClient.request("/ugl/");
      return Array.isArray(response) ? response : [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: personnelService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personnel"] });
      toast.success("Personnel supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce personnel ?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    {
      header: "ID",
      accessor: "n_personnel" as keyof Personnel,
    },
    {
      header: "ID Personnel",
      accessor: "id_personnel_perso" as keyof Personnel,
    },
    {
      header: "Titre",
      accessor: "titre_personnel" as keyof Personnel,
    },
    {
      header: "Nom",
      accessor: "nom_perso" as keyof Personnel,
    },
    {
      header: "Prénom",
      accessor: "prenom_perso" as keyof Personnel,
    },
    {
      header: "Email",
      accessor: "email" as keyof Personnel,
    },
    {
      header: "Contact",
      accessor: "contact_perso" as keyof Personnel,
    },
    {
      header: "Fonction",
      accessor: "fonction_perso" as keyof Personnel,
    },
    {
      header: "Description",
      accessor: "description_fonction_perso" as keyof Personnel,
    },
    {
      header: "Niveau d'accès",
      accessor: (personnel: Personnel) => {
        return personnel.niveau_perso === 1 ? "Editeur" : "Visiteur";
      },
    },
    {
      header: "Structure",
      accessor: (personnel: Personnel) => {
        if (!personnel.structure_perso) return "-";
        const structureId = typeof personnel.structure_perso === 'string' ? parseInt(personnel.structure_perso) : personnel.structure_perso;
        const structure = structures.find(s => s.id_acteur === structureId);
        return structure ? `${structure.nom_acteur} (${structure.code_acteur})` : `ID: ${personnel.structure_perso}`;
      },
    },
    {
      header: "UGL",
      accessor: (personnel: Personnel) => {
        if (!personnel.ugl_perso) return "-";
        const uglId = typeof personnel.ugl_perso === 'string' ? parseInt(personnel.ugl_perso) : personnel.ugl_perso;
        const ugl = ugls.find(u => u.id_ugl === uglId);
        return ugl ? `${ugl.nom_ugl} (${ugl.code_ugl})` : `ID: ${personnel.ugl_perso}`;
      },
    },
    {
      header: "Région",
      accessor: (personnel: Personnel) => {
        if (!personnel.region_perso) return "-";
        const region = regions.find(r => r.id_loca === personnel.region_perso);
        return region ? `${region.intitule_loca} (${region.code_loca})` : `ID: ${personnel.region_perso}`;
      },
    },
    {
      header: "Statut",
      accessor: "statut" as keyof Personnel,
    },
    {
      header: "Rapports",
      accessor: (personnel: Personnel) => (
        <div className="text-xs flex gap-2 flex-wrap items-center">
          {personnel.rapport_mensuel_perso && (
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Mensuel
            </div>
          )}
          {personnel.rapport_trimestriel_perso && (
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded">
              Trimestriel
            </div>
          )}
          {personnel.rapport_semestriel_perso && (
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Semestriel
            </div>
          )}
          {personnel.rapport_annuel_perso && (
            <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
              Annuel
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (personnel: Personnel) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(personnel)}
            className="p-1"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(personnel.n_personnel!)}
            className="p-1 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500"
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion du Personnel</h2>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un personnel
        </Button>
      </div>

      <DataTable<Personnel>
        columns={columns}
        rowKey={(personnel) => personnel.n_personnel!}
        endpoint="/personnel/"
        className="min-h-[400px]"
      />
    </div>
  );
}
