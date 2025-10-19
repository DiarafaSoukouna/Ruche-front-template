import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus, Trash2, Save } from "lucide-react";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import niveauActiviteProjetService from "../../../services/niveauActiviteProjetService";
import type { NiveauActiviteProjet } from "../../../types/entities";
import { NiveauActiviteProjetFormData } from "../../../schemas/activiteProjetSchemas";

interface NiveauRow {
  id_niveau_activite_projet?: number;
  libelle_niveau_activite_projet: string;
  taille_code_niveau_activite_projet: number; // Taille du code (nombre de caractères)
  isNew?: boolean;
}

export default function NiveauActiviteProjetTableForm() {
  const [niveaux, setNiveaux] = useState<NiveauRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const queryClient = useQueryClient();

  // Fetch existing niveaux
  const { data: existingNiveaux = [], isLoading } = useQuery<
    NiveauActiviteProjet[]
  >({
    queryKey: ["niveaux-activite-projet"],
    queryFn: niveauActiviteProjetService.getAll,
  });

  // Initialize niveaux from existing data
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      if (existingNiveaux.length > 0) {
        const sortedNiveaux = [...existingNiveaux]
          .sort(
            (a, b) =>
              (a.nombre_niveau_activite_projet as number) -
              (b.nombre_niveau_activite_projet as number)
          )
          .map((niveau) => ({
            id_niveau_activite_projet: niveau.id_niveau_activite_projet as number,
            libelle_niveau_activite_projet: niveau.libelle_niveau_activite_projet as string,
            taille_code_niveau_activite_projet:
              niveau.taille_code_niveau_activite_projet as number,
            isNew: false,
          }));
        setNiveaux(sortedNiveaux);
      } else {
        setNiveaux([
          {
            libelle_niveau_activite_projet: "",
            taille_code_niveau_activite_projet: 2, // Taille du code par défaut
            isNew: true,
          },
        ]);
      }
      setIsInitialized(true);
    }
  }, [existingNiveaux, isLoading, isInitialized]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: niveauActiviteProjetService.create,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: NiveauActiviteProjetFormData;
    }) => niveauActiviteProjetService.update(id, data),
  });

  const deleteMutation = useMutation({
    mutationFn: niveauActiviteProjetService.delete,
  });

  const handleAddRow = () => {
    const newRow: NiveauRow = {
      libelle_niveau_activite_projet: "",
      taille_code_niveau_activite_projet: 2, // Taille du code par défaut
      isNew: true,
    };
    setNiveaux([...niveaux, newRow]);
  };

  const handleRemoveRow = async (index: number) => {
    const niveau = niveaux[index];

    if (niveau.id_niveau_activite_projet) {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce niveau ?")) {
        try {
          await deleteMutation.mutateAsync(niveau.id_niveau_activite_projet);
          setNiveaux(niveaux.filter((_, i) => i !== index));
          toast.success("Niveau supprimé avec succès");
        } catch {
          toast.error("Erreur lors de la suppression");
        }
      }
    } else {
      setNiveaux(niveaux.filter((_, i) => i !== index));
    }
  };

  const handleFieldChange = (
    index: number,
    field: keyof NiveauRow,
    value: string | number
  ) => {
    const updatedNiveaux = [...niveaux];
    updatedNiveaux[index] = {
      ...updatedNiveaux[index],
      [field]: value,
    };
    setNiveaux(updatedNiveaux);
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      const promises = niveaux.map(async (niveau, index) => {
        const niveauData = {
          libelle_niveau_activite_projet: niveau.libelle_niveau_activite_projet,
          nombre_niveau_activite_projet: index + 1, // Numéro du niveau (1, 2, 3...)
          taille_code_niveau_activite_projet:
            niveau.taille_code_niveau_activite_projet, // Taille du code
        };

        if (niveau.isNew && niveau.libelle_niveau_activite_projet.trim()) {
          return createMutation.mutateAsync(niveauData);
        } else if (
          niveau.id_niveau_activite_projet &&
          niveau.libelle_niveau_activite_projet.trim()
        ) {
          return updateMutation.mutateAsync({
            id: niveau.id_niveau_activite_projet,
            data: niveauData,
          });
        }
      });

      await Promise.all(promises.filter(Boolean));
      toast.success("Niveaux sauvegardés avec succès");

      queryClient.invalidateQueries({ queryKey: ["niveaux-activite-projet"] });
      setIsInitialized(false); // Réinitialiser pour recharger les données
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canDeleteLevel = (index: number) => {
    return index === niveaux.length - 1;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Configuration des niveaux
          </h3>
        </div>
        <Button onClick={handleAddRow} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un niveau
        </Button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 mb-64">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Libellé du niveau
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Taille du code
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {niveaux.map((niveau, index) => (
              <tr
                key={niveau.id_niveau_activite_projet || `new-${index}`}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3 w-64">
                  <Input
                    value={niveau.libelle_niveau_activite_projet}
                    onChange={(e) =>
                      handleFieldChange(
                        index,
                        "libelle_niveau_activite_projet",
                        e.target.value
                      )
                    }
                    placeholder="Ex: Composante"
                    className="w-full"
                  />
                </td>

                <td className="px-4 py-3">
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={niveau.taille_code_niveau_activite_projet}
                    onChange={(e) =>
                      handleFieldChange(
                        index,
                        "taille_code_niveau_activite_projet",
                        Number(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </td>

                <td className="px-4 py-3 text-center">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveRow(index)}
                    disabled={
                      !canDeleteLevel(index) || deleteMutation.isPending
                    }
                    className="p-2"
                    title={
                      !canDeleteLevel(index)
                        ? "Seul le dernier niveau peut être supprimé"
                        : "Supprimer ce niveau"
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSave}
          disabled={isSubmitting || niveaux.every((n) => !n.libelle_niveau_activite_projet.trim())}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>
    </div>
  );
}
