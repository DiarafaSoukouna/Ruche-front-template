import { useProjet } from "../../../../contexts/ProjetContext";

export default () => {
    const { selectedProject } = useProjet();

    if (!selectedProject) return null;

    return (
        <div>
            {/* Contenu du drawer */}
            <div className="p-4">
                <h2 className="text-lg font-bold mb-4">
                    Détails du projet #{selectedProject.code_projet}
                </h2>
                <p>
                    <span className="font-semibold">Sigle:</span> {selectedProject.sigle_projet}
                </p>
                <p>
                    <span className="font-semibold">Intitulé:</span>{' '}
                    {selectedProject.intitule_projet}
                </p>
                <p>
                    <span className="font-semibold">Durée:</span> {selectedProject.duree_projet} ans
                </p>
                {/* Tu peux ajouter d'autres champs ici */}
            </div>
        </div>
    )
}
