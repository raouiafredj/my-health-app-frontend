// src/pages/HistoriqueMedecin.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import OrdonnanceForm from '../components/OrdonnanceForm';
import { Container, Paper, Typography, List, ListItem, ListItemText, Divider, Alert } from '@mui/material';
import API_URL from '../config/api';
import { useAuth } from '../hooks/useAuth';

export default function HistoriqueMedecin() {
  const [visites, setVisites] = useState([]);
  //const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  //const token = userInfo?.token;
const { token, userInfo } = useAuth();
if (!userInfo) return null; 
  const fetchVisites = async () => {
    try {
      const res = await fetch(`${API_URL}/api/medecin/visites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setVisites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement visites:', error);
    }
  };

  useEffect(() => {
    fetchVisites();
  }, []);

  return (
    <Sidebar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
            📚 Historique des Patients
          </Typography>

          <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
            Ajoutez une ordonnance à n’importe quelle visite
          </Typography>

          {visites.length === 0 ? (
            <Alert severity="info">Aucune visite trouvée.</Alert>
          ) : (
            <List>
              {visites.map((v) => (
                <div key={v._id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="h6" component="span">
                          {v.medecin}
                        </Typography>
                      }
                      secondary={
                        <>
                          <div><strong>Patient :</strong> {v.patientEmail}</div>
                          <div><strong>Date :</strong> {new Date(v.date).toLocaleDateString('fr-FR')}</div>
                          <div><strong>Type :</strong> {v.type}</div>
                          {v.notes && <div><strong>Notes :</strong> {v.notes}</div>}
                        </>
                      }
                    />
                  </ListItem>
                  <OrdonnanceForm visiteId={v._id} onSuccess={fetchVisites} />
                  <Divider sx={{ my: 3 }} />
                </div>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Sidebar>
  );
}