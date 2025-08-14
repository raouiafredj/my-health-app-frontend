// src/pages/EmailsMedecin.jsx
import Sidebar from '../components/Sidebar';
import EnvoyerEmail from '../components/EnvoyerEmail';

export default function EmailsMedecin() {
  return (
    <Sidebar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
          📬 Envoyer un Email
        </Typography>
        <EnvoyerEmail />
      </Container>
    </Sidebar>
  );
}