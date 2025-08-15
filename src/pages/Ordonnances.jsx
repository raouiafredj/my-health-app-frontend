// src/pages/Ordonnances.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import API_URL from '../config/api';

export default function Ordonnances() {
  const [medicaments, setMedicaments] = useState([{ nom: '', posologie: '', duree: '', quantite: 1 }]);
  const [formData, setFormData] = useState({
    patientEmail: '',
  });
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

  const ajouterMedicament = () => {
    setMedicaments([...medicaments, { nom: '', posologie: '', duree: '', quantite: 1 }]);
  };

  const modifierMedicament = (index, champ, valeur) => {
    const nouveaux = [...medicaments];
    nouveaux[index][champ] = champ === 'quantite' ? parseInt(valeur) || 1 : valeur;
    setMedicaments(nouveaux);
  };

  const supprimerMedicament = (index) => {
    if (medicaments.length > 1) {
      setMedicaments(medicaments.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/ordonnances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          medicaments,
          patientEmail: formData.patientEmail
        })
      });

      if (res.ok) {
        setSuccess('Ordonnance envoyée par email avec succès !');
        setFormData({ patientEmail: '' });
        setMedicaments([{ nom: '', posologie: '', duree: '', quantite: 1 }]);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const error = await res.json();
        alert('Erreur: ' + error.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Problème de connexion');
    }
  };

  return (
    <Sidebar>
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
            📄 Créer une Ordonnance
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>Patient</Typography>
            <TextField
              name="patientEmail"
              label="Email du patient"
              type="email"
              value={formData.patientEmail}
              onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
              placeholder="Entrez l'email du patient"
              required
              fullWidth
              margin="normal"
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Médicaments</Typography>
            <List>
              {medicaments.map((m, i) => (
                <div key={i}>
                  <ListItem>
                    <TextField
                      size="small"
                      label="Médicament"
                      value={m.nom}
                      onChange={(e) => modifierMedicament(i, 'nom', e.target.value)}
                      sx={{ flexGrow: 1, mr: 1 }}
                    />
                    <TextField
                      size="small"
                      label="Posologie"
                      value={m.posologie}
                      onChange={(e) => modifierMedicament(i, 'posologie', e.target.value)}
                      sx={{ flexGrow: 1, mr: 1 }}
                    />
                    <TextField
                      size="small"
                      label="Durée"
                      value={m.duree}
                      onChange={(e) => modifierMedicament(i, 'duree', e.target.value)}
                      sx={{ width: 80, mr: 1 }}
                    />
                    <TextField
                      size="small"
                      label="Qté"
                      type="number"
                      value={m.quantite}
                      onChange={(e) => modifierMedicament(i, 'quantite', e.target.value)}
                      sx={{ width: 60, mr: 1 }}
                    />
                    {medicaments.length > 1 && (
                      <Button size="small" onClick={() => supprimerMedicament(i)} color="error">
                        ❌
                      </Button>
                    )}
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={ajouterMedicament} variant="outlined">
                ➕ Ajouter un médicament
              </Button>
              <Button type="submit" variant="contained" color="primary">
                📤 Envoyer l’ordonnance
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Sidebar>
  );
}