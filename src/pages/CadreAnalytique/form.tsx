import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '../../components/Button'
import Input from '../../components/Input'
import SelectInput from '../../components/SelectInput'
import { CadreAnalytiqueType } from '../../types/cadreAnalytique'
import type { Acteur, Programme } from '../../types/entities'
import { toast } from 'react-toastify'
import { addCadreAnalytique } from '../../functions/cadreAnalytique/post'
import { updateCadreAnalytique } from '../../functions/cadreAnalytique/put'
import { useRoot } from '../../contexts/RootContext'

// Schéma de validation Zod
const cadreAnalytiqueSchema = z.object({
  code_ca: z.string().min(1, 'Le code est obligatoire'),
  intutile_ca: z.string().min(1, "L'intitulé est obligatoire"),
  cout_axe: z.number().min(0, 'Le coût doit être positif'),
  abgrege_ca: z.string(),
  parent_ca: z.number().nullable().optional(),
  partenaire_ca: z.number().nullable().optional(),
})

type FormData = z.infer<typeof cadreAnalytiqueSchema>

type FormCadreAnalytiqueProps = {
  onClose: () => void
  niveau: number
  currentId: number
  niveauCadreAnalytique: { libelle_nca: string }[]
  dataCadreAnalytique: CadreAnalytiqueType[]
  editRow: CadreAnalytiqueType | null
  cadreByNiveau: () => void
  acteurs?: Acteur[]
}

const FormCadreAnalytique: React.FC<FormCadreAnalytiqueProps> = ({
  onClose,
  niveau,
  currentId,
  niveauCadreAnalytique,
  editRow,
  dataCadreAnalytique,
  cadreByNiveau,
  acteurs = [],
}) => {
  const { currentProgramme }: { currentProgramme: Programme | undefined } =
    useRoot()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(cadreAnalytiqueSchema),
    defaultValues: {
      code_ca: '',
      intutile_ca: '',
      cout_axe: 0,
      abgrege_ca: '',
      parent_ca: null,
      partenaire_ca: null,
    },
  })

  // Réinitialiser le formulaire quand editRow change
  useEffect(() => {
    if (editRow) {
      reset({
        code_ca: editRow.code_ca || '',
        intutile_ca: editRow.intutile_ca || '',
        cout_axe: editRow.cout_axe || 0,
        abgrege_ca: editRow.abgrege_ca || '',
        parent_ca: editRow.parent_ca || null,
        partenaire_ca: editRow.partenaire_ca || null,
      })
    } else {
      reset({
        code_ca: '',
        intutile_ca: '',
        cout_axe: 0,
        abgrege_ca: '',
        parent_ca: null,
        partenaire_ca: null,
      })
    }
  }, [editRow, reset])

  const onSubmit = async (data: FormData) => {
    try {
      const formData: CadreAnalytiqueType = {
        code_ca: data.code_ca,
        intutile_ca: data.intutile_ca,
        cout_axe: data.cout_axe,
        abgrege_ca: data.abgrege_ca || '',
        parent_ca: data.parent_ca || null,
        partenaire_ca: data.partenaire_ca || null,
        id_ca: editRow?.id_ca || currentId,
        niveau_ca: niveau,
        programme_ca: currentProgramme?.id_programme ?? null,
      }

      if (editRow) {
        await updateCadreAnalytique(formData)
        toast.success('Cadre analytique mis à jour avec succès')
      } else {
        await addCadreAnalytique(formData)
        toast.success('Cadre analytique ajouté avec succès')
      }
      onClose()
      cadreByNiveau()
    } catch (error) {
      console.error(error)
      toast.error('Erreur lors de la sauvegarde du cadre analytique')
    }
  }

  // Options pour le select parent
  const parentOptions = dataCadreAnalytique
    .filter((n) => n.niveau_ca === niveau - 1)
    .map((niv) => ({
      value: niv.id_ca!,
      label: niv.intutile_ca,
    }))

  // Options pour le select acteur/partenaire
  const acteurOptions = acteurs.map((acteur) => ({
    value: acteur.id_acteur,
    label: `${acteur.nom_acteur} (${acteur.code_acteur})`,
  }))

  const libelleParent =
    Array.isArray(niveauCadreAnalytique) &&
    niveauCadreAnalytique[niveau - 2]?.libelle_nca
      ? niveauCadreAnalytique[niveau - 2].libelle_nca
      : 'Parent'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Code */}
      <Controller
        name="code_ca"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Code"
            placeholder="Entrez le code"
            error={errors.code_ca}
            required
          />
        )}
      />

      {/* Intitulé */}
      <Controller
        name="intutile_ca"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label={`Intitulé`}
            placeholder="Entrez l'intitulé"
            error={errors.intutile_ca}
            required
          />
        )}
      />

      {/* Coût axe */}
      <Controller
        name="cout_axe"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="number"
            step="0.01"
            label="Coût axe"
            placeholder="Entrez le coût"
            error={errors.cout_axe}
            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
          />
        )}
      />

      {/* Abrégé */}
      <Controller
        name="abgrege_ca"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Abrégé"
            placeholder="Entrez l'abrégé"
            error={errors.abgrege_ca}
          />
        )}
      />

      {/* Parent (si applicable) */}
      {niveau > 1 && (
        <Controller
          name="parent_ca"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label={libelleParent}
              placeholder="-- Choisir --"
              options={parentOptions}
              error={errors.parent_ca}
              value={
                parentOptions.find((option) => option.value === field.value) ||
                null
              }
              onChange={(selectedOption) =>
                field.onChange(selectedOption?.value || null)
              }
            />
          )}
        />
      )}

      {/* Partenaire */}
      <Controller
        name="partenaire_ca"
        control={control}
        render={({ field }) => (
          <SelectInput
            {...field}
            label="Partenaire"
            placeholder="-- Choisir un partenaire --"
            options={acteurOptions}
            error={errors.partenaire_ca}
            value={
              acteurOptions.find((option) => option.value === field.value) ||
              null
            }
            onChange={(selectedOption) =>
              field.onChange(selectedOption?.value || null)
            }
          />
        )}
      />

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onClose}
          type="button"
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Enregistrement...'
            : editRow
            ? 'Mettre à jour'
            : 'Ajouter'}
        </Button>
      </div>
    </form>
  )
}

export default FormCadreAnalytique
