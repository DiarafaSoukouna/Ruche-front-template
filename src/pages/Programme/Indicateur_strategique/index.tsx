import { useState, useEffect } from 'react'
import Card from '../../../components/Card'
import {
  Pencil,
  Trash,
  PlusIcon,
  EditIcon,
  TrashIcon,
  ListTreeIcon,
  SearchIcon,
} from 'lucide-react'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'

import Table from '../../../components/Table'
import { RiseLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { typeIndicStrategique } from '../../../functions/indicateurStrategique/types'
import { allIndicStrategique } from '../../../functions/indicateurStrategique/gets'
import { cadreStrategiqueConfigService } from '../../../services/cadreStrategiqueConfigService'
import { CadreStrategiqueConfig } from '../../../types/entities'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/Tabs'
import { useRoot } from '../../../contexts/RootContext'
import FormIndicateurStrategique from './form'
import ConfirmModal from '../../../components/ConfirModal'
import { deleteIndicStrategique } from '../../../functions/indicateurStrategique/delete'
import { allCibleIndicStrategique } from '../../../functions/cibleIndicateurStrategique/gets'
import { typeCibleIndicStrategique } from '../../../functions/cibleIndicateurStrategique/types'
import CibleIndicateur from './cible/index'
import { set } from 'zod'

const IndicateurStrategique = () => {
  //   const [acteurs, setIndicStrategiques] = useState([])
  // const [acteurs, set]
  const { currentProgramme } = useRoot()
  const [showModal, setShowModal] = useState(false)
  const [IndicStrategiques, setIndicStrategiques] = useState<
    typeIndicStrategique[]
  >([])
  const [cibleIndicStrategiques, setCibleIndicStrategiques] = useState<any[]>(
    []
  )
  const [cibleByIndicateurs, setcibleByIndicateurs] = useState<
    typeCibleIndicStrategique[]
  >([])
  const [addBoutonLabel, setAddBoutonLabel] = useState<string>('')
  const [tabActive, setTabActive] = useState<string>('1')
  const [cadreStrategiques, setCadreStrategiques] = useState<
    CadreStrategiqueConfig[]
  >([])
  const [isDelete, setIsDelete] = useState(false)
  const [showModalCible, setShowModalCible] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [IndicStrategique, setIndicStrategique] =
    useState<typeIndicStrategique>({
      id_indicateur_str: 0,
      niveau_istr: 0,
      code_indicateur_istr: '',
      code_istr: '',
      intitule_indicateur_istr: '',
      periodicite_iop: '',
      source_istr: '',
      responsable_istr: '',
      description_istr: '',
      structure_istr: '',
      programme_istr: 0,
    })
  const clean = () => {
    setIndicStrategique({
      id_indicateur_str: 0,
      niveau_istr: 0,
      code_indicateur_istr: '',
      code_istr: '',
      intitule_indicateur_istr: '',
      periodicite_iop: '',
      source_istr: '',
      responsable_istr: '',
      description_istr: '',
      structure_istr: '',
      programme_istr: 0,
    })
    setIsEdit(false)
    setShowModal(false)
  }
  const loadCible = (row: any) => {
    setIndicStrategique(row)
    const cible_indic = cibleIndicStrategiques.filter(
      (cible) =>
        cible.code_indicateur_istr.code_indicateur_istr ===
        row.code_indicateur_istr
    )
    setcibleByIndicateurs(cible_indic)
    console.log(
      'cibleByIndicateur',
      cible_indic,
      'cibleIndicStrategiques',
      cibleIndicStrategiques
    )
    setShowModalCible(true)
  }
  const getValeurCibleByIndic = (code_indicateur_istr: string) => {
    let somme = 0
    cibleIndicStrategiques.forEach((cible) => {
      if (
        cible.code_indicateur_istr.code_indicateur_istr === code_indicateur_istr
      ) {
        console.log('valeur', cible.valeur_cible_indcateur_istr)
        somme += Number(cible.valeur_cible_indcateur_istr)
      }
    })
    return somme
  }
  const onEdit = (row: typeIndicStrategique) => {
    setIndicStrategique(row)
    setShowModal(true)
  }

  const fetchIndicStrategiques = async () => {
    try {
      setLoading(true)
      const res = await allIndicStrategique()
      if (res) {
        setIndicStrategiques(res)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }
  const fetchCibleIndicStrategiques = async () => {
    try {
      setLoading(true)
      const res = await allCibleIndicStrategique()
      if (res) {
        setCibleIndicStrategiques(res)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  const fetchNiveauCadre = async () => {
    try {
      setLoading(true)
      const res = await cadreStrategiqueConfigService.getAll()

      // const filteredCad: any = res.filter(
      //   (cadre: any) => cadre.programme === currentProgramme.code_programme
      // )

      // const niveau =
      //   filteredCad.length > 0 ? filteredCad[0].libelle_csc.split(',') : []

      setCadreStrategiques(res)

      setLoading(false)

      console.log('cadre strategique', res)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const DeleteIndicateurStrategique = async (id: number) => {
    try {
      await deleteIndicStrategique(id)
      setIsDelete(false)
      toast.success('Indicateur strategique supprimé avec succès')
      fetchIndicStrategiques()
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de la suppression de l'indicateur strategique")
    }
  }
  const handleTabClick = async (niv: number, libelle: string) => {
    setTabActive(String(niv))
    setAddBoutonLabel(libelle)
  }

  useEffect(() => {
    fetchCibleIndicStrategiques()
    fetchIndicStrategiques()
    fetchNiveauCadre()
  }, [])

  const [isEdit, setIsEdit] = useState(false)
  const columns = [
    {
      key: 'code_indicateur_istr',
      title: 'Code',
      render: (value: String) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'intitule_indicateur_istr',
      title: 'Intitulé',
      render: (value: String) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },

    {
      key: 'description_istr',
      title: 'Description',
      render: (value: String) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'cible_istr',
      title: 'Valeur cible',
      render: (value: String, row: any) => (
        <div className="flex items-center">
          <div
            key={row.id_indicateur_str}
            className="bg-yellow-100 text-yellow-800 cursor-pointer px-2 py-1 rounded"
            onClick={() => loadCible(row)}
          >
            {getValeurCibleByIndic(row.code_indicateur_istr)}
          </div>
        </div>
      ),
    },
    {
      key: 'responsable_istr',
      title: 'Responsable',
      render: (value: String) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
            <EditIcon className="w-3 h-3" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setIsDelete(true)
              setIndicStrategique(row)
            }}
          >
            <TrashIcon className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header avec contrôles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Indicateurs strategiques
          </h1>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => {
              setShowModal(true)
            }}
            size="md"
            variant="primary"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nouvel indicateur
          </Button>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => clean()}
        title={isEdit ? "Modifier l'indicateur" : 'Nouvel indicateur'}
        size="xl"
      >
        <FormIndicateurStrategique
          row_indic={IndicStrategique}
          niveau={tabActive}
          all={fetchIndicStrategiques}
          isEdit={isEdit}
          onClose={() => clean()}
        />
      </Modal>

      <Modal
        isOpen={showModalCible}
        onClose={() => setShowModalCible(false)}
        title={
          IndicStrategique.code_indicateur_istr +
          ' ' +
          IndicStrategique.intitule_indicateur_istr
        }
        size="xl"
      >
        <CibleIndicateur
          code_indicateur={IndicStrategique.code_indicateur_istr}
        />
      </Modal>
      <ConfirmModal
        isOpen={isDelete}
        onClose={() => setIsDelete(false)}
        title={'Supprimer cet indicateur'}
        size="md"
        confimationButon={() =>
          DeleteIndicateurStrategique(IndicStrategique.id_indicateur_str)
        }
      ></ConfirmModal>
      <Tabs defaultValue={`1`}>
        <div className="mt-2 mb-2 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <TabsList className="flex space-x-2">
              {cadreStrategiques.length
                ? cadreStrategiques.map((stratConfig: any, index) => (
                    <div
                      key={index + 1}
                      onClick={() =>
                        handleTabClick(index + 1, stratConfig.libelle_nsc)
                      }
                    >
                      <TabsTrigger key={index + 1} value={String(index + 1)}>
                        {stratConfig.libelle_nsc}
                      </TabsTrigger>
                    </div>
                  ))
                : 'Niveau localité non disponible'}
            </TabsList>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Rechercher..."
              />
            </div>

            {/* <Button
              onClick={() => handleAddForm(true)}
            >
              <PlusIcon size={16} className="mr-2" />
              Nouvelle {addBoutonLabel}
            </Button> */}
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <RiseLoader color="green" />
          </div>
        ) : cadreStrategiques.length ? (
          cadreStrategiques.map((cadreStrat: any, index) => (
            <div key={index + 1}>
              <TabsContent value={String(index + 1)}>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <Table
                    columns={columns}
                    data={IndicStrategiques.filter(
                      (indic) => indic.niveau_istr == index + 1
                    )}
                    itemsPerPage={5}
                  />
                </div>
              </TabsContent>
            </div>
          ))
        ) : (
          'Niveau cadre strategique indisponible'
        )}
      </Tabs>
    </div>
  )
}
export default IndicateurStrategique
