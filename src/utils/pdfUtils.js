// src/utils/pdfUtils.js
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // ✅ Pour le tableau

/**
 * Génère un PDF pour une visite médicale
 * @param {Object} visite - Objet visite contenant les données
 * @returns {jsPDF} - Document PDF prêt à être téléchargé ou envoyé
 */
export const generateVisitePDF = (visite) => {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(20);
  doc.text('Compte Rendu de Visite', 14, 20);

  // Informations générales
  doc.setFontSize(12);
  doc.text(`Date : ${new Date(visite.date).toLocaleDateString('fr-FR')}`, 14, 30);
  doc.text(`Médecin : ${visite.medecin}`, 14, 40);
  doc.text(`Spécialité : ${visite.specialite}`, 14, 50);
  doc.text(`Type : ${visite.type}`, 14, 60);
  doc.text(`Patient : ${visite.patientEmail}`, 14, 70);

  // Notes
  if (visite.notes) {
    doc.text('Notes :', 14, 80);
    doc.setFontSize(10);
    doc.text(visite.notes, 14, 85, { maxWidth: 180 });
  }

  // Ordonnance (si présente)
  if (visite.ordonnance && visite.ordonnance.medicaments?.length > 0) {
    const startY = visite.notes ? 100 : 90;
    
    doc.setFontSize(14);
    doc.text('Ordonnance', 14, startY);

    const tableData = visite.ordonnance.medicaments.map(m => [
      m.nom,
      m.posologie,
      m.duree,
      m.quantite?.toString() || '1'
    ]);

    doc.autoTable({
      head: [['Médicament', 'Posologie', 'Durée', 'Qté']],
      body: tableData,
      startY: startY + 10
    });
  }

  return doc;
};

/**
 * Génère un PDF pour une ordonnance médicale
 * @param {Object} ordonnance - Objet ordonnance
 * @returns {jsPDF} - Document PDF
 */
export const generateOrdonnancePDF = (ordonnance) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Ordonnance Médicale', 14, 20);
  doc.setFontSize(12);
  doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
  doc.text(`Médecin : ${ordonnance.medecin}`, 14, 40);
  doc.text(`Patient : ${ordonnance.patientEmail}`, 14, 50);

  const tableData = ordonnance.medicaments.map(m => [
    m.nom,
    m.posologie,
    m.duree,
    m.quantite?.toString() || '1'
  ]);

  doc.autoTable({
    head: [['Médicament', 'Posologie', 'Durée', 'Qté']],
    body: tableData,
    startY: 60
  });

  return doc;
};