// src/pages/Biometrie.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Chip
} from '@mui/material';

export default function Biometrie() {
  const [formData, setFormData] = useState({
    poids: '',
    taille: '',
    tensionSystolique: '',
    tensionDiastolique: '',
    frequenceCardiaque: '',
    glycemie: '',
    temperature: ''
  });
  const [biometrie, setBiometrie] = useState([]);
  const [success, setSuccess] = useState('');
  const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

  useEffect(() => {
    fetchBiometrie();
  }, []);

  // src/pages/Biometrie.jsx
const fetchBiometrie = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/biometrie', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Erreur API brute:', errorText);
      return;
    }

    const data = await res.json();
    setBiometrie(data);
  } catch (error) {
    console.error('Erreur chargement biométrie:', error);
  }
};
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/biometrie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          poids: formData.poids ? parseFloat(formData.poids) : undefined,
          taille: formData.taille ? parseFloat(formData.taille) : undefined,
          tensionSystolique: formData.tensionSystolique ? parseInt(formData.tensionSystolique) : undefined,
          tensionDiastolique: formData.tensionDiastolique ? parseInt(formData.tensionDiastolique) : undefined,
          frequenceCardiaque: formData.frequenceCardiaque ? parseInt(formData.frequenceCardiaque) : undefined,
          glycemie: formData.glycemie ? parseFloat(formData.glycemie) : undefined,
          temperature: formData.temperature ? parseFloat(formData.temperature) : undefined
        })
      });

      if (res.ok) {
        const data = await res.json();
        setBiometrie([data, ...biometrie]);
        setFormData({
          poids: '',
          taille: '',
          tensionSystolique: '',
          tensionDiastolique: '',
          frequenceCardiaque: '',
          glycemie: '',
          temperature: ''
        });
        setSuccess('Données biométriques enregistrées !');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        alert('Erreur lors de l’enregistrement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Problème de connexion');
    }
  };

  return (
    <Sidebar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
            📊 Mes Données Biométriques
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 5 }}>
            <Typography variant="h6" gutterBottom>Saisir mes mesures</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="poids"
                  label="Poids (kg)"
                  type="number"
                  value={formData.poids}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="taille"
                  label="Taille (cm)"
                  type="number"
                  value={formData.taille}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="temperature"
                  label="Température (°C)"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="tensionSystolique"
                  label="Tension (systolique)"
                  type="number"
                  value={formData.tensionSystolique}
                  onChange={handleChange}
                  placeholder="ex: 120"
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="tensionDiastolique"
                  label="Tension (diastolique)"
                  type="number"
                  value={formData.tensionDiastolique}
                  onChange={handleChange}
                  placeholder="ex: 80"
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="frequenceCardiaque"
                  label="Fréquence cardiaque (bpm)"
                  type="number"
                  value={formData.frequenceCardiaque}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="glycemie"
                  label="Glycémie"
                  type="number"
                  step="0.1"
                  value={formData.glycemie}
                  onChange={handleChange}
                  placeholder="ex: 5.5"
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              📥 Enregistrer
            </Button>
          </Box>

          <Typography variant="h5" gutterBottom>Historique</Typography>
          {biometrie.length === 0 ? (
            <Alert severity="info">Aucune donnée biométrique enregistrée.</Alert>
          ) : (
            <List>
              {biometrie.map((b) => (
                <div key={b._id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                          <Chip label={`${b.poids} kg`} size="small" color="primary" />
                          <Chip label={`${b.taille} cm`} size="small" color="secondary" />
                          <Chip label={`${b.tensionSystolique}/${b.tensionDiastolique} mmHg`} size="small" />
                          <Chip label={`${b.frequenceCardiaque} bpm`} size="small" />
                          <Typography variant="body2" color="textSecondary">
                            {new Date(b.date).toLocaleDateString('fr-FR')}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          {b.temperature && <div><strong>Température :</strong> {b.temperature} °C</div>}
                          {b.glycemie && <div><strong>Glycémie :</strong> {b.glycemie}</div>}
                        </>
                      }
                    />
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