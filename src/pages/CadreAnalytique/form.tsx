import React, { useState, useEffect } from 'react'
import Button from '../../components/Button'
import { CadreAnalytiqueTypes } from '../../types/cadreAnalytique'
import { toast } from 'react-toastify'
import { addCadreAnalytique } from '../../functions/cadreAnalytique/post'
import { updateCadreAnalytique } from '../../functions/cadreAnalytique/put'

type FormCadreAnalytiqueProps = {
  onClose: () => void
  niveau: number
  currentId: number
  niveauCadreAnalytique: any[]
  dataCadreAnalytique: CadreAnalytiqueTypes[]
  editRow: CadreAnalytiqueTypes | null
  cadreByNiveau: () => void
}

const FormCadreAnalytique: React.FC<FormCadreAnalytiqueProps> = ({
  onClose,
  niveau,
  currentId,
  niveauCadreAnalytique,
  editRow,
  cadreByNiveau,
}) => {
  const [formData, setFormData] = useState<CadreAnalytiqueTypes>({
    code_ca: '',
    cout_axe: 0,
    parent_ca: null,
    id_ca: currentId,
    partenaire_ca: null,
    projet_ca: null,
    intutile_ca: '',
    abgrege_ca: '',
    niveau_ca: niveau,
  })

  useEffect(() => {
    if (editRow) {
      setFormData({
        code_ca: editRow.code_ca || '',
        intutile_ca: editRow.intutile_ca || '',
        cout_axe: editRow.cout_axe || 0,
        id_ca: editRow.id_ca || currentId,
        partenaire_ca: null,
        parent_ca: editRow.parent_ca || null,
        projet_ca: null,
        abgrege_ca: editRow.abgrege_ca || '',
        niveau_ca: niveau,
      })
    }
  }, [editRow])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editRow) {
        await updateCadreAnalytique(formData)
        toast.success('Cadre analytique mis à jour avec succès')
      } else {
        await addCadreAnalytique({ ...formData })
        toast.success('Cadre analytique ajouté avec succès')
      }
      onClose()
      cadreByNiveau()
    } catch (error) {
      console.error(error)
      toast.error('Erreur lors de la sauvegarde du cadre analytique')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Code</label>
        <input
          type="text"
          name="code_ca"
          value={formData.code_ca}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Intitulé */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Intitulé
        </label>
        <input
          type="text"
          name="intutile_ca"
          value={formData.intutile_ca}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Coût axe */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Coût axe
        </label>
        <input
          type="number"
          step="0.01"
          name="cout_axe"
          value={formData.cout_axe}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
        />
      </div>
      {/* Abrege ca */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Abregé
        </label>
        <input
          type="text"
          name="abgrege_ca"
          value={formData.abgrege_ca}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Parent (si applicable) */}
      {niveau > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {niveauCadreAnalytique[niveau > 1 ? niveau - 2 : 0].libelle_csa}
          </label>
          <select
            name="parent_ca"
            value={formData.parent_ca || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
          >
            <option value="">-- Aucun -- {niveau}</option>
            {niveauCadreAnalytique
              .filter((n) => n.niveau_ca === niveau - 1)
              .map((niv) => (
                <option key={niv.id_csa} value={niv.id_csa}>
                  {niv.libelle_csa}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose} type="button">
          Annuler
        </Button>
        <Button type="submit">{editRow ? 'Mettre à jour' : 'Ajouter'}</Button>
      </div>
    </form>
  )
}

export default FormCadreAnalytique
