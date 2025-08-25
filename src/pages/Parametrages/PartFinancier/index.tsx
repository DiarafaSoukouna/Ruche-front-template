import { useState, useEffect } from 'react'
import Card from '../../../components/Card'
import {
    PlusIcon,
    EditIcon,
    TrashIcon,
    ListTreeIcon,
} from 'lucide-react'
import { RiseLoader } from "react-spinners"
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import Table from '../../../components/Table'
import { typePartFinancier } from '../../../functions/partenaire_financiers/types'
import { allPartFinancier } from '../../../functions/partenaire_financiers/gets'
import { updatePartFinancier } from '../../../functions/partenaire_financiers/put'
import { addPartFinancier } from '../../../functions/partenaire_financiers/post'
import FormPartFinancier from './form'
import { deletePartFinancier } from '../../../functions/partenaire_financiers/delete'
import { toast } from 'react-toastify'

const PartFinanciers = () => {
    //   const [acteurs, setPartFinanciers] = useState([])
    // const [acteurs, set]
    const [showModal, setShowModal] = useState(false)
    const [partFinanciers, setPartFinanciers] = useState<typePartFinancier[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [isDelete, setIsDelete] = useState(false)
    const [part_financier, setPart_financier] = useState<typePartFinancier>({
        id_partenaire: 0,
        definition_part: '',
        sigle_part: '',
        code_part: '',
        statut: "0",
    })
    const clean = () => {
        setPart_financier({
            id_partenaire: 0,
            definition_part: '',
            sigle_part: '',
            code_part: '',
            statut: "0",
        })
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            if (isEdit) {
                await updatePartFinancier(part_financier)
            } else {
                await addPartFinancier(part_financier)
            }
            setShowModal(false)
            toast.success(isEdit ?
                "Parténaire financié mise à jour avec succès"
            : "Parténaire financié ajouté avec succès"
            )
            fetchPartFinanciers()
            clean()
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du parténaire financié")
            console.error(error)
        }
    }
    const fetchPartFinanciers = async () => {
        setLoading(true)
        try {
            const res = await allPartFinancier()
            setPartFinanciers(res)
        } catch (error) {
            toast.error("Erreur lors de la récuperation du parténaire finanicié")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const deletePartFinancier = async (id: number) => {
        try {
            await deletePartFinancier(id)
            setIsDelete(false)
            toast.success("Parténaire finanicié supprimé avec succès")
            fetchPartFinanciers()
        } catch (error) {
            toast.error("Erreur lors de la suppression du parténaire finanicié")
            console.error(error)
        }
    }

    const close = () => {
        setShowModal(false)
        setIsEdit(false)
        setIsDelete(false)
        clean()
    }
    const [isEdit, setIsEdit] = useState(false)

    const onEdit = (part_financier: any) => {
        setPart_financier(part_financier)
        setShowModal(true)
        setIsEdit(true)
    }

    const columns = [
        {
            key: 'code_part',
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
            key: 'definition_part',
            title: 'Definition',
            render: (value: String) => (
                <div className="flex items-center">
                    <div>
                        <div className="font-medium text-gray-900">{value}</div>
                    </div>
                </div>
            ),
        },
        {
            key: 'sigle_part',
            title: 'Sigle',
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
                            setPart_financier(row)
                        }}
                    >
                        <TrashIcon className="w-3 h-3" />
                    </Button>
                </div>
            ),
        },
    ]
    useEffect(() => {
        fetchPartFinanciers()
    }, [])

    return (
        <div className="space-y-8">
            {/* Header avec contrôles */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Parténaires Financiers</h1>
                </div>
                <div className="flex gap-4">
                    <Button
                        onClick={() => {
                            (setShowModal(true), setIsEdit(false))
                        }}
                        size="md"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Nouvel Part Financier
                    </Button>
                </div>
            </div>
            <Modal
                isOpen={showModal}
                onClose={() => close()}
                title={isEdit ? "Modifier l'acteur" : 'Nouvel acteur'}
                size="md"
            >
                <FormPartFinancier
                    part_financier={part_financier}
                    setPartFinancier={setPart_financier}
                    isEdit={isEdit}
                    handleSubmit={handleSubmit}
                    onClose={() => close()}
                />
            </Modal>
            <Modal
                isOpen={isDelete}
                onClose={() => close()}
                title={'Supprimer un acteur'}
                size="md"
            >
                <div className="space-y-6">
                    <p className="text-gray-700">
                        Êtes-vous sûr(e) de vouloir supprimer cet acteur ? Cette action est
                        irréversible.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => close()}>
                            Annuler
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => deletePartFinancier(part_financier.id_partenaire!)}
                        >
                            Supprimer
                        </Button>
                    </div>
                </div>
            </Modal>

            <Card title="Liste des partenaires financiers" className="overflow-hidden">
                {loading ?
                    (<div className="text-center">
                        <RiseLoader color='blue' />
                    </div>
                    ) :
                    <Table columns={columns} data={partFinanciers} itemsPerPage={5} />
                }

            </Card>
        </div>
    )
}
export default PartFinanciers
