import UniteIndicateurPage from './unite-indicateur/UniteIndicateurPage'
import TypeZonePage from './type-zone/TypeZonePage'

const AutresParametrages = () => {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <UniteIndicateurPage />
      <TypeZonePage />
    </div>
  )
}

export default AutresParametrages
