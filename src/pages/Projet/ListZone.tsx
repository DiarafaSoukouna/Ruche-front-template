import { useProjet } from '../../contexts/ProjetContext';
import ProjectCard from '../../components/ProjectCard';

const ListZone = () => {
    const { projetList } = useProjet();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projetList.map(value => (
                <ProjectCard
                    key={value.id_projet}
                    value={value}
                />
            ))}
        </div>
    )
}

export default ListZone