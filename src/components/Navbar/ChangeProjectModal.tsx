import Modal from "../Modal";
import { useNavbar } from "../../contexts/NavbarContext";
import { memo } from "react";
import { useRoot } from "../../contexts/RootContext";

const ChangeProjectModal = memo(() => {
    const { programmeList, currentProgramme } = useRoot();
    const {
        showChangeProjectModal,
        setShowChangeProjectModal,
        handleChangeCurrentProgramme
    } = useNavbar();

    return (
        <Modal
            isOpen={showChangeProjectModal}
            onClose={() => setShowChangeProjectModal(false)}
        >
            <h3 className="text-xl font-bold mb-4" >Selectionnez le projet desiré.</h3>

            <select
                className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-xl bg-gray-50 outline-none text-dark "
                onChange={({ target }) => handleChangeCurrentProgramme(parseInt(target.value))}
                defaultValue={currentProgramme?.id_programme}
            >
                {programmeList.map((programme) => (
                    <option
                        key={programme.id_programme}
                        value={programme.id_programme}
                    >{programme.sigle_programme} | {programme.nom_programme}</option>
                ))}
            </select>
        </Modal>
    )
})

export default ChangeProjectModal