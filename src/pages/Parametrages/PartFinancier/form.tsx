import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Textarea from '../../../components/TextArea'
import { typePartFinancier } from '../../../functions/partenaire_financiers/types'
interface FormProps {
    part_financier: typePartFinancier
    setPartFinancier: (value: typePartFinancier) => void
    isEdit: boolean
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}
const FormPartFinancier: React.FC<FormProps> = ({
    part_financier,
    setPartFinancier,
    isEdit,
    handleSubmit,
}) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code
                    </label>
                    <Input
                        type="text"
                        value={part_financier.code_part}
                        onChange={(e) =>
                            setPartFinancier({ ...part_financier, code_part: e.target.value })
                        }
                        placeholder="Entrez le sigle"
                    />
                </div>
                 <div className="col-span-12">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sigle
                    </label>
                    <Input
                        type="text"
                        value={part_financier.sigle_part}
                        onChange={(e) =>
                            setPartFinancier({ ...part_financier, sigle_part: e.target.value })
                        }
                        placeholder="Entrez le sigle"
                    />
                </div>
                <div className="col-span-12">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Definition
                    </label>
                    <Textarea
                        value={part_financier?.definition_part || ''}
                        onChange={(e) =>
                            setPartFinancier({ ...part_financier, definition_part: e.target.value })
                        }
                        placeholder="Entrez la définition"
                    />
                </div>
               
            </div>
            <div className="flex space-x-3 pt-4 justify-end">
                <Button variant="outline" onClick={() => close()} className="">
                    Annuler
                </Button>
                <Button className="" type="submit">
                    {isEdit ? 'Mettre à jour' : 'Valider'}
                </Button>
            </div>
        </form>
    )
}
export default FormPartFinancier
