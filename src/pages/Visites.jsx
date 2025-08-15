// src/pages/Visites.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import API_URL from '../config/api';

export default function Visites() {
  const [visites, setVisites] = useState([]);
  const [formData, setFormData] = useState({
    specialite: 'Cardiologue',
    date: '',
    type: 'consultation',
    notes: '',
    patientEmail: ''
  });
  const [emailForm, setEmailForm] = useState({
    destinataire: '',
    sujet: '',
    message: ''
  });
  const [success, setSuccess] = useState('');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo?.token;

  useEffect(() => {
    fetchVisites();
  }, []);

  const fetchVisites = async () => {
    try {
      const res = await fetch(`${API_URL}/api/medecin/visites`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erreur API brute:', errorText);
        return;
      }

      const data = await res.json();
      setVisites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement visites:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailChange = (e) => {
    setEmailForm({ ...emailForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const patientNom = formData.patientEmail.split('@')[0].replace('.', ' '); // Ex: "omar.raoui@gmail.com" → "Omar Raoui"
    const formattedNom = patientNom
      .split(' ')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
      const res = await fetch(`${API_URL}/api/medecin/visites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          specialite: formData.specialite,
          date: formData.date,
          type: formData.type,
          notes: formData.notes,
          patientEmail: formData.patientEmail,
          patientNom: formattedNom 
          
        })
      });

      if (res.ok) {
        const newVisite = await res.json();
        setVisites([newVisite, ...visites]);
        setFormData({
          specialite: 'Cardiologue',
          date: '',
          type: 'consultation',
          notes: '',
          patientEmail: ''
        });
        setSuccess('Visite créée et envoyée !');
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
            🩺 Mes Visites (Médecin)
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

          {/* Formulaire de visite */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '40px' }}>
            <Typography variant="h6" gutterBottom>Créer une visite</Typography>
            <TextField
              name="date"
              label="Date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="patientEmail"
              label="Email du patient"
              type="email"
              value={formData.patientEmail}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
  name="patientNom"
  label="Nom du patient"
  value={formData.patientNom}
  onChange={handleChange}
  placeholder="Prénom Nom"
  fullWidth
  margin="normal"
/>
            <TextField
              name="notes"
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              📤 Créer et envoyer
            </Button>
          </form>

         
          

          <Typography variant="h5" gutterBottom>Visites envoyées</Typography>
          <List>
            {visites.map(v => (
              <div key={v._id}>
                <ListItem>
                  <ListItemText
                    primary={`${v.medecin} • ${new Date(v.date).toLocaleDateString('fr-FR')}`}
                    secondary={`Patient : ${v.patientEmail} | Notes : ${v.notes}`}
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Paper>
      </Container>
    </Sidebar>
  );
}