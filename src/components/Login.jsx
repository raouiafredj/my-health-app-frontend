// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Link,
  Grid,
  Divider
} from '@mui/material';
import API_URL from '../config/api';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          motDePasse: formData.motDePasse
        })
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Enregistrer les infos utilisateur
        localStorage.setItem('userInfo', JSON.stringify(data));
        setSuccess('Connexion réussie ! Redirection...');

        // ✅ Rediriger selon le rôle
        setTimeout(() => {
          if (data.role === 'medecin') {
            navigate('/dashboard-medecin');
          } else {
            navigate('/dashboard-patient');
          }
        }, 1500);
      } else {
        setError(data.message || 'Identifiants invalides');
      }
    } catch (err) {
      setError('Problème de connexion au serveur');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 8 ,marginLeft:50}} >
      <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2, color: '#1976d2' }}>
          🔐 Se connecter
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Accédez à votre tableau de bord
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            name="email"
            label="Adresse email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            autoFocus
          />
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, py: 1.5 }}
          >
            Se connecter
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="textSecondary" paragraph>
            Vous n’avez pas de compte ?
          </Typography>
          <Link href="/register" variant="body2" sx={{ color: '#1976d2' }}>
            S’inscrire maintenant
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}