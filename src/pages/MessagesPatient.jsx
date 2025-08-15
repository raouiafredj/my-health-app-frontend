// src/pages/MessagesPatient.jsx
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
  Box
} from '@mui/material';
import API_URL from '../config/api';
import { useAuth } from '../hooks/useAuth';

export default function MessagesPatient() {
  const [emails, setEmails] = useState([]);
//  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  //const token = userInfo?.token;
  const { token, userInfo } = useAuth(); 
if (!userInfo) return null; 

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const res = await fetch(`${API_URL}/api/patient/emails`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEmails(data);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    }
  };

  return (
    <Sidebar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
            📬 Messages de votre médecin
          </Typography>

          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Consultez les messages envoyés par votre médecin.
          </Typography>

          {emails.length === 0 ? (
            <Alert severity="info">Aucun message reçu.</Alert>
          ) : (
            <List>
              {emails.map((email, index) => (
                <div key={index}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="h6" component="span">
                          {email.sujet}
                        </Typography>
                      }
                      secondary={
                        <>
                          <div><strong>De :</strong> {email.expediteur}</div>
                          <div><strong>Date :</strong> {new Date(email.dateEnvoi).toLocaleDateString('fr-FR')} à {new Date(email.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                          <div style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
                            {email.message}
                          </div>
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