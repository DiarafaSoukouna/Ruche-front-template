import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Building2,
  HandshakeIcon,
  LayoutGrid,
  FileSignature,
  KeyIcon,
  LogOutIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Function to get user initials
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  // Handle click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigationItems: NavigationItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    {
      name: "Paramétrage",
      icon: CogIcon,
      children: [
        { name: "Produits", href: "/products", icon: ShoppingBagIcon },
        { name: "Localités", href: "/localites", icon: MapPinIcon },
        { name: "Unités de gestion", href: "/unite_gestion", icon: LayoutGrid },
        { name: "Acteurs", href: "/acteurs", icon: User },
        { name: "Utilisateurs", href: "/utilisateurs", icon: UsersIcon },
        { name: "Plans de Site", href: "/plan-sites", icon: Building2 },
        { name: "Types de Zone", href: "/type-zones", icon: MapPinIcon },
        { name: "Partenaire Financier", href: "/part_financier", icon: HandshakeIcon },
        { name: "Conventions", href: "/conventions", icon: FileSignature },
      ],
      href: true,
    },
    { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
  ];

  const isActive = (href?: string | boolean) =>
    typeof href === "string" ? location.pathname === href : false;

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

              {/* User Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 rounded-full w-10 h-10 bg-blue-600 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="rounded-full w-10 h-10 bg-blue-600 flex items-center justify-center">
                    <p className="text-sm font-medium text-white">
                      {user
                        ? getUserInitials(
                            `${user.prenom_perso} ${user.nom_perso}`
                          )
                        : "AD"}
                    </p>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.prenom_perso || "Utilisateur"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.id_personnel_perso || ""}
                        </p>
                      </div>

                      <Link
                        to="/change-password"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <KeyIcon className="w-4 h-4 mr-3" />
                        Changer de mot de passe
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors"
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
                       ? "bg-blue-600 text-white shadow-md"
                       : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                   } ${
                    dropdownOpen === item.name
                      ? "bg-blue-50 text-blue-900"
                      : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform ${
                      dropdownOpen === item.name ? "rotate-180" : ""
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
                              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                              : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
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
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
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
