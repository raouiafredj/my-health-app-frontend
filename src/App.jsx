// src/App.jsx
import React, { useState, useEffect } from 'react';
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
import EmailsMedecin from './pages/EmailsMedecin'; // ✅ Import ajouté
import MessagesPatient from './pages/MessagesPatient';


function App() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('userInfo');
    if (saved) setUserInfo(JSON.parse(saved));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Médecin */}
        <Route
          path="/dashboard-medecin"
          element={userInfo?.role === 'medecin' ? <DashboardMedecin /> : <Navigate to="/login" />}
        />
        <Route
          path="/visites"
          element={userInfo?.role === 'medecin' ? <Visites /> : <Navigate to="/login" />}
        />
        <Route
          path="/ordonnances"
          element={userInfo?.role === 'medecin' ? <Ordonnances /> : <Navigate to="/login" />}
        />
        <Route
          path="/validation-partages"
          element={userInfo?.role === 'medecin' ? <ValidationPartages /> : <Navigate to="/login" />}
        />
        <Route
          path="/historique-medecin"
          element={userInfo?.role === 'medecin' ? <HistoriqueMedecin /> : <Navigate to="/login" />}
        />
        <Route
          path="/vaccins-medecin"
          element={userInfo?.role === 'medecin' ? <VaccinsMedecin /> : <Navigate to="/login" />}
        />
        <Route
          path="/emails-medecin"
          element={userInfo?.role === 'medecin' ? <EmailsMedecin /> : <Navigate to="/login" />}
        />

        {/* Patient */}
        <Route
          path="/dashboard-patient"
          element={userInfo?.role === 'patient' ? <DashboardPatient /> : <Navigate to="/login" />}
        />
        <Route
          path="/mes-ordonnances"
          element={userInfo?.role === 'patient' ? <MesOrdonnances /> : <Navigate to="/login" />}
        />
        <Route
          path="/mes-visites"
          element={userInfo?.role === 'patient' ? <MesVisitesPatient /> : <Navigate to="/login" />}
        />
        <Route
          path="/proposer-partage"
          element={userInfo?.role === 'patient' ? <ProposerPartage /> : <Navigate to="/login" />}
        />
        <Route
          path="/historique"
          element={userInfo?.role === 'patient' ? <HistoriqueMedical /> : <Navigate to="/login" />}
        />
        <Route
          path="/biometrie"
          element={userInfo?.role === 'patient' ? <Biometrie /> : <Navigate to="/login" />}
        />
        <Route
          path="/calendrier"
          element={userInfo?.role ? <CalendrierComplet /> : <Navigate to="/login" />}
        />
        <Route
          path="/vaccins"
          element={userInfo?.role === 'patient' ? <Vaccins /> : <Navigate to="/login" />}
        />
        <Route
  path="/messages"
  element={userInfo?.role === 'patient' ? <MessagesPatient /> : <Navigate to="/login" />}
/>

        {/* Redirection par défaut après login */}
        <Route
          path="/dashboard"
          element={
            userInfo?.role === 'medecin'
              ? <Navigate to="/dashboard-medecin" />
              : userInfo?.role === 'patient'
                ? <Navigate to="/dashboard-patient" />
                : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;