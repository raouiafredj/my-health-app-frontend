// src/components/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Link,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import API_URL from '../config/api';

export default function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    role: 'patient',
    specialite: '' // Optionnel par défaut
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // ✅ Réinitialiser la spécialité si le rôle change
    if (name === 'role' && value === 'patient') {
      setFormData(prev => ({ ...prev, specialite: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // ✅ Validation côté frontend
    if (formData.role === 'medecin' && !formData.specialite) {
      setError('La spécialité est obligatoire pour les médecins.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          motDePasse: formData.motDePasse,
          role: formData.role,
          specialite: formData.role === 'medecin' ? formData.specialite : undefined
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Erreur lors de l’inscription');
      }
    } catch (err) {
      setError('Problème de connexion au serveur');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 8 ,marginLeft:50 }}>
      <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2, color: '#1976d2' }}>
          🏥 Créer un compte
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Inscrivez-vous comme patient ou médecin
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="prenom"
                label="Prénom"
                value={formData.prenom}
                onChange={handleChange}
                required
                fullWidth
                autoFocus
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="nom"
                label="Nom"
                value={formData.nom}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Adresse email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="motDePasse"
                label="Mot de passe"
                type="password"
                value={formData.motDePasse}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
              />
            </Grid>

            {/* Rôle */}
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Rôle</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Rôle"
                >
                  <MenuItem value="patient">Patient</MenuItem>
                  <MenuItem value="medecin">Médecin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Spécialité (uniquement si médecin) */}
            {formData.role === 'medecin' && (
              <Grid item xs={12}>
                <TextField
                  name="specialite"
                  label="Spécialité"
                  value={formData.specialite}
                  onChange={handleChange}
                  required
                  fullWidth
                  margin="normal"
                  helperText="Ex: Cardiologue, Dentiste, Généraliste"
                />
              </Grid>
            )}
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, py: 1.5 }}
          >
            S'inscrire
          </Button>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" variant="body2" sx={{ color: '#1976d2' }}>
                Se connecter
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}