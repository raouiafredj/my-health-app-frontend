// src/pages/ValidationPartages.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Divider,
  Alert
} from '@mui/material';
import API_URL from '../config/api';

export default function ValidationPartages() {
  const [partages, setPartages] = useState([]);
  const token = JSON.parse(localStorage.getItem('userInfo'))?.token;


useEffect(() => {
  const fetchPartages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/partages/medecin`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      console.log('Données reçues:', data); // 🔍 Vérifiez si vide
      setPartages(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  fetchPartages();
}, []);

  const fetchPartages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/partages/medecin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPartages(data);
    } catch (error) {
      console.error('Erreur chargement partages');
    }
  };

  const valider = async (id, statut, motif = '') => {
    await fetch(`${API_URL}/api/partages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ statut, motifRejet: motif })
    });
    fetchPartages();
  };

  return (
    <Sidebar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
            🩺 Validation des Partages de Médicaments
          </Typography>

          {partages.length === 0 ? (
            <Alert severity="info">Aucune demande en attente.</Alert>
          ) : (
            <List>
              {partages.map(p => (
                <div key={p._id}>
                  <ListItem>
                    <ListItemText
                      primary={`💊 ${p.medicament.nom} - ${p.medicament.quantite} unités`}
                      secondary={
                        <>
                          <div><strong>Donneur :</strong> {p.donneur.email}</div>
                          <div><strong>Bénéficiaire :</strong> {p.receveur.email}</div>
                          <div><strong>Posologie :</strong> {p.medicament.posologie}</div>
                        </>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => valider(p._id, 'approuve')}
                      >
                        ✅ Approuver
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          const motif = prompt('Motif du rejet :');
                          if (motif) valider(p._id, 'rejete', motif);
                        }}
                      >
                        ❌ Rejeter
                      </Button>
                    </Box>
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Sidebar>
  );
}