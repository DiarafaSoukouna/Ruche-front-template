import { FC, useEffect, useState } from 'react'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import Select from 'react-select'
import { ProjectCreateData } from '../../../schemas/projetSchema'
import { Acteur } from '../../../types/entities'
import { getAllActeurs } from '../../../functions/acteurs/gets'
import { localiteOneLevel } from '../../../functions/localites/gets'
import { typeLocalite } from '../../../functions/localites/types'

interface FormProps {
  control: Control<ProjectCreateData>
  errors: FieldErrors<ProjectCreateData>
  step: number
}

const Step2: FC<FormProps> = ({ control, errors, step }) => {
  const [zones, setZones] = useState<typeLocalite[]>([])

  const [acteurList, setacteurList] = useState<Acteur[]>([])

  const loadActeur = async () => {
    try {
      const res = await getAllActeurs()

      if (!res) return

      setacteurList(res.data)
    } catch {}
  }

  const loadZone = async () => {
    try {
      const data = await localiteOneLevel()

      if (!data) return

      setZones(data)
    } catch {}
  }

  useEffect(() => {
    loadActeur()
    loadZone()
  }, [])

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
        step != 2 && 'hidden'
      }`}
    >
      <div>
        <label className="block text-sm font-medium mb-1">
          Partenaire du projet *
        </label>
        <Controller
          name="partenaire_projet"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti={false}
              options={acteurList.map((s) => ({
                value: s.id_acteur,
                label: s.nom_acteur,
              }))}
              value={
                acteurList
                  .map((s) => ({ value: s.id_acteur, label: s.nom_acteur }))
                  .find((option) => option.value === field.value) || null
              }
              onChange={(selected) =>
                field.onChange(selected ? selected.value : null)
              }
              classNamePrefix="react-select"
            />
          )}
        />
        {errors.partenaire_projet && (
          <p className="text-red-500 text-sm">
            {errors.partenaire_projet.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Structures du projet *
        </label>
        <Controller
          name="structure_projet"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={acteurList.map((s) => ({
                value: s.id_acteur,
                label: s.nom_acteur,
              }))}
              value={acteurList
                .filter((s) => field.value.includes(s.id_acteur))
                .map((s) => ({ value: s.id_acteur, label: s.nom_acteur }))}
              onChange={(selected) =>
                field.onChange(selected.map((s) => s.value))
              }
              classNamePrefix="react-select"
            />
          )}
        />
        {errors.structure_projet && (
          <p className="text-red-500 text-sm">
            {errors.structure_projet.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Signataires du projet *
        </label>
        <Controller
          name="signataires_projet"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={acteurList.map((s) => ({
                value: s.id_acteur,
                label: s.nom_acteur,
              }))}
              value={acteurList
                .filter((s) => field.value.includes(s.id_acteur))
                .map((s) => ({ value: s.id_acteur, label: s.nom_acteur }))}
              onChange={(selected) =>
                field.onChange(selected.map((s) => s.value))
              }
              classNamePrefix="react-select"
            />
          )}
        />
        {errors.signataires_projet && (
          <p className="text-red-500 text-sm">
            {errors.signataires_projet.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Partenaires d'exécution *
        </label>
        <Controller
          name="partenaires_execution_projet"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={acteurList.map((s) => ({
                value: s.id_acteur,
                label: s.nom_acteur,
              }))}
              value={acteurList
                .filter((s) => field.value.includes(s.id_acteur))
                .map((s) => ({ value: s.id_acteur, label: s.nom_acteur }))}
              onChange={(selected) =>
                field.onChange(selected.map((s) => s.value))
              }
              classNamePrefix="react-select"
            />
          )}
        />
        {errors.partenaires_execution_projet && (
          <p className="text-red-500 text-sm">
            {errors.partenaires_execution_projet.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Zones *</label>
        <Controller
          name="zone_projet"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={zones.map((s) => ({
                value: s.id_loca,
                label: s.intitule_loca,
              }))}
              value={zones
                .filter((s) => field.value.includes(s.id_loca as any))
                .map((s) => ({ value: s.id_loca, label: s.intitule_loca }))}
              onChange={(selected) =>
                field.onChange(selected.map((s) => s.value))
              }
              classNamePrefix="react-select"
            />
          )}
        />
        {errors.zone_projet && (
          <p className="text-red-500 text-sm">{errors.zone_projet.message}</p>
        )}
      </div>
    </div>
  )
}

export default Step2
