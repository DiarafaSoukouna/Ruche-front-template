import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import DataTable from "../../../components/DataTable";
import Button from "../../../components/Button";
import { personnelService } from "../../../services/personnelService";
import type { Personnel } from "../../../types/entities";

interface PersonnelListProps {
  onEdit: (personnel: Personnel) => void;
  onAdd: () => void;
}

export default function PersonnelList({ onEdit, onAdd }: PersonnelListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

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
      header: "Niveau",
      accessor: "niveau_perso" as keyof Personnel,
    },
    {
      header: "Structure",
      accessor: "structure_perso" as keyof Personnel,
    },
    {
      header: "UGL",
      accessor: "ugl_perso" as keyof Personnel,
    },
    {
      header: "Région",
      accessor: "region_perso" as keyof Personnel,
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
            className="p-1 text-red-600 hover:text-red-700"
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

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          />
        </div>
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
