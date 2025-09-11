import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import HierarchicalTreeSelect from "../../../components/HierarchicalTreeSelect";
import { cadreSecteurService } from "../../../services/cadreSecteurService";
import { programmeService } from "../../../services/programmeService";
import {
  cadreSecteurCreateSchema,
  type CadreSecteurCreateData,
} from "../../../schemas/indicateursSchemas";
import type { CadreSecteur } from "../../../types/entities";
import type { Programme } from "../../../types/programme";

interface CadreSecteurFormProps {
  cadre?: CadreSecteur;
  onClose: () => void;
}

export default function CadreSecteurForm({
  cadre,
  onClose,
}: CadreSecteurFormProps) {
  const queryClient = useQueryClient();

  // Fetch all cadres for parent selection
  const { data: cadres = [] } = useQuery<CadreSecteur[]>({
    queryKey: ["cadresSecteur"],
    queryFn: cadreSecteurService.getAll,
  });

  // Fetch all programmes for programme selection
  const { data: programmes = [] } = useQuery<Programme[]>({
    queryKey: ["programmes"],
    queryFn: programmeService.getAll,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CadreSecteurCreateData>({
    resolver: zodResolver(cadreSecteurCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: cadre
      ? {
          code_cl: cadre.code_cl || "",
          intitule_cl: cadre.intitule_cl || "",
          abrege_cl: cadre.abrege_cl || "",
          niveau_cl: cadre.niveau_cl || 1,
          parent_cl: cadre.parent_cl || null,
          id_programme: cadre.id_programme || null,
        }
      : {
          code_cl: "",
          intitule_cl: "",
          abrege_cl: "",
          niveau_cl: 1,
          parent_cl: null,
          id_programme: null,
        },
  });


  // Filter cadres to exclude current cadre and its descendants for parent selection
  const availableParents = cadres.filter(c => {
    if (cadre && c.id_cl === cadre.id_cl) return false;
    // Add logic to exclude descendants if needed
    return true;
  });

  const createMutation = useMutation({
    mutationFn: cadreSecteurService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadresSecteur"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CadreSecteurCreateData) =>
      cadreSecteurService.update(cadre!.id_cl, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadresSecteur"] });
      onClose();
    },
  });

  const onSubmit = (data: CadreSecteurCreateData) => {
    if (cadre) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="code_cl"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Code"
              placeholder="ex: OBJ001, AXE001, ACT001"
              maxLength={20}
              error={errors.code_cl}
              required
            />
          )}
        />

        <Controller
          name="niveau_cl"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Niveau stratégique"
              required
              options={[
                { value: 1, label: "Niveau 1 - Objectif" },
                { value: 2, label: "Niveau 2 - Axe stratégique" },
                { value: 3, label: "Niveau 3 - Action majeure" },
                { value: 4, label: "Niveau 4 - Sous-action" },
                { value: 5, label: "Niveau 5 - Activité" },
              ]}
              value={
                field.value
                  ? { value: field.value, label: `Niveau ${field.value}` }
                  : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : 1);
              }}
              placeholder="Sélectionner un niveau..."
              error={errors.niveau_cl}
            />
          )}
        />

        <div className="md:col-span-2">
          <Controller
            name="intitule_cl"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Intitulé"
                placeholder="Intitulé complet du cadre logique"
                maxLength={200}
                error={errors.intitule_cl}
                required
              />
            )}
          />
        </div>

        <Controller
          name="abrege_cl"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Abrégé"
              placeholder="Abréviation"
              maxLength={50}
              error={errors.abrege_cl}
              required
            />
          )}
        />

        <Controller
          name="parent_cl"
          control={control}
          render={({ field }) => (
            <HierarchicalTreeSelect
              value={field.value}
              onChange={field.onChange}
              data={availableParents}
              idField="id_cl"
              labelField="intitule_cl"
              codeField="code_cl"
              parentField="parent_cl"
              levelField="niveau_cl"
              label="Cadre parent"
              placeholder="Sélectionner un cadre parent (optionnel)"
              error={errors.parent_cl}
            />
          )}
        />

        <Controller
          name="id_programme"
          control={control}
          render={({ field }) => (
            <SelectInput 
              {...field}
              label="Programme"
              placeholder="Sélectionner un programme (optionnel)"
              error={errors.id_programme}
              options={programmes.map(programme => ({ 
                value: programme.id_programme, 
                label: programme.nom_programme 
              }))}
              value={
                field.value
                  ? programmes.find(p => p.id_programme === field.value)
                    ? { value: field.value, label: programmes.find(p => p.id_programme === field.value)!.nom_programme }
                    : null
                  : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : null);
              }}
            />
          )}
        />

      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading
            ? "Enregistrement..."
            : cadre
            ? "Modifier"
            : "Créer"}
        </Button>
      </div>
    </form>
  );
}
