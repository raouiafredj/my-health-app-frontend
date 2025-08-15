// src/components/EnvoyerEmail.jsx
import { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';
import API_URL from '../config/api';
import { useAuth } from '../hooks/useAuth';

export default function EnvoyerEmail() {
  const [formData, setFormData] = useState({
    destinataire: '',  // ✅ Saisi manuellement
    sujet: '',
    message: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  //const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//  const token = userInfo?.token;
const { token, userInfo } = useAuth(); 
if (!userInfo) return null;
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // ✅ Validation de base de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.destinataire || !emailRegex.test(formData.destinataire)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    if (!formData.sujet || !formData.message) {
      setError('Le sujet et le message sont obligatoires');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/medecin/envoyer-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess('Email envoyé avec succès !');
        setFormData({ destinataire: '', sujet: '', message: '' });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.message || 'Erreur lors de l’envoi');
      }
    } catch (err) {
      setError('Problème de connexion');
    }
  };

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#1976d2' }}>
        📨 Envoyer un email à un destinataire
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        {/* ✅ Champ de saisie libre pour l'email */}
        <TextField
          name="destinataire"
          label="Email du destinataire"
          type="email"
          value={formData.destinataire}
          onChange={handleChange}
          placeholder="nom@exemple.com"
          required
          fullWidth
          margin="normal"
          helperText="Saisissez l'email du patient ou d'un contact"
        />

        <TextField
          name="sujet"
          label="Sujet"
          value={formData.sujet}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />

        <TextField
          name="message"
          label="Message"
          multiline
          rows={6}
          value={formData.message}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          ✉️ Envoyer Email
        </Button>
      </form>
    </Paper>
  );
}