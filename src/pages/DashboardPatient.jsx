// src/pages/DashboardPatient.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import { Healing, Description, Today, Email } from '@mui/icons-material';
import { Container, Grid, Paper, Typography, Alert } from '@mui/material';
import NotificationsAlert from '../components/NotificationsAlert';
import API_URL from '../config/api';

export default function DashboardPatient() {
  const [stats, setStats] = useState({
    visites: 0,
    ordonnances: 0,
    prochaineVisite: null,
    notifications: 0
  });
  const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/patient/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erreur API brute:', errorText);
        return;
      }

      const data = await res.json();
      console.log('Stats patient:', data); // 🔍 Débogage
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4  }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32' }}>
          📥 Tableau de bord - Patient
        </Typography>

              <NotificationsAlert />
        <Alert severity="success" sx={{ mb: 3 }}>
          Vos données médicales sont sécurisées.
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
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Prochaine visite"
              value={stats.prochaineVisite ? new Date(stats.prochaineVisite).toLocaleDateString('fr-FR') : 'Aucune'}
              icon={<Today sx={{ fontSize: 40, color: '#ed6c02' }} />}
            />
          </Grid>
       {/*    <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Notifications"
              value={stats.notifications}
              icon={<Email sx={{ fontSize: 40, color: '#d32f2f' }} />}
            />
          </Grid>*/}
        </Grid>

        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            📄 Vos documents médicaux
          </Typography>
          <Typography color="textSecondary">Ordonnances, comptes rendus, etc.</Typography>
        </Paper>
      </Container>
    </Sidebar>
  );
}