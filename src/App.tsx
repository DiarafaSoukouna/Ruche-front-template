import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Analytics from "./pages/Analytics";
import Acteurs from "./pages/Parametrages/Acteurs/index";
import PersonnelPage from "./pages/Parametrages/personnel/PersonnelPage";
import Localites from "./pages/Parametrages/Localites";
import PartFinanciers from "./pages/Parametrages/PartFinancier";
import ChangePassword from "./pages/ChangePassword";
import Ugls from "./pages/Parametrages/Ugl";
import ConventionPage from "./pages/Parametrages/convention/ConventionPage";
import AutresParametrages from "./pages/Parametrages/AutresParametrages/index";
import ZoneCollecte from "./pages/Parametrages/ZoneCollecte/index";
import PlanSitePage from "./pages/Parametrages/planSite";
import FonctionPage from "./pages/Parametrages/personnel/fonction-personnel/FonctionPage";
import Programmes from "./pages/Parametrages/Programme";
import CadreAnalytique from "./pages/CadreAnalytique";
import { RootProvider } from "./contexts/RootContext";
import { NavbarProvider } from "./contexts/NavbarContext";
import Projet from "./pages/Projet";

import DictionnaireIndicateurPage from "./pages/Parametrages/dictionnaire-indicateur/DictionnaireIndicateurPage";
import IndicateurCmrPage from "./pages/Parametrages/indicateur-cmr/IndicateurCmrPage";
import IndicateurCadreResultatPage from "./pages/Parametrages/indicateur-cadre-resultat/IndicateurCadreResultatPage";
import CadreStrategiquePage from "./pages/Parametrages/cadre-strategique/CadreStrategiquePage";
import NiveauCadreStrategiquePage from "./pages/Parametrages/cadre-strategique/niveau-cadre-strategique/NiveauCadreStrategiquePage";
import NiveauCadreStrategiqueDetail from "./pages/Parametrages/cadre-strategique/niveau-cadre-strategique/NiveauCadreStrategiqueDetail";
import NiveauCadreAnalytiqueDetail from "./pages/CadreAnalytique/niveau-cadre-analytique/NiveauCadreAnalytiqueDetail";
import CibleCmrProjetPage from "./pages/Parametrages/cible-cmr-projet/CibleCmrProjetPage";
import CibleCmrProjetDetail from "./pages/Parametrages/cible-cmr-projet/CibleCmrProjetDetail";
import Actions from "./pages/Actions";

const AppContent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const isAuthenticated = useState<boolean>(true);
  // const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <NavbarProvider children={<Navbar />} />}

      <main className={isAuthenticated ? "px-4 sm:px-6 lg:px-8 py-8" : ""}>
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
            path="/projets"
            element={isAuthenticated ? <Projet /> : <Navigate to="/login" />}
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
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
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
            path="/dictionnaire_indicateurs"
            element={
              isAuthenticated ? (
                <DictionnaireIndicateurPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/indicateurs_cmr"
            element={
              isAuthenticated ? <IndicateurCmrPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/indicateur_cadre_resultat"
            element={
              isAuthenticated ? (
                <IndicateurCadreResultatPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/cadre_strategique"
            element={
              isAuthenticated ? (
                <CadreStrategiquePage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/niveau_cadre_strategique"
            element={
              isAuthenticated ? (
                <NiveauCadreStrategiquePage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/niveau_cadre_strategique/:id"
            element={
              isAuthenticated ? (
                <NiveauCadreStrategiqueDetail />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/niveau_cadre_analytique/:id"
            element={
              isAuthenticated ? (
                <NiveauCadreAnalytiqueDetail />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/cible_cmr_projet"
            element={
              isAuthenticated ? (
                <CibleCmrProjetPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/cible_cmr_projet/:id"
            element={
              isAuthenticated ? (
                <CibleCmrProjetDetail />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/change_password"
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
          <Route
            path="/action_programme"
            element={isAuthenticated ? <Actions /> : <Navigate to="/login" />}
          />
          <Route
            path="/cadre_analytique"
            element={
              isAuthenticated ? <CadreAnalytique /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RootProvider>
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
      </RootProvider>
    </AuthProvider>
  );
};

export default App;
