import Button from '../../components/Button';
import { ArrowLeft, Edit2, PlusIcon, Trash2 } from 'lucide-react';
import { useProjet } from '../../contexts/ProjetContext';

const HeadZone = () => {
    const { setselectedProject, selectedProject, setopenForm } = useProjet();

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className='flex gap-2' >
                {selectedProject && (
                    <button
                        className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-white font-bold text-lg'
                        onClick={() => setselectedProject(undefined)}
                    >
                        <ArrowLeft className='text-gray-700' />
                    </button>
                )}

                <h1 className="text-3xl font-bold text-gray-900">
                    {selectedProject?.sigle_projet && `${selectedProject?.sigle_projet} | `}
                    {selectedProject?.intitule_projet || 'Gestion des projets'}
                </h1>
            </div>

            <div className="flex items-center gap-3">
                {selectedProject
                    ? (
                        <>
                            <Button
                                onClick={()=>{
                                    setopenForm(true)
                                }}
                            >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Modifier des informations
                            </Button>

                            <Button variant='danger' >
                                Supprimer
                                <Trash2 className="w-4 h-4 mr-2" />
                            </Button>
                        </>
                    )
                    : (
                        <Button
                            onClick={() => {
                                setopenForm(true);
                            }}
                        >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Ajouter un projet
                        </Button>
                    )}
            </div>
        </div>
    )
}

export default HeadZone