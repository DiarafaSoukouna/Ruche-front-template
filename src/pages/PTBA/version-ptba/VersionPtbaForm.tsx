import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";
import Button from "../../../components/Button";
import SelectInput from "../../../components/SelectInput";
import versionPtbaService from "../../../services/versionPtbaService";
import {
  VersionPtbaFormData,
  versionPtbaSchema,
} from "../../../schemas/ptbaSchemas";
import type { VersionPtba } from "../../../types/entities";
import Input from "../../../components/Input";
import TextArea from "../../../components/TextArea";

interface VersionPtbaFormProps {
  version?: VersionPtba;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VersionPtbaForm({
  version,
  onClose,
  onSuccess,
}: VersionPtbaFormProps) {
  const isEditing = !!version;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VersionPtbaFormData>({
    resolver: zodResolver(versionPtbaSchema),
    defaultValues: {
      annee_ptba: version?.annee_ptba || new Date().getFullYear(),
      version_ptba: version?.version_ptba || "",
      date_validation:
        version?.date_validation || new Date().toISOString().split("T")[0],
      observation: version?.observation || "",
      documentUrl: version?.documentUrl || "",
      statut_version: version?.statut_version ?? 0,
      etat: version?.etat || "",
      modifier_par: version?.modifier_par || "",
      projet: version?.projet || undefined,
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: ({ data, file }: { data: VersionPtbaFormData; file?: File }) =>
      versionPtbaService.create(data, file),
    onSuccess: () => {
      toast.success("Version créée avec succès");
      onSuccess();
    },
    onError: () => {
      toast.error("Erreur lors de la création");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
      file,
    }: {
      id: number;
      data: Partial<VersionPtbaFormData>;
      file?: File;
    }) => versionPtbaService.update(id, data, file),
    onSuccess: () => {
      toast.success("Version modifiée avec succès");
      onSuccess();
    },
    onError: () => {
      toast.error("Erreur lors de la modification");
    },
  });

  const onSubmit = (data: VersionPtbaFormData) => {
    if (isEditing && version) {
      updateMutation.mutate({
        id: (version as VersionPtba).id_version_ptba,
        data,
        file: selectedFile || undefined,
      });
    } else {
      createMutation.mutate({
        data,
        file: selectedFile || undefined,
      });
    }
  };

  // Options pour les années
  const getAnneeOptions = () => {
    const currentYear = new Date().getFullYear();
    const options = [];

    for (let i = currentYear - 2; i <= currentYear + 5; i++) {
      options.push({
        value: i,
        label: i.toString(),
      });
    }

    return options;
  };

  // Options pour le statut
  const statutOptions = [
    { value: 0, label: "En construction" },
    { value: 1, label: "Validée" },
    { value: 2, label: "Archivée" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="version_ptba"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Version PTBA"
              placeholder="Ex: V1.0"
              error={errors.version_ptba}
              required
            />
          )}
        />

        <Controller
          name="annee_ptba"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Année PTBA"
              options={getAnneeOptions()}
              value={getAnneeOptions().find(
                (option) => option.value === field.value
              )}
              onChange={(option) =>
                option &&
                !Array.isArray(option) &&
                field.onChange(option?.value)
              }
              error={errors.annee_ptba}
              required
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="statut_version"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Statut de la version"
              options={statutOptions}
              value={statutOptions.find(
                (option) => option.value === field.value
              )}
              onChange={(option) =>
                option &&
                !Array.isArray(option) &&
                field.onChange(option?.value)
              }
              error={errors.statut_version}
            />
          )}
        />

        <Controller
          name="date_validation"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Date de validation"
              type="date"
              error={errors.date_validation}
              required
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="etat"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="État"
              placeholder="Ex: En cours"
              error={errors.etat}
            />
          )}
        />

        <Controller
          name="modifier_par"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Modifié par"
              placeholder="Nom du modificateur"
              error={errors.modifier_par}
            />
          )}
        />
      </div>

      <Controller
        name="observation"
        control={control}
        render={({ field }) => (
          <TextArea
            {...field}
            label="Observations"
            placeholder="Observations sur la version..."
            rows={4}
            error={errors.observation}
          />
        )}
      />

      <Controller
        name="documentUrl"
        control={control}
        render={({ field: { onChange } }) => (
          <div className="space-y-2">
            <Input
              label="Document"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Stocker le fichier pour l'upload
                  setSelectedFile(file);
                  // Mettre à jour le champ du formulaire avec le nom du fichier
                  onChange(file.name);
                } else {
                  setSelectedFile(null);
                  onChange("");
                }
              }}
              error={errors.documentUrl}
            />
          </div>
        )}
      />

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          {isEditing ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
