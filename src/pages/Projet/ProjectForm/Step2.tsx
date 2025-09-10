import { FC, useEffect, useState } from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import Select from "react-select";
import { ProjectCreateData } from "../../../schemas/projetSchema";

interface FormProps {
    control: Control<ProjectCreateData>;
    errors: FieldErrors<ProjectCreateData>;
}

const Step2: FC<FormProps> = ({ control, errors }) => {
    const [partenaires1, setPartenaires1] = useState<{ id: number; name: string }[]>([]);
    const [partenaires, setPartenaires] = useState<{ id: number; name: string }[]>([]);
    const [structures, setStructures] = useState<{ id: number; name: string }[]>([]);
    const [signataires, setSignataires] = useState<{ id: number; name: string }[]>([]);
    const [zones, setZones] = useState<{ id: number; name: string }[]>([]);


    useEffect(() => {
        // Fetch dynamique pour remplir les selects
        // Exemple :
        // fetch("/api/partenaires").then(r => r.json()).then(setPartenaires)
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Partenaire du projet *</label>
                <Controller
                    name="partenaire_projet"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            isMulti={false}
                        />
                    )}
                />
                {errors.partenaire_projet && <p className="text-red-500 text-sm">{errors.partenaire_projet.message}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium mb-1">Structures du projet *</label>
                <Controller
                    name="structure_projet"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            isMulti
                            options={structures.map(s => ({ value: s.id, label: s.name }))}
                            value={structures.filter(s => field.value.includes(s.id)).map(s => ({ value: s.id, label: s.name }))}
                            onChange={selected => field.onChange(selected.map(s => s.value))}
                            classNamePrefix="react-select"
                        />
                    )}
                />
                {errors.structure_projet && <p className="text-red-500 text-sm">{errors.structure_projet.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Signataires du projet *</label>
                <Controller
                    name="signataires_projet"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            isMulti
                            options={signataires.map(s => ({ value: s.id, label: s.name }))}
                            value={signataires.filter(s => field.value.includes(s.id)).map(s => ({ value: s.id, label: s.name }))}
                            onChange={selected => field.onChange(selected.map(s => s.value))}
                            classNamePrefix="react-select"
                        />
                    )}
                />
                {errors.signataires_projet && <p className="text-red-500 text-sm">{errors.signataires_projet.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Partenaires d'exécution *</label>
                <Controller
                    name="partenaires_execution_projet"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            isMulti
                            options={partenaires.map(p => ({ value: p.id, label: p.name }))}
                            value={partenaires.filter(p => field.value.includes(p.id)).map(p => ({ value: p.id, label: p.name }))}
                            onChange={selected => field.onChange(selected.map(s => s.value))}
                            classNamePrefix="react-select"
                        />
                    )}
                />
                {errors.partenaires_execution_projet && <p className="text-red-500 text-sm">{errors.partenaires_execution_projet.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Zones *</label>
                <Controller
                    name="zone_projet"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            isMulti
                            options={zones.map(z => ({ value: z.id, label: z.name }))}
                            value={zones.filter(z => field.value.includes(z.id)).map(z => ({ value: z.id, label: z.name }))}
                            onChange={selected => field.onChange(selected.map(s => s.value))}
                            classNamePrefix="react-select"
                        />
                    )}
                />
                {errors.zone_projet && <p className="text-red-500 text-sm">{errors.zone_projet.message}</p>}
            </div>
        </div>
    );
};

export default Step2;
