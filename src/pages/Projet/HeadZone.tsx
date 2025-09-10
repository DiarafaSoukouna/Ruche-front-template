import Button from '../../components/Button'
import { PlusIcon } from 'lucide-react'

const HeadZone = () => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600 mt-2">
                    Analyse détaillée des performances et KPIs
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Button>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Ajouter un projet
                </Button>
            </div>
        </div>
    )
}

export default HeadZone