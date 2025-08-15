// src/pages/MesVisitesPatient.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Alert,
  Button,
  IconButton
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import API_URL from '../config/api';

export default function MesVisitesPatient() {
  const [visites, setVisites] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo?.token;

  useEffect(() => {
    fetchVisites();
  }, []);

  const fetchVisites = async () => {
    try {
      const res = await fetch(`${API_URL}/api/patient/visites`, {
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

  // Générer un PDF de visite
  const generatePDF = (visite) => {
    try {
      // ✅ Utilisation de jsPDF via CDN
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.text('Compte Rendu de Visite', 14, 20);
      doc.setFontSize(12);
      doc.text(`Date : ${new Date(visite.date).toLocaleDateString('fr-FR')}`, 14, 30);
      doc.text(`Médecin : ${visite.medecin}`, 14, 40);
      doc.text(`Spécialité : ${visite.specialite || 'Non spécifiée'}`, 14, 50);
      doc.text(`Type : ${visite.type}`, 14, 60);
      doc.text(`Patient : ${visite.patientEmail}`, 14, 70);

// ✅ Avant de faire .map(), vérifiez que medicaments existe
if (visite.ordonnance && Array.isArray(visite.ordonnance.medicaments) && visite.ordonnance.medicaments.length > 0) {
  doc.setFontSize(14);
  doc.text('Ordonnance', 14, 100);

  const tableData = visite.ordonnance.medicaments.map(m => [
    m.nom || 'Inconnu',
    m.posologie || '',
    m.duree || '',
    m.quantite?.toString() || '1'
  ]);

  doc.autoTable({
    head: [['Médicament', 'Posologie', 'Durée', 'Qté']],
    body: tableData,
    startY: 110
  });
}
      if (visite.notes) {
        doc.text('Notes :', 14, 80);
        doc.setFontSize(10);
        doc.text(visite.notes, 14, 85, { maxWidth: 180 });
      }

      // Ajouter ordonnance si présente
      if (visite.ordonnance) {
        doc.setFontSize(14);
        doc.text('Ordonnance', 14, 100);
        const tableData = visite.ordonnance.medicaments.map(m => [
          m.nom,
          m.posologie,
          m.duree,
          m.quantite?.toString() || '1'
        ]);
        // ✅ autoTable est disponible via le plugin chargé dans le CDN
        doc.autoTable({
          head: [['Médicament', 'Posologie', 'Durée', 'Qté']],
          body: tableData,
          startY: 110
        });
      }

      doc.save(`visite-${visite._id}.pdf`);
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert('Impossible de générer le PDF');
    }
  };

  return (
    <Sidebar>
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32' }}>
            📥 Mes Visites (Patient)
          </Typography>

          {visites.length === 0 ? (
            <Alert severity="info">
              Aucune visite reçue. Vos visites apparaîtront ici après une consultation.
            </Alert>
          ) : (
            <List>
              {visites.map(v => (
                <div key={v._id}>
                  <ListItem>
                    <ListItemText
                      primary={`${v.medecin} • ${new Date(v.date).toLocaleDateString('fr-FR')}`}
                      secondary={
                        <>
                          <div><strong>Spécialité :</strong> {v.specialite}</div>
                          <div><strong>Type :</strong> {v.type}</div>
                          {v.notes && <div><strong>Notes :</strong> {v.notes}</div>}
                          
                        </>
                      }
                    />
                    <IconButton onClick={() => generatePDF(v)}>
                      <PictureAsPdfIcon color="primary" />
                    </IconButton>
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