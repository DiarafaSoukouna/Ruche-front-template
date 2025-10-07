import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus, Trash2, Save } from "lucide-react";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import { niveauCadreResultatService } from "../../../services/niveauCadreResultatService";
import type { NiveauCadreResultat } from "../../../types/entities";

interface NiveauRow {
  id_ncr?: number;
  libelle_ncr: string;
  code_number_ncr: number;
  type_niveau: 1 | 2 | 3;
  isNew?: boolean;
}

const typeNiveauOptions = [
  { value: 1, label: "Effet" },
  { value: 2, label: "Produit" },
  { value: 3, label: "Impact" },
];

export default function NiveauCadreResultatTableForm() {
  const [niveaux, setNiveaux] = useState<NiveauRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  // Fetch existing niveaux
  const { data: existingNiveaux = [], isLoading } = useQuery<
    NiveauCadreResultat[]
  >({
    queryKey: ["niveauxCadreResultat"],
    queryFn: niveauCadreResultatService.getAll,
  });

  // Initialize niveaux from existing data
  useEffect(() => {
    if (existingNiveaux.length > 0) {
      const sortedNiveaux = [...existingNiveaux]
        .sort((a, b) => a.nombre_ncr - b.nombre_ncr)
        .map((niveau) => ({
          id_ncr: niveau.id_ncr,
          libelle_ncr: niveau.libelle_ncr,
          code_number_ncr: niveau.code_number_ncr,
          type_niveau: niveau.type_niveau,
          isNew: false,
        }));
      setNiveaux(sortedNiveaux);
    } else {
      // Si aucun niveau existant, commencer avec une ligne vide
      setNiveaux([
        {
          libelle_ncr: "",
          code_number_ncr: 2,
          type_niveau: 1,
          isNew: true,
        },
      ]);
    }
  }, [existingNiveaux]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: niveauCadreResultatService.create,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<NiveauCadreResultat>;
    }) => niveauCadreResultatService.update(id, data),
  });

  const deleteMutation = useMutation({
    mutationFn: niveauCadreResultatService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["niveauxCadreResultat"] });
    },
  });

  const handleAddRow = () => {
    const newRow: NiveauRow = {
      libelle_ncr: "",
      code_number_ncr: 2,
      type_niveau: 1,
      isNew: true,
    };
    setNiveaux([...niveaux, newRow]);
  };

  const handleRemoveRow = async (index: number) => {
    const niveau = niveaux[index];

    if (niveau.id_ncr) {
      // Niveau existant - supprimer de la base
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce niveau ?")) {
        try {
          await deleteMutation.mutateAsync(niveau.id_ncr);
          setNiveaux(niveaux.filter((_, i) => i !== index));
          toast.success("Niveau supprimé avec succès");
        } catch {
          toast.error("Erreur lors de la suppression");
        }
      }
    } else {
      // Nouvelle ligne - supprimer localement
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
        // Le nombre est automatiquement basé sur la position (index + 1)
        const niveauData = {
          libelle_ncr: niveau.libelle_ncr,
          nombre_ncr: index + 1, // Numéro automatique basé sur la position
          code_number_ncr: niveau.code_number_ncr,
          type_niveau: niveau.type_niveau,
        };

        if (niveau.isNew && niveau.libelle_ncr.trim()) {
          // Créer nouveau niveau
          return createMutation.mutateAsync(niveauData);
        } else if (niveau.id_ncr && niveau.libelle_ncr.trim()) {
          // Mettre à jour niveau existant
          return updateMutation.mutateAsync({
            id: niveau.id_ncr,
            data: niveauData,
          });
        }
      });

      await Promise.all(promises.filter(Boolean));
      toast.success("Niveaux sauvegardés avec succès");

      // Recharger les données
      queryClient.invalidateQueries({ queryKey: ["niveauxCadreResultat"] });
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canDeleteLevel = (index: number) => {
    // Peut supprimer seulement le dernier niveau (comme les autres cadres)
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Configuration des niveaux
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Gérez les niveaux du cadre de résultat. Le numéro est
            automatiquement attribué selon l'ordre.
          </p>
        </div>
        <Button onClick={handleAddRow} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un niveau
        </Button>
      </div>

      {/* Tableau des niveaux */}
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Type de niveau
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {niveaux.map((niveau, index) => (
              <tr
                key={niveau.id_ncr || `new-${index}`}
                className="hover:bg-gray-50"
              >
                {/* Libellé */}
                <td className="px-4 py-3 w-64">
                  <Input
                    value={niveau.libelle_ncr}
                    onChange={(e) =>
                      handleFieldChange(index, "libelle_ncr", e.target.value)
                    }
                    placeholder="Ex: Objectif stratégique"
                    className="w-full"
                  />
                </td>

                {/* Nombre de caractères code */}
                <td className="px-4 py-3">
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={niveau.code_number_ncr}
                    onChange={(e) =>
                      handleFieldChange(
                        index,
                        "code_number_ncr",
                        Number(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </td>

                {/* Type de niveau */}
                <td className="px-4 py-3">
                  <SelectInput
                    options={typeNiveauOptions}
                    value={typeNiveauOptions.find(
                      (opt) => Number(opt.value) === Number(niveau.type_niveau)
                    )}
                    onChange={(option) => {
                      if (option && !Array.isArray(option)) {
                        handleFieldChange(index, "type_niveau", option.value);
                      }
                    }}
                  />
                </td>

                {/* Actions */}
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

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSave}
          disabled={isSubmitting || niveaux.every((n) => !n.libelle_ncr.trim())}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>
    </div>
  );
}
