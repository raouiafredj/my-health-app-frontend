// src/pages/HistoriqueMedical.jsx
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
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
  Alert,
  Button,
  Box
} from '@mui/material';

import API_URL from '../config/api';
export default function HistoriqueMedical() {
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
      const data = await res.json();
      setVisites(data);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
  };

  // ✅ Générer un PDF pour UNE visite
const generateSingleVisitPDF = (visite) => {
  const doc = new jsPDF();

  // ✅ Vérification critique
  if (typeof doc.autoTable === 'undefined') {
    console.error('❌ Erreur : jspdf-autotable n’est pas chargé');
    alert('Erreur : impossible de générer le PDF. Rechargez la page.');
    return;
  }

  // ✅ Maintenant, autoTable est sûr à utiliser
  doc.setFontSize(20);
  doc.text('Compte Rendu de Visite', 14, 20);

  const patientNom = `${userInfo.prenom} ${userInfo.nom}`;
  doc.setFontSize(12);
  doc.text(`Patient : ${patientNom}`, 14, 30);
  doc.text(`Email : ${userInfo.email}`, 14, 40);
  doc.text(`Date d'export : ${new Date().toLocaleDateString('fr-FR')}`, 14, 50);
  doc.line(14, 55, 200, 55);

  let y = 60;

  doc.setFontSize(14);
  doc.text(`${visite.medecin}`, 14, y);
  y += 10;

  doc.setFontSize(10);
  doc.text(`Date : ${new Date(visite.date).toLocaleDateString('fr-FR')}`, 14, y);
  y += 8;
  doc.text(`Spécialité : ${visite.specialite}`, 14, y);
  y += 8;

  if (visite.notes) {
    doc.text(`Notes : ${visite.notes}`, 14, y);
    y += 8;
  }

  if (visite.ordonnance?.medicaments?.length > 0) {
    doc.setFontSize(12);
    doc.text('Ordonnance :', 14, y);
    y += 10;

    const tableData = visite.ordonnance.medicaments.map(m => [
      m.nom,
      m.posologie || '',
      m.duree || '',
      m.quantite?.toString() || '1'
    ]);

    // ✅ Maintenant, cela fonctionnera
    doc.autoTable({
      head: [['Médicament', 'Posologie', 'Durée', 'Qté']],
      body: tableData,
      startY: y,
      theme: 'striped',
      styles: { fontSize: 9 }
    });

    y = doc.lastAutoTable.finalY + 10;
  }

  const date = new Date(visite.date).toLocaleDateString('fr-FR').replace(/\//g, '-');
  doc.save(`visite-${visite.medecin.replace(/\s+/g, '-')}-${date}.pdf`);
};

  // ✅ Générer PDF de l'historique complet
  const generateFullPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Historique Médical Complet', 14, 20);

    const patientNom = `${userInfo.prenom} ${userInfo.nom}`;
    doc.setFontSize(12);
    doc.text(`Patient : ${patientNom}`, 14, 30);
    doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 14, 40);
    doc.line(14, 45, 200, 45);

    let y = 50;
    visites.forEach(v => {
      doc.setFontSize(14);
      doc.text(`${v.medecin}`, 14, y);
      y += 10;
      doc.setFontSize(10);
      doc.text(`Date : ${new Date(v.date).toLocaleDateString('fr-FR')}`, 14, y);
      y += 8;
      doc.text(`Spécialité : ${v.specialite}`, 14, y);
      y += 8;

      if (v.notes) {
        doc.text(`Notes : ${v.notes}`, 14, y);
        y += 8;
      }

      if (v.ordonnance?.medicaments?.length > 0) {
        doc.setFontSize(12);
        doc.text('Ordonnance :', 14, y);
        y += 10;

        const tableData = v.ordonnance.medicaments.map(m => [
          m.nom,
          m.posologie,
          m.duree,
          m.quantite?.toString() || '1'
        ]);

        doc.autoTable({
          body: tableData,
          startY: y,
          theme: 'striped',
          styles: { fontSize: 9 },
          head: [['Médicament', 'Posologie', 'Durée', 'Qté']]
        });

        y = doc.lastAutoTable.finalY + 10;
      } else {
        y += 10;
      }

      if (y > 250) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`historique-medical-${userInfo.prenom}.pdf`);
  };

  return (
    <Sidebar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
            📚 Historique Médical
          </Typography>

         

          {visites.length === 0 ? (
            <Alert severity="info">Aucune donnée médicale disponible.</Alert>
          ) : (
            <List>
              {visites.map((v, index) => (
                <div key={index}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="h6" component="span">
                          {v.medecin}
                        </Typography>
                      }
                      secondary={
                        <>
                          <div><strong>Date :</strong> {new Date(v.date).toLocaleDateString('fr-FR')}</div>
                          <div><strong>Spécialité :</strong> {v.specialite}</div>
                          {v.notes && <div><strong>Notes :</strong> {v.notes}</div>}
                          {v.ordonnance?.medicaments?.length > 0 && (
                            <div>
                              <strong>Ordonnance :</strong>
                              <ul>
                                {v.ordonnance.medicaments.map((m, i) => (
                                  <li key={i}>
                                    {m.nom} - {m.posologie} ({m.duree}) - {m.quantite} unités
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      }
                    />
                    <Box>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => generateSingleVisitPDF(v)}
                      >
                        📄 Télécharger
                      </Button>
                    </Box>
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