// src/pages/MesOrdonnances.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Box,
  Alert,
  Chip
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { generateVisitePDF } from '../utils/pdfGenerator';
import API_URL from '../config/api';
import { useAuth } from '../hooks/useAuth';
export default function MesOrdonnances() {
  const [ordonnances, setOrdonnances] = useState([]);
  const navigate = useNavigate();
  //const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//  const token = userInfo?.token;
const { token, userInfo } = useAuth(); 
if (!userInfo) return null; 
  useEffect(() => {
    fetchOrdonnances();
  }, []);

  const fetchOrdonnances = async () => {
    try {
      // ✅ Récupérer TOUTES les ordonnances
      const res = await fetch(`${API_URL}/api/ordonnances`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erreur API brute:', errorText);
        return;
      }

      const data = await res.json();

      // ✅ Filtrer celles qui m'ont été envoyées
      const mesOrdonnances = data.filter(o => o.patientEmail === userInfo.email);
      console.log('Mes ordonnances:', mesOrdonnances);

      setOrdonnances(mesOrdonnances);
    } catch (error) {
      console.error('Erreur chargement ordonnances:', error);
    }
  };

  const generatePDF = (ordonnance) => {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.text('Ordonnance Médicale', 14, 20);
      doc.setFontSize(12);
      doc.text(`Date : ${new Date(ordonnance.date).toLocaleDateString('fr-FR')}`, 14, 30);
      doc.text(`Docteur : ${ordonnance.medecin}`, 14, 40);

      const tableData = ordonnance.medicaments.map(m => [
        m.nom || 'Inconnu',
        m.posologie || 'Non spécifiée',
        m.duree || 'Non spécifiée',
        m.quantite?.toString() || '1'
      ]);

      doc.autoTable({
        head: [['Médicament', 'Posologie', 'Durée', 'Qté']],
        body: tableData,
        startY: 50
      });

      doc.save(`ordonnance-${ordonnance._id}.pdf`);
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert('Impossible de générer le PDF');
    }
  };

  const handleDownloadPDF = (visite) => {
  const doc = generateVisitePDF(visite);
  doc.save(`visite-${visite._id}.pdf`);
};
  return (
    <Sidebar>
      <Container maxWidth="lg" >
        <Paper sx={{ p: 4, mt: 4 ,width:800}}>
          <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32' }}>
            📄 Mes Ordonnances
          </Typography>

          {ordonnances.length === 0 ? (
            <Alert severity="info">
              Aucune ordonnance reçue. Vos ordonnances apparaîtront ici après une consultation.
            </Alert>
          ) : (
            <List>
              {ordonnances.map((o) => (
                <div key={o._id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" component="span">
                            Ordonnance
                          </Typography>
                          <Chip
                            label={o.medecin}
                            size="small"
                            color="primary"
                            sx={{ fontSize: '0.8rem' }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <div>
                            <strong>Médicaments :</strong> {o.medicaments.length}
                          </div>
                          <div>
                            <strong>Date :</strong> {new Date(o.date).toLocaleDateString('fr-FR')}
                          </div>
                          <Box mt={1}>
                            <Button
                              startIcon={<PictureAsPdfIcon />}
                              onClick={() => generatePDF(o)}
                              size="small"
                              variant="outlined"
                              color="primary"
                            >
                              Télécharger
                            </Button>
                          </Box>
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