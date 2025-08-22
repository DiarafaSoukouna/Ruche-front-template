import { useEffect, useState } from "react";
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import FormNiveau from "./form";
import Button from "../../../../components/Button";
import { allNiveauLocalite } from "../../../../functions/niveauLocalites/gets";
import { deleteNiveauLocalite } from "../../../../functions/niveauLocalites/delete";
import Card from "../../../../components/Card";
import Table from "../../../../components/Table";
import { RiseLoader } from "react-spinners";


const NiveauLocalite = () => {
    const [niveauLocalites, setNiveauLocalites] = useState([])
    const [showForm, setShowForm] = useState<Boolean>(false)
    const [loading, setLoading] = useState<Boolean>(false)
    const [editRow, setEditRow] = useState(null);


    const columns = [
        {
            key: 'libelle_nlc',
            title: 'Libellé',
            render: (value: String) => (
                <div className="flex items-center">
                    <div>
                        <div className="font-medium text-gray-900">{value}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'Code_number_nlc',
            title: 'Code',
            render: (value: String) => (
                <div className="flex items-center">
                    <div>
                        <div className="font-medium text-gray-900">{value}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'nombre_nlc',
            title: 'Nombre',
            render: (value: String) => (
                <div className="flex items-center">
                    <div>
                        <div className="font-medium text-gray-900">{value}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            render: (_: any, row: any) => (
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => (setEditRow(row), setShowForm(true))}
                    >
                        <EditIcon className="w-3 h-3" />
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => del(row.id_nlc)}
                    >
                        <TrashIcon className="w-3 h-3" />
                    </Button>
                </div>
            )
        }
    ]
    const all = async () => {
        setLoading(true)
        try {
            const res = await allNiveauLocalite();
            setNiveauLocalites(res)
            setLoading(false)
        } catch (error) {
            console.error(error)
        }
    }
    const del = async (id: number) => {
        try {
            const res = await deleteNiveauLocalite(id);
            all()
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        all()
    }, [])
    return (
        <div className="overflow-hidden">
            {!showForm ? (
                <>
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <label className="text-2xl font-bold text-gray-900">Niveau de localité</label>
                        </div>
                        <Button variant="primary" onClick={() => setShowForm(true)}>
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Ajouter
                        </Button>
                    </div>
                    {
                        loading ?
                            (<div className="text-center">
                                <RiseLoader color='blue' />
                            </div>
                            ) :
                            <Table
                                columns={columns}
                                data={niveauLocalites}
                                itemsPerPage={5}
                            />
                    }
                </>
            ) : <FormNiveau showModal={() => setShowForm(false)} editRow={editRow || null} all={() => all()} />
            }

        </div>
    )
}
export default NiveauLocalite;