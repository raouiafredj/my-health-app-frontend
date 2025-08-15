// src/pages/Vaccins.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Button,
  Box
} from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import API_URL from '../config/api';
import { useAuth } from '../hooks/useAuth';

export default function Vaccins() {
  const [vaccins, setVaccins] = useState([]);
  //const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  //const token = userInfo?.token;
const { token, userInfo } = useAuth(); 
if (!userInfo) return null; 
  useEffect(() => {
    fetchVaccins();
  }, []);

  const fetchVaccins = async () => {
    try {
      const res = await fetch(`${API_URL}/api/patient/vaccins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setVaccins(data);
    } catch (error) {
      console.error('Erreur chargement vaccins:', error);
    }
  };

  // ✅ Fonction pour générer un PDF pour UN vaccin
  const handleDownloadSinglePDF = (vaccin) => {
    const doc = new jsPDF();

    // En-tête
    doc.setFontSize(20);
    doc.text('Certificat de Vaccination', 14, 20);
    doc.setFontSize(12);
    doc.text(`Patient : ${userInfo.prenom} ${userInfo.nom}`, 14, 30);
    doc.text(`Email : ${userInfo.email}`, 14, 40);
    doc.text(`Date d'export : ${new Date().toLocaleDateString('fr-FR')}`, 14, 50);
    doc.line(14, 55, 200, 55);

    // Détails du vaccin
    let y = 60;
    doc.setFontSize(16);
    doc.text(`${vaccin.vaccin}`, 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Date d'administration : ${new Date(vaccin.dateAdministration).toLocaleDateString('fr-FR')}`, 14, y);
    y += 8;
    doc.text(`Prochaine dose : ${new Date(vaccin.prochaineDose).toLocaleDateString('fr-FR')}`, 14, y);
    y += 8;
    doc.text(`Médecin : ${vaccin.medecin}`, 14, y);
    y += 12;

    if (vaccin.note) {
      doc.setFontSize(11);
      doc.text('Note :', 14, y);
      y += 6;
      doc.text(vaccin.note, 14, y, { maxWidth: 180 });
      y += 10;
    }

    // Footer
    doc.setFontSize(10);
    doc.text('Document officiel - Système MaSanté', 14, doc.internal.pageSize.height - 20);
    doc.text('Signature numérique: valide', 140, doc.internal.pageSize.height - 20);

    // Générer et télécharger
    doc.save(`certificat-${vaccin.vaccin}-${new Date(vaccin.dateAdministration).toLocaleDateString('fr-FR')}.pdf`);
  };

  // ✅ Fonction pour générer l'historique complet
  const handleDownloadFullPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Historique Vaccinal Complet', 14, 20);
    doc.setFontSize(12);
    doc.text(`Patient : ${userInfo.prenom} ${userInfo.nom}`, 14, 30);
    doc.text(`Email : ${userInfo.email}`, 14, 40);
    doc.text(`Date d'export : ${new Date().toLocaleDateString('fr-FR')}`, 14, 50);
    doc.line(14, 55, 200, 55);

    let y = 60;

    if (vaccins.length === 0) {
      doc.setFontSize(14);
      doc.text('Aucun vaccin enregistré.', 14, y);
    } else {
      const tableData = vaccins.map(v => [
        v.vaccin,
        new Date(v.dateAdministration).toLocaleDateString('fr-FR'),
        new Date(v.prochaineDose).toLocaleDateString('fr-FR'),
        v.medecin,
        v.note || '–'
      ]);

      doc.autoTable({
        head: [['Vaccin', 'Date', 'Prochaine dose', 'Médecin', 'Note']],
        body: tableData,
        startY: y,
        theme: 'striped',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [25, 118, 210] }
      });

      y = doc.lastAutoTable.finalY + 10;
    }

    doc.save(`historique-vaccinal-${userInfo.prenom}.pdf`);
  };

  return (
    <Sidebar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 , width:700}}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
            🛡️ Vaccinations
          </Typography>

          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Historique de vos vaccinations et rappels à venir.
          </Typography>

          {/* ✅ Bouton pour télécharger l'historique complet */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            
          </Box>

          {vaccins.length === 0 ? (
            <Alert severity="info">Aucun vaccin enregistré.</Alert>
          ) : (
            <List>
              {vaccins.map((v) => (
                <div key={v._id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="h6" component="span">
                          {v.vaccin}
                        </Typography>
                      }
                      secondary={
                        <>
                          <div><strong>Date :</strong> {new Date(v.dateAdministration).toLocaleDateString('fr-FR')}</div>
                          <div><strong>Prochaine dose :</strong> {new Date(v.prochaineDose).toLocaleDateString('fr-FR')}</div>
                          {v.note && <div><strong>Note :</strong> {v.note}</div>}
                          <div><strong>Médecin :</strong> {v.medecin}</div>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => handleDownloadSinglePDF(v)}
                      >
                        📄 Télécharger certificat
                      </Button>
                    </ListItemSecondaryAction>
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