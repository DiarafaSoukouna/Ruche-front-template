import { Controller, useForm } from 'react-hook-form'
import Button from '../../../../components/Button'
import { typeCibleIndicStrategique } from '../../../../functions/cibleIndicateurStrategique/types'
import Input from '../../../../components/Input'
import TextArea from '../../../../components/TextArea'
import SelectInput from '../../../../components/SelectInput'
import { toast } from 'react-toastify'
import { useRoot } from '../../../../contexts/RootContext'
import { updateCibleIndicStrategique } from '../../../../functions/cibleIndicateurStrategique/put'
import { addCibleIndicStrategique } from '../../../../functions/cibleIndicateurStrategique/post'
import { useEffect, useState } from 'react'
import { allUgl } from '../../../../functions/ugl/gets'
import { typeUgl } from '../../../../functions/ugl/types'
// import { getAllActeurs } from '../../../functions/acteurs/gets'
interface FormProps {
  row_cible: any
  isEdit: boolean
  code_indicateur: string
  all: () => void
  setIsEdit: (val: boolean) => void
  setShowForm: () => void
}
const FormCible: React.FC<FormProps> = ({
  row_cible,
  isEdit,
  code_indicateur,
  all,
  setIsEdit,
  setShowForm,
}) => {
  const [ugls, setUgls] = useState<typeUgl[]>([])

  const { currentProgramme } = useRoot()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeCibleIndicStrategique>({
    mode: 'onSubmit',
    defaultValues: {
      id_cible_indicateur_istr: row_cible.id_cible_indicateur_istr,
      annee: row_cible.annee,
      code_indicateur_istr: code_indicateur,
      code_ug: row_cible.code_ug.code_ugl,
      code_programme: currentProgramme.code_programme,
      valeur_cible_indcateur_istr: row_cible.valeur_cible_indcateur_istr,
    }
  })
  const onSubmit = async (data: typeCibleIndicStrategique) => {
    console.log('data', data)
    try {
      let res
      if (row_cible.id_cible_indicateur_istr) {
        res = await updateCibleIndicStrategique(data, row_cible.id_cible_indicateur_istr)
      } else {
        res = await addCibleIndicStrategique(data)
      }
      toast.success(
        row_cible.id_cible_indicateur_istr
          ? 'Cible mise a jour avec succès'
          : 'Cible ajoutée avec succès'
      )
      all()
      setShowForm()
      console.log(res)
    } catch (error) {
      toast.error("erreur lors de la creation de l'unité de gestion")
      console.log(error)
    }
  }

  const fetchUgl = async () => {
    try {
      const res = await allUgl()
      if (res) {
        setUgls(res)
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchUgl()
  }, [])
  console.log('code_indicateur', code_indicateur)
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Controller
            name="annee"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                label="Année"
                placeholder="Entrez la date"
                error={errors.annee}
              />
            )}
          />
        </div>

        <div className="col-span-6">
          <Controller
            name="valeur_cible_indcateur_istr"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Valeur cible"
                placeholder="Entrez la valeur cible"
                error={errors.valeur_cible_indcateur_istr}
              />
            )}
          />
        </div>

        <div className="col-span-6">
          <Controller
            name="code_ug"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                label="Unité de gestion"
                placeholder="Sélectionner une ugl"
                required
                options={ugls.map((ugl) => ({
                  value: ugl.code_ugl,
                  label: ugl.nom_ugl,
                }))}
                value={
                  field.value
                    ? ugls.find((ugl) => ugl.code_ugl === field.value)
                      ? {
                        value: field.value,
                        label: ugls.find(
                          (ugl) => ugl.code_ugl === field.value
                        )!.nom_ugl,
                      }
                      : null
                    : null
                }
                onChange={(selectedOption) => {
                  field.onChange(selectedOption ? selectedOption.value : "");
                }}
                isClearable
                error={errors.code_ug}
              />
            )}
          />
        </div>
      </div>
      <div className="flex space-x-3 pt-4 justify-end">
        <Button variant="outline" onClick={() => setShowForm()}>
          Annuler
        </Button>
        <Button className="" type="submit">
          {isEdit ? 'Mettre à jour' : 'Valider'}
        </Button>
      </div>
    </form>
  )
}
export default FormCible
