import { Projet } from '../types/projet'
import Button from './Button'
import Card from './Card'
import { useProjet } from '../contexts/ProjetContext'

const ProjectCard = ({ value }: { value: Projet }) => {
    const { setselectedProject } = useProjet();

    return (
        <>
            <Card className="hover:scale-105 transform transition-transform duration-300 rounded-2xl shadow-md">
                <div className="gap-2 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-500 text-white font-bold text-lg">
                            {value.intitule_projet.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h4 className="text-xl font-semibold text-gray-700">
                                #{value.code_projet}
                            </h4>
                            <p className="text-sm">{value.sigle_projet}</p>
                        </div>
                    </div>

                    {/* Body */}
                    <p>{value.intitule_projet}</p>

                    <Button
                        size="sm"
                        className="w-full"
                        onClick={() => setselectedProject(value)}
                    >
                        Ouvrir le projet
                    </Button>
                </div>
            </Card>

        </>
    )
}

export default ProjectCard
