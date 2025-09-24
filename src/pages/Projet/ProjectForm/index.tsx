// components/ProjectForm.tsx
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import { addProjet, editProjet } from '../../../functions/projet'
import { useRoot } from '../../../contexts/RootContext'
import {
  ProjectCreateData,
  projectCreateSchema,
} from '../../../schemas/projetSchema'
import { Check } from 'lucide-react'
import Step1 from './Step1'
import Step2 from './Step2'
import { useProjet } from '../../../contexts/ProjetContext'

const ProjectForm = () => {
  const { currentProgramme } = useRoot()
  const { openForm, setopenForm, selectedProject, setProjetList } = useProjet()
  const [step, setStep] = useState(1)
  const { isEdit, setIsEdit } = useProjet()

  const defaultValues = useMemo<ProjectCreateData>(
    () => ({
      code_projet: selectedProject?.code_projet || '',
      sigle_projet: selectedProject?.sigle_projet || '',
      intitule_projet: selectedProject?.intitule_projet || '',
      duree_projet: selectedProject?.duree_projet || 0,
      date_signature_projet: selectedProject?.date_signature_projet || '',
      date_demarrage_projet: selectedProject?.date_demarrage_projet || '',
      partenaire_projet: selectedProject?.partenaire_projet?.id_acteur || 0,
      structure_projet:
        selectedProject?.structure_projet.map(({ id_acteur }) => id_acteur) ||
        [],
      signataires_projet:
        selectedProject?.signataires_projet.map(({ id_acteur }) => id_acteur) ||
        [],
      partenaires_execution_projet:
        selectedProject?.partenaires_execution_projet.map(
          ({ id_acteur }) => id_acteur
        ) || [],
      zone_projet:
        selectedProject?.zone_projet.map(({ id_loca }) => id_loca as number) ||
        [],
    }),
    [selectedProject, currentProgramme]
  )

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProjectCreateData>({
    resolver: zodResolver(projectCreateSchema),
    defaultValues,
  })

  const onSubmit = async (data: ProjectCreateData) => {
    try {
      if (!!selectedProject) {
        const res = await editProjet(selectedProject.id_projet, {
          ...data,
          partenaire_projet: currentProgramme?.id_programme,
        })
        res &&
          setProjetList((prev) =>
            prev.map((p) => (p.id_projet === res.id_projet ? res : p))
          )
      } else {
        const res = await addProjet(data)
        res && setProjetList((prev) => [...prev, res])
      }
      setopenForm(false)
    } catch (err) {
      console.error('Erreur :', err)
    }
  }
  const close = () => {
    setopenForm(false)
    setIsEdit(false)
  }

  // Reset quand le projet change
  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  return (
    <Modal
      isOpen={openForm}
      onClose={() => close()}
      title={isEdit ? 'Modifier projet' : 'Nouveau projet'}
      size="lg"
    >
      <div className="flex justify-end">
        {step == 1 && <p className="text-sm italic text-gray-500"> Page 1/2</p>}

        {step == 2 && <p className="text-sm italic text-gray-500"> Page 2/2</p>}
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        {/* <h3 className="font-bold text-lg">Ajouter un projet</h3> */}

        <Step1 step={step} register={register} errors={errors} />

        <Step2 control={control} errors={errors} step={step} />

        <div className="flex gap-2 justify-end *:w-full">
          {step > 1 && (
            <Button
              type="button"
              variant="danger"
              onClick={() => setStep(step - 1)}
            >
              Précédent
            </Button>
          )}
          {step < 2 && (
            <Button type="button" onClick={() => setStep(step + 1)}>
              Suivant
            </Button>
          )}
          {step === 2 && (
            <Button type="submit">
              Valider <Check />
            </Button>
          )}
        </div>
      </form>
    </Modal>
  )
}

export default ProjectForm
