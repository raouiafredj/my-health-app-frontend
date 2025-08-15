// src/pages/DashboardMedecin.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import { Email as EmailIcon, Healing, Description, Today } from '@mui/icons-material';
import { Container, Grid, Paper, Typography, Alert } from '@mui/material';
import EnvoyerEmail from '../components/EnvoyerEmail';
import API_URL from '../config/api';
export default function DashboardMedecin() {
  const [stats, setStats] = useState({
    visites: 0,
    ordonnances: 0,
    rappelsEnvoyes: 0,
    emailsEnvoyes: 0
  });
  const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/medecin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erreur API brute:', errorText);
        return;
      }

      const data = await res.json();
      console.log('Stats reçues:', data); // 🔍 Débogage
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Sidebar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
          🩺 Tableau de bord - Médecin
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          Bienvenue ! Vos prochaines consultations sont automatiquement suivies.
        </Alert>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Visites"
              value={stats.visites}
              icon={<Healing sx={{ fontSize: 40, color: '#1976d2' }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Ordonnances"
              value={stats.ordonnances}
              icon={<Description sx={{ fontSize: 40, color: '#2e7d32' }} />}
            />
          </Grid>
         {/*  <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Rappels envoyés"
              value={stats.rappelsEnvoyes}
              icon={<Today sx={{ fontSize: 40, color: '#ed6c02' }} />}
            />
          </Grid>*/}
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Emails envoyés"
              value={stats.emailsEnvoyes}
              icon={<EmailIcon sx={{ fontSize: 40, color: '#d32f2f' }} />}
            />
          </Grid>
        </Grid>

        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            📅 Prochaines consultations
          </Typography>
          <Typography color="textSecondary">Liste des visites à venir...</Typography>
        </Paper>
        <EnvoyerEmail />
      </Container>
    </Sidebar>
  );
}