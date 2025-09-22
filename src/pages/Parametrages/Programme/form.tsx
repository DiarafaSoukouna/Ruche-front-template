import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import Button from '../../../components/Button'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ProgrammeTypes } from '../../../types/programme'
import { updateProgram } from '../../../functions/Programme/put'
import { addProgram } from '../../../functions/Programme/post'
interface FormProps {
  programme: ProgrammeTypes
  isEdit: boolean
  all: () => void
  onClose: () => void
}
const FormProgram: React.FC<FormProps> = ({
  programme,
  isEdit,
  all,
  onClose,
}) => {
  //   const [localites, setLocalites] = useState<typeLocalite[]>([]);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProgrammeTypes>({
    mode: 'onSubmit',
    defaultValues: programme || {},
  })

  React.useEffect(() => {
    reset(programme || {})
  }, [programme, reset])
  const onSubmit = async (data: ProgrammeTypes) => {
    console.log('data', data)
    try {
      let res
      if (programme.id_programme) {
        res = await updateProgram(data, programme.id_programme)
      } else {
        res = await addProgram(data)
      }
      onClose()
      all()
      if (res) {
        toast.success(
          programme.id_programme
            ? 'Programme mise a jour avec succès'
            : 'Programme ajoutée avec succès'
        )
      }
      console.log(res)
    } catch (error) {
      toast.error('erreur lors de la creation du programme')
      console.log(error)
    }
  }
  console.log('errors', errors)
  useEffect(() => {}, [])
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-foreground mb-1">
              Code
              <span className="text-destructive"> *</span>
            </label>
            <input
              type="number"
              className={`w-full px-3 py-2 border rounded-lg 
                                    bg-background text-foreground placeholder-muted-foreground border-input
                                    focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring `}
              {...register('code_programme', {
                required: 'Ce champ est obligatoire',
              })}
              placeholder="Entrez le code"
            />
            {errors && (
              <p className="mt-1 text-sm text-destructive">
                {errors.code_programme?.message}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-foreground mb-1">
              Sigle
              <span className="text-destructive"> *</span>
            </label>
            <input
              className={`w-full px-3 py-2 border rounded-lg 
                                    bg-background text-foreground placeholder-muted-foreground border-input
                                    focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring `}
              type="text"
              {...register('sigle_programme', {
                required: 'Ce champ est obligatoire',
              })}
              placeholder="Entrez le sigle"
            />
            {errors && (
              <p className="mt-1 text-sm text-destructive">
                {errors.sigle_programme?.message}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-12">
          <div className="w-full">
            <label className="block text-sm font-medium text-foreground mb-1">
              {' '}
              Nom
              <span className="text-destructive"> *</span>
            </label>

            <input
              className={`w-full px-3 py-2 border rounded-lg 
                                    bg-background text-foreground placeholder-muted-foreground border-input
                                    focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring `}
              placeholder="Entrez le libellé"
              type="text"
              {...register('nom_programme', {
                required: 'Ce champ est obligatoire',
              })}
              id=""
            />
            {errors && (
              <p className="mt-1 text-sm text-destructive">
                {errors.nom_programme?.message}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-12">
          <div className="w-full">
            <label className="block text-sm font-medium text-foreground mb-1">
              {' '}
              Objectif
              <span className="text-destructive"> *</span>
            </label>
            <textarea
              className={`w-full px-3 py-2 border rounded-lg 
                                    bg-background text-foreground placeholder-muted-foreground border-input
                                    focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring `}
              placeholder="Entrer l'objectif"
              {...register('objectif_programme', {
                required: 'Ce champ est obligatoire',
              })}
            ></textarea>
            {errors && (
              <p className="mt-1 text-sm text-destructive">
                {errors.objectif_programme?.message}
              </p>
            )}
          </div>
        </div>

        <div className="col-span-12">
          <div className="w-full">
            <label className="block text-sm font-medium text-foreground mb-1">
              {' '}
              Vision
              <span className="text-destructive"> *</span>
            </label>
            <textarea
              className={`w-full px-3 py-2 border rounded-lg 
                                    bg-background text-foreground placeholder-muted-foreground border-input
                                    focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring `}
              {...register('vision_programme', {
                required: 'Ce champ est obligatoire',
              })}
              placeholder="Enter la vision"
            ></textarea>
            {errors && (
              <p className="mt-1 text-sm text-destructive">
                {errors.vision_programme?.message}
              </p>
            )}
          </div>
        </div>

        <div className="col-span-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-foreground mb-1">
              {' '}
              Année debut
              <span className="text-destructive"> *</span>
            </label>
            <input
              className={`w-full px-3 py-2 border rounded-lg 
                                    bg-background text-foreground placeholder-muted-foreground border-input
                                    focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring `}
              type="date"
              {...register('annee_debut_programme', {
                required: 'Ce champ est obligatoire',
              })}
            />
            {errors && (
              <p className="mt-1 text-sm text-destructive">
                {errors.annee_debut_programme?.message}
              </p>
            )}
          </div>
        </div>

        <div className="col-span-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-foreground mb-1">
              {' '}
              Année fin
              <span className="text-destructive"> *</span>
            </label>
            <input
              className={`w-full px-3 py-2 border rounded-lg 
                                    bg-background text-foreground placeholder-muted-foreground border-input
                                    focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring `}
              type="date"
              {...register('annee_fin_programme', {
                required: 'Ce champ est obligatoire',
              })}
            />
            {errors && (
              <p className="mt-1 text-sm text-destructive">
                {errors.annee_fin_programme?.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4 justify-end">
        <Button variant="outline" onClick={() => onClose()}>
          Annuler
        </Button>
        <Button className="" type="submit">
          {isEdit ? 'Mettre à jour' : 'Valider'}
        </Button>
      </div>
    </form>
  )
}
export default FormProgram
