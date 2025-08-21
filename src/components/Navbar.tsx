import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  BarChartIcon as ChartBarIcon,
  CogIcon,
  ChevronDownIcon,
  BellIcon,
  Search,
  MapPinIcon,
  User,
} from 'lucide-react';

interface NavigationChild {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface NavigationItem {
  name: string;
  href?: string | boolean;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: NavigationChild[];
}

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    {
      name: 'Paramétrage',
      icon: CogIcon,
      children: [
        { name: 'Utilisateurs', href: '/users', icon: UsersIcon },
        { name: 'Produits', href: '/products', icon: ShoppingBagIcon },
        { name: 'Localités', href: '/localites', icon: MapPinIcon },
        { name: 'Acteurs', href: '/acteurs', icon: User },
      ],
      href: true,
    },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  ];

  const isActive = (href?: string | boolean) =>
    typeof href === 'string' ? location.pathname === href : false;

  return (
    <nav className="bg-white shadow-lg border-b border-blue-100 sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-blue-900">
                Systeme informatisé de suivi évaluation
              </span>
            </div>
          </div>

          <form className="mx-auto w-full max-w-md mt-3">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full px-4 py-2 ps-8 text-sm text-gray-900 border border-gray-300 rounded-xl bg-gray-50 focus:ring-blue-500 text-dark focus:border-blue-500"
                placeholder=" Rechercher..."
                required
              />
            </div>
          </form>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 gap-3">
              <BellIcon className="w-5 h-5 text-gray-600 hover:text-blue-700 cursor-pointer" />
              <div className="flex items-center space-x-2">
                <div className="rounded-full w-10 h-10 bg-gray-300 flex items-center justify-center">
                  <p className="text-sm font-medium">AD</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="h-px bg-gray-200 border-0"></hr>

      <div className="ml-10 flex space-x-1 p-2">
        {navigationItems.map((item) => (
          <div key={item.name} className="relative">
            {item.children ? (
              <div
                className="relative"
                // onMouseEnter={() => setDropdownOpen(item.name)}
                // onMouseLeave={() => setDropdownOpen(null)}
              >
                <button
                  onMouseEnter={() => setDropdownOpen(item.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 transition-all duration-200
                   ${
                     item.children
                       .map((child) => isActive(child.href))
                       .includes(true)
                       ? 'bg-blue-600 text-white shadow-md'
                       : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                   } ${
                    dropdownOpen === item.name
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
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
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-blue-100 z-50">
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
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                              : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
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
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
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
  );
};

export default Navbar;
