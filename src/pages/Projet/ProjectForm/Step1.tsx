import { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProjectCreateData } from "../../../schemas/projetSchema";

interface StepProps {
    register: UseFormRegister<ProjectCreateData>;
    errors: FieldErrors<ProjectCreateData>;
}

const Step1: FC<StepProps> = ({ register, errors }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Code *</label>
                <input {...register("code_projet")} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
                {errors.code_projet && <p className="text-red-500 text-sm">{errors.code_projet.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Sigle *</label>
                <input {...register("sigle_projet")} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
                {errors.sigle_projet && <p className="text-red-500 text-sm">{errors.sigle_projet.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Intitulé *</label>
                <input {...register("intitule_projet")} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
                {errors.intitule_projet && <p className="text-red-500 text-sm">{errors.intitule_projet.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Durée *</label>
                <input type="number" {...register("duree_projet", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
                {errors.duree_projet && <p className="text-red-500 text-sm">{errors.duree_projet.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Date de signature *</label>
                <input type="date" {...register("date_signature_projet")} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
                {errors.date_signature_projet && <p className="text-red-500 text-sm">{errors.date_signature_projet.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Date de démarrage *</label>
                <input type="date" {...register("date_demarrage_projet")} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
                {errors.date_demarrage_projet && <p className="text-red-500 text-sm">{errors.date_demarrage_projet.message}</p>}
            </div>
        </div>
    );
};

export default Step1;
