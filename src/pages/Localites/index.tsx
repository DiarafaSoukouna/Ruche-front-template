import React from "react";
import Button from "../../components/Button";
import { MapPinIcon, PlusIcon } from "lucide-react";

const Localites: React.FC = () => {
    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Localités</h1>
                </div>
                <Button variant="outline">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    Niveau Localités 
                </Button>
            </div>
        </div>
    )
}
export default Localites;