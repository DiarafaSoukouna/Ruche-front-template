import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Settings,
} from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import ptbaService from "../../services/ptbaService";
import { formatChronogramme } from "../../schemas/ptbaSchemas";
import type {
  VersionPtba,
  Ptba,
  PlanSite,
  TypeActivite,
} from "../../types/entities";
import PtbaForm from "./activite-ptba/PtbaForm";
import TypeActiviteManager from "./type-activite/TypeActiviteManager";
import { allLocalite } from "../../functions/localites/gets";
import { typeLocalite } from "../../functions/localites/types";
import { planSiteService } from "../../services/planSiteService";
import typeActiviteService from "../../services/typeActiviteService";

interface PtbaVersionContentProps {
  version: VersionPtba;
}

export default function PtbaVersionContent({
  version,
}: PtbaVersionContentProps) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [showTypeManager, setShowTypeManager] = useState(false);
  const [editingActivite, setEditingActivite] = useState<Ptba | undefined>();

  // Fetch activités pour cette version
  const { data: activites = [] } = useQuery<Ptba[]>({
    queryKey: ["ptba-activites", version.id_version_ptba],
    queryFn: () => ptbaService.getByVersion(version.id_version_ptba),
  });

  const { data: typesActivites = [] } = useQuery<TypeActivite[]>({
    queryKey: ["ptba-types-activites"],
    queryFn: () => typeActiviteService.getAll(),
  });

  const { data: localites = [] } = useQuery<typeLocalite[]>({
    queryKey: ["ptba-localites"],
    queryFn: () => allLocalite() as Promise<typeLocalite[]>,
  });

  const { data: plansSites = [] } = useQuery<PlanSite[]>({
    queryKey: ["plans-sites"],
    queryFn: () => planSiteService.getAll(),
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: ptbaService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ptba-activites", version.id_version_ptba],
      });
      toast.success("Activité supprimée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  // Handlers
  const handleAdd = () => {
    setEditingActivite(undefined);
    setShowForm(true);
  };

  const handleEdit = (activite: Ptba) => {
    setEditingActivite(activite);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingActivite(undefined);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["ptba-activites", version.id_version_ptba],
    });
    handleCloseForm();
  };

  const columns = [
    {
      key: "code_activite_ptba" as keyof Ptba,
      title: "Code",
      render: (value: Ptba[keyof Ptba]) => (
        <span className="font-mono text-sm">{String(value)}</span>
      ),
    },
    {
      key: "intitule_activite_ptba" as keyof Ptba,
      title: "Intitulé de l'activité",
      render: (_: Ptba[keyof Ptba], activite: Ptba) => (
        <div>
          <div className="font-medium text-foreground">
            {activite.intitule_activite_ptba}
          </div>
          {activite.type_activite && (
            <div className="text-xs text-muted-foreground">
              Type:{" "}
              {
                typesActivites.find((t) => t.id_type === activite.type_activite)
                  ?.intitule_type_activite as string
              }
            </div>
          )}
        </div>
      ),
    },
    {
      key: "chronogramme" as keyof Ptba,
      title: "Chronogramme",
      render: (_: Ptba[keyof Ptba], activite: Ptba) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-blue-500" />
          <span className="text-sm">
            {formatChronogramme(activite.chronogramme)}
          </span>
        </div>
      ),
    },
    {
      key: "localites_ptba" as keyof Ptba,
      title: "Localités",
      render: (_: Ptba[keyof Ptba], activite: Ptba) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-green-500" />
          <span className="text-sm">
            {localites
              .filter((l) => activite.localites_ptba?.includes(l.id_loca))
              .map((l) => l.intitule_loca)
              .join(", ")}
          </span>
        </div>
      ),
    },
    {
      key: "partenaire_conserne_ptba" as keyof Ptba,
      title: "Partenaires",
      render: (_: Ptba[keyof Ptba], activite: Ptba) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-purple-500" />
          <span className="text-sm">
            {plansSites
              .filter((ps) =>
                activite.partenaire_conserne_ptba?.includes(ps.id_ds!)
              )
              .map((ps) => ps.intutile_ds)
              .join(", ")}
          </span>
        </div>
      ),
    },
    {
      key: "statut_activite" as keyof Ptba,
      title: "Statut",
      render: (value: Ptba[keyof Ptba]) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {String(value)}
        </span>
      ),
    },
    {
      key: "responsable_ptba" as keyof Ptba,
      title: "Responsable",
      render: (_: Ptba[keyof Ptba], activite: Ptba) => (
        <div className="text-sm">
          <div className="font-medium">
            {activite.responsable?.intutile_ds ||
              activite.responsable_ptba ||
              "Non assigné"}
          </div>
          <div className="text-xs text-gray-500">
            {activite.responsable?.code_ds || activite.responsable_ptba || ""}
          </div>
        </div>
      ),
    },
    {
      key: "actions" as keyof Ptba,
      title: "Actions",
      render: (_: Ptba[keyof Ptba], activite: Ptba) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(activite)}
            className="p-1"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(activite.id_ptba)}
            disabled={deleteMutation.isPending}
            title="Supprimer"
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
          <h3 className="text-lg font-semibold text-gray-900">
            Activités - {version.version_ptba}
          </h3>
          <p className="text-gray-600 mt-1">
            Gestion des activités pour l'année {version.annee_ptba}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowTypeManager(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Types d'activités
          </Button>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle activité
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">
            {activites.length}
          </div>
          <div className="text-sm text-muted-foreground">Total activités</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {activites.filter((a) => a.statut_activite === "En cours").length}
          </div>
          <div className="text-sm text-muted-foreground">En cours</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {activites.filter((a) => a.statut_activite === "Planifiée").length}
          </div>
          <div className="text-sm text-muted-foreground">Planifiées</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {activites.filter((a) => a.responsable_ptba).length}
          </div>
          <div className="text-sm text-muted-foreground">Avec responsable</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg">
        <Table<Ptba & { id: string | number }>
          title={`Activités PTBA ${version.version_ptba}`}
          columns={columns}
          data={activites.map((a) => ({ ...a, id: a.id_ptba }))}
        />
      </div>

      {/* Modal pour le formulaire d'activité */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={
          editingActivite
            ? "Modifier l'activité PTBA"
            : "Créer une nouvelle activité PTBA"
        }
        size="xl"
      >
        <PtbaForm
          activite={editingActivite}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      </Modal>

      {/* Modal pour la gestion des types d'activités */}
      <Modal
        isOpen={showTypeManager}
        onClose={() => setShowTypeManager(false)}
        title="Gestion des types d'activités"
        size="lg"
      >
        <TypeActiviteManager />
      </Modal>
    </div>
  );
}
