import { useProjet } from '../../../../contexts/ProjetContext';
import ConfirmModal from '../../../../components/ConfirModal';

const DeleteModal = () => {
    const {
        openDeleteModal,
        handleDelete,
        setopenDeleteModal,
    } = useProjet();

    return (
        <ConfirmModal
            confimationButon={handleDelete}
            isOpen={openDeleteModal}
            onClose={() => setopenDeleteModal(false)}
            size='sm'
        />
    )
}

export default DeleteModal