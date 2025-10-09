import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus, Trash2, Save } from "lucide-react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { niveauCadreAnalytiqueService } from "../../services/niveauCadreAnalytiqueService";
import { useRoot } from "../../contexts/RootContext";
import type { NiveauCadreAnalytique, Programme } from "../../types/entities";

interface NiveauRow {
  id_nca?: number;
  libelle_nca: string;
  nombre_nca: number; // Taille du code (nombre de caractères)
  programme: string;
  isNew?: boolean;
}

export default function NiveauCadreAnalytiqueTableForm() {
  const [niveaux, setNiveaux] = useState<NiveauRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentProgramme }: { currentProgramme: Programme } = useRoot();

  const queryClient = useQueryClient();

  // Fetch existing niveaux
  const { data: existingNiveaux = [], isLoading } = useQuery<
    NiveauCadreAnalytique[]
  >({
    queryKey: ["niveauxCadreAnalytique"],
    queryFn: niveauCadreAnalytiqueService.getAll,
  });

  // Filter niveaux by current programme
  const niveauxDuProgramme = useMemo(() => {
    if (!currentProgramme) return existingNiveaux;
    return existingNiveaux.filter(
      (niveau) =>
        niveau.programme === currentProgramme.code_programme ||
        (niveau.programme as Programme)?.code_programme ===
          currentProgramme.code_programme
    );
  }, [existingNiveaux, currentProgramme]);

  // Initialize niveaux from existing data
  useEffect(() => {
    if (niveauxDuProgramme.length > 0) {
      const sortedNiveaux = [...niveauxDuProgramme]
        .sort(
          (a, b) =>
            (a.code_number_nca as number) - (b.code_number_nca as number)
        )
        .map((niveau) => ({
          id_nca: niveau.id_nca as number,
          libelle_nca: niveau.libelle_nca as string,
          nombre_nca: niveau.nombre_nca as number,
          programme: currentProgramme.code_programme,
          isNew: false,
        }));
      setNiveaux(sortedNiveaux);
    } else {
      setNiveaux([
        {
          libelle_nca: "",
          nombre_nca: 2, // Taille du code par défaut
          programme: currentProgramme.code_programme,
          isNew: true,
        },
      ]);
    }
  }, [currentProgramme.code_programme, niveauxDuProgramme]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: niveauCadreAnalytiqueService.create,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      niveauCadreAnalytiqueService.update(id, data),
  });

  const deleteMutation = useMutation({
    mutationFn: niveauCadreAnalytiqueService.delete,
  });

  const handleAddRow = () => {
    const newRow: NiveauRow = {
      libelle_nca: "",
      nombre_nca: 2, // Taille du code par défaut
      programme: currentProgramme.code_programme,
      isNew: true,
    };
    setNiveaux([...niveaux, newRow]);
  };

  const handleRemoveRow = async (index: number) => {
    const niveau = niveaux[index];

    if (niveau.id_nca) {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce niveau ?")) {
        try {
          await deleteMutation.mutateAsync(niveau.id_nca);
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
    if (!currentProgramme) {
      toast.error("Aucun programme sélectionné");
      return;
    }

    setIsSubmitting(true);

    try {
      const promises = niveaux.map(async (niveau, index) => {
        const niveauData = {
          libelle_nca: niveau.libelle_nca,
          code_number_nca: index + 1, // Numéro du niveau (1, 2, 3...)
          nombre_nca: niveau.nombre_nca, // Taille du code
          programme: niveau.programme,
        };

        if (niveau.isNew && niveau.libelle_nca.trim()) {
          return createMutation.mutateAsync(niveauData);
        } else if (niveau.id_nca && niveau.libelle_nca.trim()) {
          return updateMutation.mutateAsync({
            id: niveau.id_nca,
            data: niveauData,
          });
        }
      });

      await Promise.all(promises.filter(Boolean));
      toast.success("Niveaux sauvegardés avec succès");

      queryClient.invalidateQueries({ queryKey: ["niveauxCadreAnalytique"] });
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
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
                key={niveau.id_nca || `new-${index}`}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3 w-64">
                  <Input
                    value={niveau.libelle_nca}
                    onChange={(e) =>
                      handleFieldChange(index, "libelle_nca", e.target.value)
                    }
                    placeholder="Ex: Objectif analytique"
                    className="w-full"
                  />
                </td>

                <td className="px-4 py-3">
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={niveau.nombre_nca}
                    onChange={(e) =>
                      handleFieldChange(
                        index,
                        "nombre_nca",
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
          disabled={isSubmitting || niveaux.every((n) => !n.libelle_nca.trim())}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>
    </div>
  );
}