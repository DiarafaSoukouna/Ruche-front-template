import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Products from './pages/Products'
import Analytics from './pages/Analytics'
import Localites from './pages/Localites'

const AppContent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const { isAuthenticated } = useAuth()

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
      </Router>
    </AuthProvider>
  )
}

export default App
