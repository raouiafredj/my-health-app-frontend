// src/components/OrdonnanceForm.jsx
import { useState } from 'react';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import API_URL from '../config/api';
import { useAuth } from '../hooks/useAuth';

export default function OrdonnanceForm({ visiteId, onSuccess }) {
  const [medicaments, setMedicaments] = useState([{ nom: '', posologie: '', duree: '', quantite: 1 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
//  const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
const { token, userInfo } = useAuth(); 
if (!userInfo) return null; 
  const handleChange = (index, e) => {
    const newMedicaments = [...medicaments];
    newMedicaments[index][e.target.name] = e.target.value;
    setMedicaments(newMedicaments);
  };

  const addMedicament = () => {
    setMedicaments([...medicaments, { nom: '', posologie: '', duree: '', quantite: 1 }]);
  };

  const removeMedicament = (index) => {
    setMedicaments(medicaments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const medicamentsValides = medicaments.filter(m => m.nom.trim() !== '');

    if (medicamentsValides.length === 0) {
      setError('Ajoutez au moins un médicament avec un nom.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/medecin/visites/${visiteId}/ordonnance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ medicaments: medicamentsValides })
      });

      if (res.ok) {
        onSuccess();
      } else {
        const error = await res.json();
        setError('Erreur: ' + error.message);
      }
    } catch (err) {
      setError('Problème de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>Ajouter une ordonnance</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {medicaments.map((medicament, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <TextField
            name="nom"
            label="Nom"
            value={medicament.nom}
            onChange={(e) => handleChange(index, e)}
            required
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <TextField
            name="posologie"
            label="Posologie"
            value={medicament.posologie}
            onChange={(e) => handleChange(index, e)}
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <TextField
            name="duree"
            label="Durée"
            value={medicament.duree}
            onChange={(e) => handleChange(index, e)}
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <TextField
            name="quantite"
            label="Qté"
            type="number"
            value={medicament.quantite}
            onChange={(e) => handleChange(index, e)}
            size="small"
            sx={{ width: 80 }}
          />
          <Button
            type="button"
            onClick={() => removeMedicament(index)}
            color="error"
            size="small"
          >
            ×
          </Button>
        </Box>
      ))}

      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Button type="button" onClick={addMedicament} size="small">
          ➕ Ajouter médicament
        </Button>
        <Button type="submit" variant="contained" size="small" disabled={loading}>
          {loading ? 'Envoi...' : 'Envoyer'}
        </Button>
      </Box>
    </Box>
  );
}