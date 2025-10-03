import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  UsersIcon,
  BarChartIcon as ChartBarIcon,
  CogIcon,
  ChevronDownIcon,
  BellIcon,
  MapPinIcon,
  User,
  Building2,
  HandshakeIcon,
  LayoutGrid,
  FileSignature,
  LogOutIcon,
  KeyIcon,
  Settings2Icon,
  BriefcaseIcon,
  ListTodoIcon,
  File,
  CheckSquare,
  FileIcon,
  TargetIcon,
  BookIcon,
  BarChart2Icon,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ChangeProjectModal from './ChangeProjectModal'
import { useNavbar } from '../contexts/NavbarContext'

interface NavigationChild {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

interface NavigationItem {
  name: string
  href?: string | boolean
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  children?: NavigationChild[]
}

const Navbar: React.FC = () => {
  const { setShowChangeProjectModal } = useNavbar()

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()
  const userDropdownRef = useRef<HTMLDivElement>(null)

  // Function to get user initials
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  // Handle click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navigationItems: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    {
      name: 'Paramétrage',
      icon: CogIcon,
      children: [
        // { name: "Produits", href: "/products", icon: ShoppingBagIcon },
        { name: 'Localités', href: '/localites', icon: MapPinIcon },
        { name: 'Unités de gestion', href: '/unite_gestion', icon: LayoutGrid },
        { name: 'Acteurs', href: '/acteurs', icon: User },
        { name: 'Utilisateurs', href: '/utilisateurs', icon: UsersIcon },
        { name: 'Fonctions', href: '/fonctions', icon: BriefcaseIcon },
        {
          name: 'Partenaire Financier',
          href: '/part_financier',
          icon: HandshakeIcon,
        },
        { name: 'Zone de Collecte', href: '/zone-collecte', icon: MapPinIcon },

        { name: 'Plan stratégique', href: '/programmes', icon: Building2 },
        { name: 'Plans de Site', href: '/plan_sites', icon: Building2 },
        { name: 'Conventions', href: '/conventions', icon: FileSignature },
        {
          name: 'Autres paramétrages',
          href: '/autres_parametrages',
          icon: Settings2Icon,
        },
        { name: 'Zone de Collecte', href: '/zone-collecte', icon: MapPinIcon },
      ],
      href: true,
    },
    {
      name: 'Programmes',
      icon: FileSignature,
      children: [
        {
          name: 'Cadre analytique',
          href: '/cadre_analytique',
          icon: ChartBarIcon,
        },
        {
          name: 'Cadre stratégique',
          href: '/cadre_strategique',
          icon: TargetIcon,
        },
        {
          name: 'Actions programme',
          href: '/action_programme',
          icon: ListTodoIcon,
        },
        {
          name: 'Indicateurs strategique',
          href: '/indicateurs_strategique',
          icon: ChartBarIcon,
        },
      ],
      href: true,
    },
    {
      name: 'Projets',
      icon: FileIcon,
      children: [
        { name: 'Liste des projets', href: '/projets', icon: FileIcon },

        {
          name: 'Cadre de résultat',
          href: '/cadre_resultat',
          icon: ListTodoIcon,
        },
        {
          name: 'Indicateurs cadre resultat',
          href: '/indicateur_cadre_resultat',
          icon: ChartBarIcon,
        },
        {
          name: 'Dictionnaire des indicateurs',
          href: '/dictionnaire_indicateurs',
          icon: BookIcon,
        },
        {
          name: 'Indicateurs du CMR',
          href: '/indicateurs_cmr',
          icon: BarChart2Icon,
        },
        {
          name: 'Cibles du CMR',
          href: '/cible_cmr_projet',
          icon: TargetIcon,
        },
      ],
      href: true,
    },
  ]

  const isActive = (href?: string | boolean) =>
    typeof href === 'string' ? location.pathname === href : false

  return (
    <nav className="bg-background text-foreground shadow-lg border-b border-primary-50 sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <span className="text-primary-foreground font-bold text-sm">
                  R
                </span>
              </div>
              <span className="text-xl font-bold text-primary">
                Système informatisé de suivi-évaluation
              </span>
            </div>
          </div>

          <form className="mx-auto w-full max-w-md mt-3">
            <ChangeProjectModal />
          </form>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 gap-3">
              <BellIcon className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer" />

              {/* User Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 rounded-full w-10 h-10 bg-primary hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <div className="rounded-full w-10 h-10 bg-primary flex items-center justify-center">
                    <p className="text-sm font-medium text-primary-foreground">
                      {user
                        ? getUserInitials(
                            `${user.prenom_perso} ${user.nom_perso}`
                          )
                        : 'AD'}
                    </p>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium text-foreground">
                          {user?.prenom_perso || 'Utilisateur'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.id_personnel_perso || ''}
                        </p>
                      </div>

                      <Link
                        to="/change_password"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-primary-50 hover:text-primary transition-colors"
                      >
                        <KeyIcon className="w-4 h-4 mr-3" />
                        Changer de mot de passe
                      </Link>

                      {/* <button
                        onClick={() => {
                          setShowChangeProjectModal(true)
                        }}
                        className="flex text-left items-center w-full px-4 py-2 text-sm text-gray-600  hover:bg-blue-50 hover:text-blue-700  transition-colors"
                      >
                        <Box className="w-4 h-4 mr-3" />
                        Changer de programme
                      </button>
                      <ChangeProjectModal /> */}

                      <button
                        onClick={() => {
                          logout()
                          setUserDropdownOpen(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <LogOutIcon className="w-4 h-4 mr-3" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="h-px bg-border border-0"></hr>

      <div className="ml-10 flex space-x-1 p-2">
        {navigationItems.map((item) => (
          <div key={item.name} className="relative">
            {item.children ? (
              <div className="relative">
                <button
                  onMouseEnter={() => setDropdownOpen(item.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 transition-all duration-200
                  ${
                    item.children
                      .map((child) => isActive(child.href))
                      .includes(true)
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : dropdownOpen === item.name
                      ? 'bg-primary-50 text-primary'
                      : 'text-foreground hover:text-primary hover:bg-primary-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform ${
                      dropdownOpen === item.name ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {dropdownOpen === item.name && (
                  <div className="absolute left-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border z-50">
                    <div
                      className="py-2"
                      onMouseLeave={() => setDropdownOpen(null)}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          onClick={() => setDropdownOpen(null)}
                          className={`flex items-center px-4 py-2 text-sm transition-colors ${
                            isActive(child.href)
                              ? 'bg-primary-50 text-primary border-r-2 border-primary'
                              : 'text-foreground hover:bg-primary-50 hover:text-primary'
                          }`}
                        >
                          <child.icon className="w-4 h-4 mr-3" />
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.href as string}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-foreground hover:text-primary hover:bg-primary-50'
                }`}
                onClick={() => setDropdownOpen(null)}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}

export default Navbar
