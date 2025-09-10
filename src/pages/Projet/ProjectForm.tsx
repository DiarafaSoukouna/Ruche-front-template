import Modal from '../../components/Modal';
import { useProjet } from '../../contexts/ProjetContext';

const ProjectForm = () => {
    const { openForm, setopenForm } = useProjet();
    return (
        <Modal
            isOpen={openForm}
            onClose={() => setopenForm(false)}
        >
            ok
        </Modal>
    )
}

export default ProjectForm