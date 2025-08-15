// src/pages/ProposerPartage.jsx
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';
import API_URL from '../config/api';

export default function ProposerPartage() {
  const [formData, setFormData] = useState({
    nom: '',
    posologie: '',
    duree: '',
    quantite: 1,
    receveurEmail: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [medecinEmail, setMedecinEmail] = useState('');
  // ✅ Ajoutez cette ligne
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo?.token;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  if (!userInfo) {
    setError('Utilisateur non connecté');
    return;
  }

  try {
    // ✅ Ajout : Récupérer le médecin par email
    const medecinRes = await fetch(`${API_URL}/api/users?email=${medecinEmail}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const medecins = await medecinRes.json();
    const medecin = medecins.find(u => u.role === 'medecin');

    if (!medecin) {
      setError('Médecin non trouvé ou invalide');
      return;
    }

    const res = await fetch(`${API_URL}/api/partages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        medicament: {
          nom: formData.nom,
          posologie: formData.posologie,
          duree: formData.duree,
          quantite: parseInt(formData.quantite)
        },
        receveurEmail: formData.receveurEmail,
        medecinId: medecin._id // ✅ Envoyer l'ID du médecin
      })
    });

    if (res.ok) {
      setSuccess('Votre demande de partage a été envoyée au médecin pour validation.');
      setFormData({
        nom: '',
        posologie: '',
        duree: '',
        quantite: 1,
        receveurEmail: ''
      });
    } else {
      const data = await res.json();
      setError(data.message || 'Erreur lors de la soumission');
    }
  } catch (err) {
    console.error('Erreur réseau:', err);
    setError('Problème de connexion');
  }
};

  return (
    <Sidebar>
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32' }}>
            🤝 Proposer un partage de médicament
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            Vous pouvez proposer un médicament non utilisé à un autre patient. La demande sera soumise à l’approbation de votre médecin.
          </Alert>

          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Nom du médicament"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Posologie"
              name="posologie"
              value={formData.posologie}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Durée (ex: 5 jours)"
              name="duree"
              value={formData.duree}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Quantité"
              name="quantite"
              type="number"
              value={formData.quantite}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email du bénéficiaire"
              name="receveurEmail"
              type="email"
              value={formData.receveurEmail}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              helperText="L’email du patient qui recevra le médicament"
            />
 
            <TextField
  label="Email de votre médecin"
  name="medecinEmail"
  value={medecinEmail}
  onChange={(e) => setMedecinEmail(e.target.value)}
  type="email"
  required
  fullWidth
  margin="normal"
  helperText="Votre médecin devra valider le partage"
/>
            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Envoyer la demande
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Sidebar>
  );
}