import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './contexts/AuthContext'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Products from './pages/Products'
import Analytics from './pages/Analytics'
import Acteurs from './pages/Parametrages/Acteurs/index'
import PersonnelPage from './pages/Parametrages/personnel/PersonnelPage'
import TypeZonePage from './pages/Parametrages/type-zone/TypeZonePage'
import Localites from './pages/Parametrages/Localites'
import PartFinanciers from './pages/Parametrages/PartFinancier'
import ChangePassword from './pages/ChangePassword'
import Ugls from './pages/Parametrages/Ugl'
import ConventionPage from './pages/Parametrages/convention/ConventionPage'
// import NiveauStructureConfigPage from './pages/Parametrages/niveau-structure-config/NiveauStructureConfigPage'
import AutresParametrages from './pages/Parametrages/AutresParametrages/index'
import ZoneCollecte from './pages/Parametrages/ZoneCollecte/index'
import PlanSitePage from './pages/Parametrages/planSite'
import FonctionPage from './pages/Parametrages/personnel/FonctionPage'
import Programmes from './pages/Parametrages/Programme'

const AppContent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const isAuthenticated = useState<boolean>(true)
  // const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}
      <main className={isAuthenticated ? 'px-4 sm:px-6 lg:px-8 py-8' : ''}>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/users"
            element={isAuthenticated ? <Users /> : <Navigate to="/login" />}
          />
          <Route
            path="/analytics"
            element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />}
          />
          <Route
            path="/products"
            element={isAuthenticated ? <Products /> : <Navigate to="/login" />}
          />
          <Route
            path="/localites"
            element={isAuthenticated ? <Localites /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />
            }
          />
          <Route
            path="/acteurs"
            element={isAuthenticated ? <Acteurs /> : <Navigate to="/login" />}
          />
          <Route
            path="/fonctions"
            element={
              isAuthenticated ? <FonctionPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/utilisateurs"
            element={
              isAuthenticated ? <PersonnelPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/programmes"
            element={
              isAuthenticated ? <Programmes /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/part_financier"
            element={
              isAuthenticated ? <PartFinanciers /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/unite_gestion"
            element={isAuthenticated ? <Ugls /> : <Navigate to="/login" />}
          />
          <Route
            path="/plan_sites"
            element={
              isAuthenticated ? <PlanSitePage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/type-zones"
            element={
              isAuthenticated ? <TypeZonePage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/conventions"
            element={
              isAuthenticated ? <ConventionPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/autres-parametrages"
            element={
              isAuthenticated ? (
                <AutresParametrages />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/change-password"
            element={
              isAuthenticated ? <ChangePassword /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/zone-collecte"
            element={
              isAuthenticated ? <ZoneCollecte /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </main>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AuthProvider>
  )
}

export default App
