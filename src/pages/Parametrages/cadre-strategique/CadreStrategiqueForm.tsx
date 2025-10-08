import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { z } from 'zod'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import SelectInput from '../../../components/SelectInput'
import {
  cadreStrategiqueCreateSchema,
  type CadreStrategiqueCreateData,
} from '../../../schemas/cadreStrategiqueSchemas'
import type {
  CadreStrategique,
  Acteur,
  NiveauCadreStrategique,
} from '../../../types/entities'
import { cadreStrategiqueService } from '../../../services/cadreStrategiqueService'
import { acteurService } from '../../../services/acteurService'
import { niveauCadreStrategiqueService } from '../../../services/niveauCadreStrategiqueService'
import { useRoot } from '../../../contexts/RootContext'

interface CadreStrategiqueFormProps {
  onClose: () => void
  niveau: number
  editRow: CadreStrategique | null
  cadreByNiveau: () => void
  dataCadreStrategique: CadreStrategique[]
}

export default function CadreStrategiqueForm({
  onClose,
  niveau,
  editRow,
  cadreByNiveau,
  dataCadreStrategique,
}: CadreStrategiqueFormProps) {
  const queryClient = useQueryClient()
  const { currentProgramme } = useRoot()

  // Fetch related data
  const { data: acteurs = [] } = useQuery<Acteur[]>({
    queryKey: ['acteurs'],
    queryFn: acteurService.getAll,
  })

  // Récupérer les niveaux pour la validation de la taille du code
  const { data: niveauxCadreStrategique = [] } = useQuery<
    NiveauCadreStrategique[]
  >({
    queryKey: ['niveauxCadreStrategique'],
    queryFn: niveauCadreStrategiqueService.getAll,
  })

  // Calculer la taille fixe du code selon le niveau
  const fixedCodeLength = useMemo(() => {
    const niveauConfig = niveauxCadreStrategique.find(
      (n) => n.nombre_nsc === niveau
    )
    return Number(niveauConfig?.code_number_nsc) || 2 // Valeur par défaut si pas trouvé
  }, [niveauxCadreStrategique, niveau])

  // Créer un schéma de validation dynamique avec la taille fixe du code
  const dynamicSchema = useMemo(() => {
    return cadreStrategiqueCreateSchema.extend({
      code_cs: z
        .string('Le code est requis')
        .length(
          fixedCodeLength,
          `Le code doit contenir exactement ${fixedCodeLength} caractère(s) selon la configuration du niveau ${niveau}`
        ),
    })
  }, [fixedCodeLength, niveau])

  // Get parent cadres (previous level)
  const parentCadres = dataCadreStrategique.filter(
    (cadre) => Number(cadre.niveau_cs) === niveau - 1
  )

  const currentNiveau = niveauxCadreStrategique.find(
    (n) => n.nombre_nsc === niveau
  )

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CadreStrategiqueCreateData>({
    resolver: zodResolver(dynamicSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: editRow
      ? {
          code_cs: editRow.code_cs || '',
          intutile_cs: editRow.intutile_cs || '',
          abgrege_cs: editRow.abgrege_cs || '',
          niveau_cs: Number(editRow.niveau_cs) || niveau,
          partenaire_cs: editRow.partenaire_cs?.id_acteur || null,
          parent_cs:
            typeof editRow.parent_cs === 'object'
              ? editRow.parent_cs?.id_cs
              : editRow.parent_cs,
          programme_cs: currentProgramme?.id_programme || null,
        }
      : {
          code_cs: '',
          intutile_cs: '',
          abgrege_cs: '',
          niveau_cs: Number(currentNiveau?.code_number_nsc),
          partenaire_cs: null,
          parent_cs: null,
          programme_cs: currentProgramme?.id_programme || null,
        },
  })

  const createMutation = useMutation({
    mutationFn: cadreStrategiqueService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cadresStrategiques'] })
      cadreByNiveau()
      onClose()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: CadreStrategiqueCreateData) =>
      cadreStrategiqueService.update(editRow!.id_cs, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cadresStrategiques'] })
      cadreByNiveau()
      onClose()
    },
  })

  const onSubmit = (data: CadreStrategiqueCreateData) => {
    // Vérifier que les niveaux sont configurés
    if (niveauxCadreStrategique.length === 0) {
      alert(
        "Veuillez d'abord configurer les niveaux du cadre stratégique avant d'ajouter des éléments."
      )
      return
    }

    // Vérifier que le niveau actuel est configuré
    const niveauConfig = niveauxCadreStrategique.find(
      (n) => n.nombre_nsc === niveau
    )
    if (!niveauConfig) {
      alert(
        `Le niveau ${niveau} n'est pas configuré. Veuillez configurer les niveaux du cadre stratégique.`
      )
      return
    }

    // Vérifier la taille exacte du code
    if (data.code_cs.length !== fixedCodeLength) {
      alert(
        `Le code doit contenir exactement ${fixedCodeLength} caractère(s) selon la configuration du niveau ${niveau}.`
      )
      return
    }

    if (editRow) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit as (data: CadreStrategiqueCreateData) => void
      )}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="code_cs"
          control={control}
          render={({ field }) => {
            return (
              <div className="space-y-1">
                <Input
                  {...field}
                  type="text"
                  label={`Code du cadre (${fixedCodeLength} caractère(s) requis)`}
                  maxLength={fixedCodeLength}
                  error={errors.code_cs}
                  required
                  placeholder={`Code de ${fixedCodeLength} caractère(s) exactement`}
                />
              </div>
            )
          }}
        />

        <Controller
          name="intutile_cs"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Intitulé du cadre"
              placeholder="Intitulé complet du cadre stratégique"
              maxLength={200}
              error={errors.intutile_cs}
              required
            />
          )}
        />

        <Controller
          name="abgrege_cs"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Abrégé"
              placeholder="Abrégé ou acronyme"
              maxLength={100}
              error={errors.abgrege_cs}
              required
            />
          )}
        />

        <Controller
          name="partenaire_cs"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Partenaire"
              options={acteurs.map((acteur) => ({
                value: acteur.id_acteur,
                label: `${acteur.nom_acteur} (${acteur.code_acteur})`,
              }))}
              value={
                field.value
                  ? acteurs
                      .map((acteur) => ({
                        value: acteur.id_acteur,
                        label: `${acteur.nom_acteur} (${acteur.code_acteur})`,
                      }))
                      .find((option) => option.value === field.value)
                  : null
              }
              onChange={(option) => {
                option && !Array.isArray(option) && field.onChange(option.value)
              }}
              isClearable
              placeholder="Sélectionner un partenaire..."
              error={errors.partenaire_cs}
            />
          )}
        />

        {niveau > 1 && (
          <Controller
            name="parent_cs"
            control={control}
            render={({ field }) => {
              const libelleParent =
                Array.isArray(niveauxCadreStrategique) &&
                niveauxCadreStrategique[niveau - 2]?.libelle_nsc
                  ? niveauxCadreStrategique[niveau - 2].libelle_nsc
                  : 'Cadre parent'

              return (
                <SelectInput
                  {...field}
                  label={libelleParent}
                  options={parentCadres.map((cadreParent) => ({
                    value: cadreParent.id_cs,
                    label: `${cadreParent.intutile_cs} (${cadreParent.code_cs})`,
                  }))}
                  value={
                    field.value
                      ? parentCadres
                          .map((cadreParent) => ({
                            value: cadreParent.id_cs,
                            label: `${cadreParent.intutile_cs} (${cadreParent.code_cs})`,
                          }))
                          .find((option) => option.value === field.value)
                      : null
                  }
                  onChange={(option) => {
                    option &&
                      !Array.isArray(option) &&
                      field.onChange(option.value)
                  }}
                  isClearable
                  placeholder="Sélectionner un cadre parent..."
                  error={errors.parent_cs}
                  required={niveau > 1}
                />
              )
            }}
          />
        )}
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
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? 'Enregistrement...'
            : editRow
            ? 'Mettre à jour'
            : 'Créer'}
        </Button>
      </div>
    </form>
  )
}
