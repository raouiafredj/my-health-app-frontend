// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Register from './components/Register';
import Login from './components/Login';
import DashboardMedecin from './pages/DashboardMedecin';
import DashboardPatient from './pages/DashboardPatient';
import Visites from './pages/Visites';
import Ordonnances from './pages/Ordonnances';
import MesOrdonnances from './pages/MesOrdonnances';
import MesVisitesPatient from './pages/MesVisitesPatient';
import ValidationPartages from './pages/ValidationPartages';
import ProposerPartage from './pages/ProposerPartage';
import HistoriqueMedical from './pages/HistoriqueMedical';
import Biometrie from './pages/Biometrie';
import Accueil from './pages/Accueil';
import CalendrierComplet from './pages/CalendrierComplet';
import HistoriqueMedecin from './pages/HistoriqueMedecin';
import Vaccins from './pages/Vaccins';
import VaccinsMedecin from './pages/VaccinsMedecin';
import EmailsMedecin from './pages/EmailsMedecin';
import MessagesPatient from './pages/MessagesPatient';

function App() {
  // ✅ Ne chargez rien ici
  // ✅ La protection se fait dans chaque page ou via Sidebar

  return (
    <Router>
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<Accueil />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Médecin */}
        <Route path="/dashboard-medecin" element={<DashboardMedecin />} />
        <Route path="/visites" element={<Visites />} />
        <Route path="/ordonnances" element={<Ordonnances />} />
        <Route path="/validation-partages" element={<ValidationPartages />} />
        <Route path="/historique-medecin" element={<HistoriqueMedecin />} />
        <Route path="/vaccins-medecin" element={<VaccinsMedecin />} />
        <Route path="/emails-medecin" element={<EmailsMedecin />} />

        {/* Patient */}
        <Route path="/dashboard-patient" element={<DashboardPatient />} />
        <Route path="/mes-ordonnances" element={<MesOrdonnances />} />
        <Route path="/mes-visites" element={<MesVisitesPatient />} />
        <Route path="/proposer-partage" element={<ProposerPartage />} />
        <Route path="/historique" element={<HistoriqueMedical />} />
        <Route path="/biometrie" element={<Biometrie />} />
        <Route path="/calendrier" element={<CalendrierComplet />} />
        <Route path="/vaccins" element={<Vaccins />} />
        <Route path="/messages" element={<MessagesPatient />} />

        {/* Redirection par défaut */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Redirection par défaut pour les chemins inconnus */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// ✅ Composant de redirection conditionnelle
function DashboardRedirect() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  return userInfo.role === 'medecin' 
    ? <Navigate to="/dashboard-medecin" /> 
    : <Navigate to="/dashboard-patient" />;
}

export default App;