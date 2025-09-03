import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Edit, TrashIcon, Plus, Check, X, Settings } from "lucide-react";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import Modal from "../../../components/Modal";
import type { Personnel, Region, UGL } from "../../../types/entities";
import { personnelService } from "../../../services/personnelService";
import { apiClient } from "../../../lib/api";
import TitrePersonnelPage from "./titre-personnel/TitrePersonnelPage";

interface PersonnelListProps {
  onEdit: (personnel: Personnel) => void;
  onAdd: () => void;
}

export default function PersonnelList({ onEdit, onAdd }: PersonnelListProps) {
  const queryClient = useQueryClient();
  const [showTitreModal, setShowTitreModal] = useState(false);

  // Fetch personnel data
  const { data: personnels = [] } = useQuery<Personnel[]>({
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
    },
  });

  const enableMutation = useMutation({
    mutationFn: personnelService.enable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personnel"] });
    },
  });

  const disableMutation = useMutation({
    mutationFn: personnelService.disable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personnel"] });
    },
  });

  const handleDelete = (id: number) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStatus = (personnel: Personnel) => {
    const isActive = personnel.statut === 1;
    const action = isActive ? "désactiver" : "activer";

    if (
      window.confirm(`Êtes-vous sûr de vouloir ${action} cet utilisateur ?`)
    ) {
      if (isActive) {
        disableMutation.mutate(personnel.n_personnel!);
      } else {
        enableMutation.mutate(personnel.n_personnel!);
      }
    }
  };

  const columns = [
    {
      key: "n_personnel" as keyof Personnel,
      title: "ID",
    },
    {
      key: "titre_personnel" as keyof Personnel,
      title: "Titre",
      render: (_: Personnel[keyof Personnel], personnel: Personnel) => {
        if (!personnel.titre_personnel) return "-";
        return typeof personnel.titre_personnel === "object"
          ? personnel.titre_personnel.libelle_titre
          : `ID: ${personnel.titre_personnel}`;
      },
    },
    {
      key: "prenom_perso" as keyof Personnel,
      title: "Prénom",
    },
    {
      key: "id_personnel_perso" as keyof Personnel,
      title: "Identifiant",
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
      render: (_: Personnel[keyof Personnel], personnel: Personnel) => {
        if (!personnel.fonction_perso) return "-";
        return typeof personnel.fonction_perso === "object"
          ? `${personnel.fonction_perso.nom_fonction}`
          : `ID: ${personnel.fonction_perso}`;
      },
    },
    {
      key: "service_perso" as keyof Personnel,
      title: "Service/Direction",
      render: (_: Personnel[keyof Personnel], personnel: Personnel) => {
        if (!personnel.service_perso) return "-";
        return typeof personnel.service_perso === "object"
          ? `${personnel.service_perso.intutile_ds}`
          : `${personnel.service_perso}`;
      },
    },
    {
      key: "structure_perso" as keyof Personnel,
      title: "Structure",
      render: (_: Personnel[keyof Personnel], personnel: Personnel) => {
        if (!personnel.structure_perso) return "-";
        return typeof personnel.structure_perso === "object"
          ? `${personnel.structure_perso.nom_acteur} (${personnel.structure_perso.code_acteur})`
          : `ID: ${personnel.structure_perso}`;
      },
    },
    {
      key: "ugl_perso" as keyof Personnel,
      title: "UGL",
      render: (_: Personnel[keyof Personnel], personnel: Personnel) => {
        if (!personnel.ugl_perso) return "-";
        const uglId =
          typeof personnel.ugl_perso === "string"
            ? parseInt(personnel.ugl_perso)
            : personnel.ugl_perso;
        const ugl = ugls.find((u) => u.id_ugl === uglId);
        return ugl
          ? `${ugl.nom_ugl} (${ugl.code_ugl})`
          : `ID: ${personnel.ugl_perso}`;
      },
    },
    {
      key: "region_perso" as keyof Personnel,
      title: "Région",
      render: (_: Personnel[keyof Personnel], personnel: Personnel) => {
        if (!personnel.region_perso) return "-";
        const region = regions.find(
          (r) => r.id_loca === personnel.region_perso
        );
        return region
          ? `${region.intitule_loca} (${region.code_loca})`
          : `ID: ${personnel.region_perso}`;
      },
    },
    {
      key: "niveau_perso" as keyof Personnel,
      title: "Niveau d'accès",
      render: (_: Personnel[keyof Personnel], personnel: Personnel) => {
        return personnel.niveau_perso === 1 ? "Editeur" : "Visiteur";
      },
    },
    {
      key: "statut" as keyof Personnel,
      title: "Statut",
      render: (_: Personnel[keyof Personnel], personnel: Personnel) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            personnel.statut === 1
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {personnel.statut === 1 ? "Actif" : "Inactif"}
        </span>
      ),
    },
    {
      key: "actions" as keyof Personnel,
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
          {personnel.statut === 1 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggleStatus(personnel)}
              className="p-1 border-orange-600 text-orange-600 hover:bg-orange-50 focus:ring-orange-500"
              disabled={disableMutation.isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggleStatus(personnel)}
              className="p-1 !border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500"
              disabled={enableMutation.isPending}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(personnel.n_personnel!)}
            disabled={deleteMutation.isPending}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-foreground font-bold">Utilisateurs</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowTitreModal(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Gérer les titres
          </Button>
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </div>
      </div>

      <Table<Personnel & { id?: string | number }>
        title="Liste des utilisateurs"
        columns={columns}
        data={personnels.map((p) => ({ ...p, id: p.n_personnel }))}
      />

      {/* Modal pour gérer les titres */}
      <Modal
        isOpen={showTitreModal}
        onClose={() => setShowTitreModal(false)}
        title="Gestion des titres"
        size="lg"
      >
        <TitrePersonnelPage />
      </Modal>
    </div>
  );
}
