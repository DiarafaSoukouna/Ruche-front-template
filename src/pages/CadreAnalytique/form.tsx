import Button from '../../components/Button'
import { addLocalite } from '../../functions/localites/post'
import { updateLocalite } from '../../functions/localites/put'
import { typeLocalite } from '../../functions/localites/types'
import Select from 'react-select'
import { typeNiveauLocalite } from '../../functions/niveauLocalites/types'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { oneNiveauLocalite } from '../../functions/niveauLocalites/gets'

interface Props {
  onClose: () => void
  localiteByNiveau: (id: number) => void
  niveau: number
  currentId: number
  niveauLocalites: typeNiveauLocalite[]
  editRow: typeLocalite | null
}

type Errors = {
  intitule_loca?: string
  code_national_loca?: string
  code_loca?: string
}

const FormLocalite: React.FC<Props> = ({
  editRow,
  onClose,
  niveauLocalites,
  niveau,
  currentId,
  localiteByNiveau,
}) => {
  const parentIndex = niveau - 2
  const parentInfo = niveauLocalites[parentIndex]
  const curentInfo = niveauLocalites[niveau - 1]
  const [localiteByNiv, setLocaliteByNiv] = useState<typeLocalite[]>([])
  const [errors, setErrors] = useState<Errors>({})

  const validate = (data: Record<string, any>) => {
    const newErrors: Errors = {}

    if (!data.intitule_loca || data.intitule_loca.trim() === '') {
      newErrors.intitule_loca = 'Le libellé est obligatoire.'
    }

    if (!data.code_national_loca || data.code_national_loca.trim() === '') {
      newErrors.code_national_loca = 'Le code national est obligatoire.'
    } else if (
      data.code_national_loca.length !== Number(curentInfo.Code_number_nlc)
    ) {
      newErrors.code_national_loca = `Le code doit contenir exactementh ${curentInfo.Code_number_nlc} caractères.`
    }

    if (!data.code_loca || data.code_loca.trim() === '') {
      newErrors.code_loca = 'Le code est obligatoire.'
    }

    return newErrors
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    // Validation
    const newErrors = validate(data)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})

    let payload: typeLocalite
    if (parentInfo) {
      payload = {
        intitule_loca: data.intitule_loca as string,
        code_national_loca: data.code_national_loca as string,
        code_loca: data.code_loca as string,
        parent_loca: data.parent_loca as string,
        niveau_loca: currentId,
        id_loca: editRow?.id_loca,
      }
    } else {
      payload = {
        intitule_loca: data.intitule_loca as string,
        code_national_loca: data.code_national_loca as string,
        code_loca: data.code_loca as string,
        niveau_loca: currentId,
        id_loca: editRow?.id_loca,
      }
    }

    try {
      let res
      if (editRow) {
        res = await updateLocalite(payload)
      } else {
        res = await addLocalite(payload)
        form.reset()
      }
      toast.success(
        editRow
          ? 'Localité mise à jour avec succès'
          : 'Localité ajoutée avec succès'
      )
      onClose()
      localiteByNiveau(currentId)
    } catch (error) {
      console.log('error', error)
    }
  }

  const OneNiveau = async (id: number) => {
    try {
      const res = await oneNiveauLocalite(id)
      setLocaliteByNiv(res.localites)
    } catch (error) {
      toast.error('Erreur lors de la recuperation du niveau localité')
    }
  }

  useEffect(() => {
    if (parentInfo) {
      OneNiveau(parentInfo.id_nlc!)
    }
  }, [])

  const defaultValue =
    typeof editRow?.parent_loca === 'object' && editRow.parent_loca !== null
      ? (editRow.parent_loca as typeLocalite)
      : ''
  console.log(curentInfo, niveau)
  return (
    <div className="space-y-4">
      <form onSubmit={submit} name="niveauLocaliteForm">
        <div className="grid grid-cols-12 gap-4">
          {/* Libellé */}
          <div className="col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Libellé
            </label>
            <input
              name="intitule_loca"
              placeholder="Entrer le libellé"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                              ${
                                errors.intitule_loca
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
              defaultValue={editRow?.intitule_loca || ''}
            />
            {errors.intitule_loca && (
              <p className="text-red-500 text-sm mt-1">
                {errors.intitule_loca}
              </p>
            )}
          </div>

          <div className="col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code
            </label>
            <input
              name="code_loca"
              placeholder="Entrer le code"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                              ${
                                errors.code_loca
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
              defaultValue={editRow?.code_loca || ''}
            />
            {errors.code_loca && (
              <p className="text-red-500 text-sm mt-1">{errors.code_loca}</p>
            )}
          </div>
          <div className="col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code national
            </label>
            <input
              name="code_national_loca"
              placeholder="Entrer le code national"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                              ${
                                errors.code_national_loca
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
              defaultValue={editRow?.code_national_loca || ''}
            />
            {errors.code_national_loca && (
              <p className="text-red-500 text-sm mt-1">
                {errors.code_national_loca}
              </p>
            )}
          </div>
          {parentInfo && (
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {parentInfo.libelle_nlc}
              </label>
              <Select
                name="parent_loca"
                defaultValue={
                  defaultValue
                    ? {
                        value: String(defaultValue?.id_loca),
                        label: defaultValue.intitule_loca,
                      }
                    : null
                }
                options={localiteByNiv.map((item) => ({
                  value: String(item.id_loca),
                  label: item.intitule_loca,
                }))}
                isClearable
                placeholder="Sélectionner un parent..."
              />
            </div>
          )}
        </div>

        <div className="flex space-x-3 pt-4 justify-end">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">{editRow ? 'Mettre à jour' : 'Valider'}</Button>
        </div>
      </form>
    </div>
  )
}

export default FormLocalite
