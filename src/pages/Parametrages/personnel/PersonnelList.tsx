import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Table from "../../../components/Table";
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

  // Fetch personnel data
  const { data: personnel = [], isLoading } = useQuery<Personnel[]>({
    queryKey: ["personnel"],
    queryFn: async (): Promise<Personnel[]> => {
      const response = await apiClient.request("/personnel/");
      return Array.isArray(response) ? response : [];
    },
  });

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
      key: "n_personnel" as keyof Personnel,
      title: "ID",
    },
    {
      key: "id_personnel_perso" as keyof Personnel,
      title: "ID Personnel",
    },
    {
      key: "titre_personnel" as keyof Personnel,
      title: "Titre",
    },
    {
      key: "nom_perso" as keyof Personnel,
      title: "Nom",
    },
    {
      key: "prenom_perso" as keyof Personnel,
      title: "Prénom",
    },
    {
      key: "email" as keyof Personnel,
      title: "Email",
    },
    {
      key: "contact_perso" as keyof Personnel,
      title: "Contact",
    },
    {
      key: "fonction_perso" as keyof Personnel,
      title: "Fonction",
    },
    {
      key: "description_fonction_perso" as keyof Personnel,
      title: "Description",
    },
    {
      key: "niveau_perso" as keyof Personnel,
      title: "Niveau d'accès",
      render: (_: Personnel[keyof Personnel], personnel: Personnel) => {
        return personnel.niveau_perso === 1 ? "Editeur" : "Visiteur";
      },
    },
    {
      key: "structure_perso" as keyof Personnel,
      title: "Structure",
      render: (_: Personnel[keyof Personnel], personnel: Personnel) => {
        if (!personnel.structure_perso) return "-";
        const structureId = typeof personnel.structure_perso === 'string' ? parseInt(personnel.structure_perso) : personnel.structure_perso;
        const structure = structures.find(s => s.id_acteur === structureId);
        return structure ? `${structure.nom_acteur} (${structure.code_acteur})` : `ID: ${personnel.structure_perso}`;
      },
    },
    {
      key: "ugl_perso" as keyof Personnel,
      title: "UGL",
      render: (_: Personnel[keyof Personnel], personnel: Personnel) => {
        if (!personnel.ugl_perso) return "-";
        const uglId = typeof personnel.ugl_perso === 'string' ? parseInt(personnel.ugl_perso) : personnel.ugl_perso;
        const ugl = ugls.find(u => u.id_ugl === uglId);
        return ugl ? `${ugl.nom_ugl} (${ugl.code_ugl})` : `ID: ${personnel.ugl_perso}`;
      },
    },
    {
      key: "region_perso" as keyof Personnel,
      title: "Région",
      render: (_: Personnel[keyof Personnel], personnel: Personnel) => {
        if (!personnel.region_perso) return "-";
        const region = regions.find(r => r.id_loca === personnel.region_perso);
        return region ? `${region.intitule_loca} (${region.code_loca})` : `ID: ${personnel.region_perso}`;
      },
    },
    {
      key: "statut" as keyof Personnel,
      title: "Statut",
    },
    {
      key: "rapport_mensuel_perso" as keyof Personnel,
      title: "Rapports",
      render: (_: Personnel[keyof Personnel], personnel: Personnel) => (
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
      key: "n_personnel" as keyof Personnel,
      title: "Actions",
      render: (_: Personnel[keyof Personnel], personnel: Personnel) => (
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

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-gray-500">Chargement...</div>
        </div>
      ) : (
        <Table<Personnel & { id?: string | number }>
          columns={columns}
          data={personnel.map(p => ({ ...p, id: p.n_personnel }))}
          className="min-h-[400px]"
        />
      )}
    </div>
  );
}
