import React, { useState, useEffect } from 'react'
import Button from '../../components/Button'
import { ActionsTypes } from '../../types/actions'
import { NiveauActionTypes } from '../../types/niveauAction'
import { toast } from 'react-toastify'
import { useRoot } from '../../contexts/RootContext'
import { updateActions } from '../../functions/actions/put'
import { addActions } from '../../functions/actions/post'

type FormActionsProps = {
  onClose: () => void
  editRow: ActionsTypes | null
  refreshData: () => void
  niveau: number
  dataActions: ActionsTypes[]
}

const FormActions: React.FC<FormActionsProps> = ({
  onClose,
  editRow,
  refreshData,
  niveau,
  dataActions,
}) => {
  const { currentProgramme } = useRoot()

  const [formData, setFormData] = useState<ActionsTypes>({
    id_ap: 0,
    code_ap: '',
    intutile: '',
    niveau_ap: niveau,
    code_relai_ap: '',
    parent_ap: null,
    id_programme: currentProgramme?.id_programme,
  })

  useEffect(() => {
    if (editRow) {
      setFormData({
        id_ap: editRow.id_ap,
        code_ap: editRow.code_ap,
        intutile: editRow.intutile,
        niveau_ap: niveau,
        code_relai_ap: editRow.code_relai_ap,
        parent_ap: editRow.parent_ap,
        id_programme: currentProgramme?.id_programme,
      })
    }
  }, [editRow])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.code_ap || !formData.intutile) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    setLoading(true)
    try {
      if (editRow) {
        await updateActions(formData)
      } else {
        await addActions(formData)
      }

      toast.success(
        editRow
          ? 'Action mise à jour avec succès'
          : 'Action ajoutée avec succès'
      )
      onClose()
      refreshData()
    } catch (error) {
      console.error(error)
      toast.error('Erreur lors de la sauvegarde de l’action')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Code</label>
        <input
          type="text"
          name="code_ap"
          value={formData.code_ap}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Libellé */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Libellé
        </label>
        <input
          type="text"
          name="intutile"
          value={formData.intutile}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Niveau */}

      {/* Code Relai */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Code Relai
        </label>
        <input
          type="text"
          name="code_relai_ap"
          value={formData.code_relai_ap}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Parent */}
      {niveau > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Parent
          </label>

          <select
            name="parent_ap"
            value={formData.parent_ap || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
          >
            <option value="">-- Choisir --</option>
            {dataActions
              .filter((n) => n.id_ap === niveau - 1)
              .map((action) => (
                <option key={action.id_ap} value={action.id_ap}>
                  {action.intutile}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onClose}
          type="button"
          disabled={loading}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {editRow ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </div>
    </form>
  )
}

export default FormActions
