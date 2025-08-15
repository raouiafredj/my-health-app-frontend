// src/pages/MesPatients.jsx
import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';



export default function MesPatients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Simuler le chargement des patients
    setPatients([
      { id: 1, prenom: 'Jean', nom: 'Dupont', age: 45, pathologie: 'Diabète' },
      { id: 2, prenom: 'Marie', nom: 'Martin', age: 32, pathologie: 'Hypertension' },
    ]);
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
          👥 Mes Patients
        </Typography>
        <List>
          {patients.map((p) => (
            <div key={p.id}>
              <ListItem>
                <ListItemText
                  primary={`${p.prenom} ${p.nom}`}
                  secondary={`Âge : ${p.age} ans • ${p.pathologie}`}
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Paper>
    </Container>
  );
}