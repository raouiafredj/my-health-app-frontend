// src/pages/VaccinsMedecin.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Container, Paper, Typography, TextField, Button, Box, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function VaccinsMedecin() {
  const [formData, setFormData] = useState({
    patientEmail: '',
    vaccin: 'DTaP',
    dateAdministration: '',
    prochaineDose: '',
    note: ''
  });
  const [success, setSuccess] = useState('');
  const [patients, setPatients] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo?.token;

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users?role=patient', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPatients(data);
    } catch (error) {
      console.error('Erreur chargement patients:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/medecin/vaccins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess('Vaccin ajouté et rappel envoyé !');
        setFormData({
          patientEmail: '',
          vaccin: 'DTaP',
          dateAdministration: '',
          prochaineDose: '',
          note: ''
        });
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
            🩺 Gestion des Vaccins
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Patient</InputLabel>
              <Select
                name="patientEmail"
                value={formData.patientEmail}
                onChange={handleChange}
                label="Patient"
              >
                {patients.map(p => (
                  <MenuItem key={p._id} value={p.email}>
                    {p.prenom} {p.nom} ({p.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Vaccin</InputLabel>
              <Select
                name="vaccin"
                value={formData.vaccin}
                onChange={handleChange}
                label="Vaccin"
              >
                <MenuItem value="BCG">BCG</MenuItem>
                <MenuItem value="Hépatite B">Hépatite B</MenuItem>
                <MenuItem value="DTaP">DTaP</MenuItem>
                <MenuItem value="Polio">Polio</MenuItem>
                <MenuItem value="ROR">ROR</MenuItem>
                <MenuItem value="Pneumocoque">Pneumocoque</MenuItem>
                <MenuItem value="Grippe">Grippe</MenuItem>
                <MenuItem value="Tétanos">Tétanos</MenuItem>
                <MenuItem value="HPV">HPV</MenuItem>
                <MenuItem value="Varicelle">Varicelle</MenuItem>
                <MenuItem value="Autre">Autre</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="dateAdministration"
              label="Date d'administration"
              type="date"
              value={formData.dateAdministration}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="prochaineDose"
              label="Prochaine dose"
              type="date"
              value={formData.prochaineDose}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="note"
              label="Note"
              multiline
              rows={3}
              value={formData.note}
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
              ✅ Ajouter et Rappeler
            </Button>
          </form>
        </Paper>
      </Container>
    </Sidebar>
  );
}