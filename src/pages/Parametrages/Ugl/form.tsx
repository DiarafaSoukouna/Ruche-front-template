import { Controller, useForm } from 'react-hook-form'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Select, { MultiValue, SingleValue } from 'react-select'
import { typeUgl } from '../../../functions/ugl/types'
import { allLocalite } from '../../../functions/localites/gets'
import { useEffect, useState } from 'react'
import { typeLocalite } from '../../../functions/localites/types'
import { addUgl } from '../../../functions/ugl/post'
import { updateUgl } from '../../../functions/ugl/put'
import { toast } from 'react-toastify'
interface FormProps {
    ugl: typeUgl
    isEdit: boolean,
    all: () => void
    onClose: () => void
}
const FormUgl: React.FC<FormProps> = ({
    ugl,
    isEdit,
    all,
    onClose
}) => {
    const [localites, setLocalites] = useState<typeLocalite[]>([])
    const { control, register, handleSubmit, formState: { errors } } = useForm<typeUgl>({ mode: "onSubmit" })
    const onSubmit = async (data: typeUgl) => {
        console.log('data', data)
        const dataToSend = ugl?.id_ugl
            ? { ...data, id_ugl: ugl.id_ugl }
            : data;
        try {
            let res;
            if (ugl.id_ugl) {
                res = await updateUgl(dataToSend)
            } else {
                res = await addUgl(dataToSend)
            }
            onClose()
            all()
            toast.success(ugl.id_ugl ?
                "Unités de gestion mise a jour avec succès" :
                "Unités de gestion ajoutée avec succès")
            console.log(res)
        } catch (error) {
            toast.error("erreur lors de la creation de l'unité de gestion")
            console.log(error)
        }
    }
    const AllLocalites = async () => {
        try {
            const res: typeLocalite[] = await allLocalite()
            setLocalites(res)
            all()
        } catch (error) {
            return error
        }
    }
    type OptionType = {
        value: number;
        label: string;
    };
    useEffect(() => {
        AllLocalites()
    }, [])
    const localiteOptions = localites.map(item => ({
        value: Number(item.code_loca),
        label: item.intitule_loca
    }));
    console.log(ugl)
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code
                    </label>
                    <input

                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        type="text"
                        defaultValue={ugl?.code_ugl}
                        {...register("code_ugl", { required: "Ce champ est obligatoire" })}
                        placeholder="Entrez le code"
                    />
                    {errors.code_ugl && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.code_ugl.message}
                        </p>
                    )}
                </div>
                <div className="col-span-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Abréviation
                    </label>
                    <input

                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        type="text"
                        defaultValue={ugl?.abrege_ugl}
                        {...register("abrege_ugl", { required: "Ce champ est obligatoire" })}
                        placeholder="Entrez le sigle"
                    />
                    {errors.abrege_ugl && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.abrege_ugl.message}
                        </p>
                    )}
                </div>
                <div className="col-span-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom
                    </label>
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={ugl?.nom_ugl}
                        rows={1}
                        placeholder="Entrez le libélle"
                        {...register("nom_ugl", { required: "Ce champ est obligatoire" })}
                    >
                    </textarea>
                    {errors.nom_ugl && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.nom_ugl.message}
                        </p>
                    )}
                </div>
                <div className="col-span-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Couleur
                    </label>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        type="color"
                        defaultValue={ugl?.couleur_ugl}
                        {...register("couleur_ugl", { required: "Ce champ est obligatoire" })}
                        placeholder="Entrez le sigle"
                    />
                    {errors.couleur_ugl && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.couleur_ugl.message}
                        </p>
                    )}
                </div>
                <div className="col-span-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zone d'intervation
                    </label>

                    <Controller
                        name="chef_lieu_ugl"
                        control={control}
                        defaultValue={ugl?.chef_lieu_ugl}
                        render={({ field }) => (
                            <Select<OptionType>
                                {...field}
                                options={localiteOptions}
                                isClearable
                                placeholder="Sélectionner"
                                className="react-select-container"
                                classNamePrefix="react-select"
                                value={localiteOptions.find(opt => opt.value === field.value) || null}
                                onChange={(option: SingleValue<OptionType>) => field.onChange(option ? option.value : null)}
                            />
                        )}
                    />
                    {errors.chef_lieu_ugl && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.chef_lieu_ugl.message}
                        </p>
                    )}
                </div>
                <div className="col-span-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Regions concernées
                    </label>
                    <Controller
                        name="region_concerne_ugl"
                        control={control}
                        defaultValue={ugl?.region_concerne_ugl ?? []}
                        render={({ field }) => (
                            <Select<OptionType, true>
                                {...field}
                                options={localiteOptions}
                                isMulti
                                isClearable
                                placeholder="Sélectionner"
                                className="react-select-container"
                                classNamePrefix="react-select"
                                value={localiteOptions.filter(opt =>
                                    (field.value as number[]).includes(opt.value)
                                )}
                                onChange={(options: MultiValue<OptionType>) =>
                                    field.onChange(options.map(opt => opt.value))
                                }
                            />
                        )}
                    />
                    {errors.region_concerne_ugl && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.region_concerne_ugl.message}
                        </p>
                    )}
                </div>

            </div>
            <div className="flex space-x-3 pt-4 justify-end">
                <Button variant="outline" onClick={() => onClose()}>
                    Annuler
                </Button>
                <Button className="" type="submit">
                    {isEdit ? 'Mettre à jour' : 'Valider'}
                </Button>
            </div>
        </form>
    )
}
export default FormUgl
