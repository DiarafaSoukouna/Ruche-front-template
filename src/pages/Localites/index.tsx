import React, { lazy, useState } from "react";
import Button from "../../components/Button";
import { MapPinIcon, PlusIcon } from "lucide-react";
import Modal from "../../components/Modal";
import NiveauLocalite from "./niveau";

const Localites: React.FC = () => {
    const [loadNiveau, setLoadNiveau] = useState<Boolean>(false)
    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Localités</h1>
                </div>
                <Button variant="outline" onClick={() => setLoadNiveau(true)}>
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    Niveau Localités
                </Button>
            </div>
            <Modal onClose={() => setLoadNiveau(false) } isOpen={loadNiveau} title="Espace de configuration des niveau de localité" size="xl">
                <NiveauLocalite />
            </Modal>
        </div>
    )
}
export default Localites;