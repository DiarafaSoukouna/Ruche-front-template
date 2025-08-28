import { TrashIcon } from "lucide-react";
import { typeNiveauStructure } from "../../../../functions/niveauStructures/types";


interface Props {
    setFormInputs: (row:typeNiveauStructure[]) => void;
    formInputs: typeNiveauStructure[];
    niveauStructuresLength: number

}

const FormNiveau: React.FC<Props> = ({ formInputs, niveauStructuresLength, setFormInputs }) => {
    const removeFormRow = (index: number) => {
        const newFormInputs:typeNiveauStructure[] = [...formInputs];
        newFormInputs.splice(index, 1);
        setFormInputs(newFormInputs);
    };
    const handleInputChange = (index: number, field: string, value: string) => {
        const newFormInputs = [...formInputs];

        if (field === 'nombre_nsc') {
            (newFormInputs[index] as any)[field] = Number(value);
        } else if (field === 'code_number_nsc') {
            (newFormInputs[index] as any)[field] = Number(value);
        } else {
            (newFormInputs[index] as any)[field] = value;
        }

        setFormInputs(newFormInputs);
        console.log('ok', newFormInputs)
    };
    return (
        <>
            {formInputs.map((input, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1 + niveauStructuresLength}

                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <input
                            type="text"
                            placeholder="Ex: Ministere, Secretariat..."
                            value={input.libelle_nsc}
                            onChange={(e) => handleInputChange(index, 'libelle_nsc', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <input
                            type="number"
                            placeholder="Ex: 2, 3..."
                            value={input.code_number_nsc}
                            onChange={(e) => handleInputChange(index, 'code_number_nsc', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <button
                            type="button"
                            onClick={() => removeFormRow(index)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-700"
                            title="Supprimer cette ligne"
                        >
                            <TrashIcon size={18} />
                        </button>
                    </td>
                </tr>
            ))
            }
        </>

    );
};

export default FormNiveau;
