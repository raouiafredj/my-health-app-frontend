// src/pages/Accueil.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Chip,
  Stack,
  Divider,
  useScrollTrigger,
  Fade
} from '@mui/material';

export default function Accueil() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const [loaded, setLoaded] = useState(false);

  // ✅ Redirection si utilisateur connecté
  useEffect(() => {
    if (userInfo?.role === 'medecin') {
      navigate('/visites', { replace: true });
    } else if (userInfo?.role === 'patient') {
      navigate('/mes-visites', { replace: true });
    } else {
      // ✅ Déclencher l'animation après un court délai
      const timer = setTimeout(() => setLoaded(true), 100);
      return () => clearTimeout(timer);
    }
  }, [navigate, userInfo]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f8fa',
        backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        pt: 8,
        pb: 8,
        marginLeft: 5,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(25, 30, 50, 0.75)', // ✅ Overlay foncé pour lisibilité
          zIndex: 1
        }
      }}
    >
      {/* Contenu par-dessus le fond */}
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Container maxWidth="lg">
          {/* En-tête animé */}
          <Fade in={loaded} timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                p: 6,
                borderRadius: 3,
                textAlign: 'center',
                bgcolor: 'transparent',
                color: 'white',
                mb: 6,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(25, 118, 210, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                🏥 MaSanté
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9, mb: 4 }}>
                Votre santé, simplifiée. Connectée. Sécure.
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ px: 4, py: 1.5, fontSize: '1.1rem', bgcolor: '#1976d2' }}
                >
                  Se connecter
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ px: 4, py: 1.5, fontSize: '1.1rem', color: 'white', borderColor: 'white' }}
                >
                  S’inscrire
                </Button>
              </Stack>
            </Paper>
          </Fade>

          {/* Fonctionnalités */}
          <Fade in={loaded} timeout={1500}>
            <Grid container spacing={4}>
              {[
                {
                  titre: 'Visites & Comptes Rendus',
                  desc: 'Créez, stockez et partagez vos visites médicales avec vos patients.',
                  icone: '🩺'
                },
                {
                  titre: 'Ordonnances Numériques',
                  desc: 'Générez et envoyez des ordonnances en PDF directement.',
                  icone: '📄'
                },
                {
                  titre: 'Biométrie & Suivi',
                  desc: 'Suivez poids, tension, glycémie et autres paramètres vitals.',
                  icone: '📈'
                },
                {
                  titre: 'Calendrier & Rappels',
                  desc: 'Planifiez vos consultations et recevez des rappels automatiques.',
                  icone: '📅'
                },
                {
                  titre: 'Partage Sécurisé',
                  desc: 'Partagez des médicaments ou documents avec validation médicale.',
                  icone: '🔐'
                },
                {
                  titre: 'Historique Médical',
                  desc: 'Accédez à un historique complet de toutes les données médicales.',
                  icone: '📚'
                }
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Fade in={loaded} timeout={{ enter: 1000 + index * 150 }}>
                    <Paper
                      elevation={4}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        height: '100%',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: 8,
                          borderColor: '#1976d2'
                        },
                        border: '1px solid rgba(25, 118, 210, 0.2)',
                        bgcolor: 'rgba(255, 255, 255, 0.95)'
                      }}
                    >
                      <Typography variant="h4" gutterBottom textAlign="center" color="#1976d2">
                        {item.icone}
                      </Typography>
                      <Typography variant="h6" gutterBottom fontWeight="bold" textAlign="center" color="text.primary">
                        {item.titre}
                      </Typography>
                      <Typography color="textSecondary" textAlign="center">
                        {item.desc}
                      </Typography>
                    </Paper>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Fade>

          {/* Section médecin / patient */}
          <Fade in={loaded} timeout={2000}>
            <Box sx={{ mt: 8, textAlign: 'center' }}>
              <Divider sx={{ mb: 4, borderColor: 'white', opacity: 0.3 }} />
              <Typography variant="h4" gutterBottom fontWeight="bold" color="white" marginRight={10}>
                Pour qui est MaSanté ?
              </Typography>
              <Grid container spacing={4} sx={{ mt: 2 }} marginLeft={10}>
                <Grid item xs={12} md={6} >
                  <Chip label="Médecin" color="primary" size="large" sx={{ mb: 2 }} />
                  <Typography variant="h6" color="white">
                    Gérez vos patients, visites et ordonnances.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} >
                  <Chip label="Patient" color="success" size="large" sx={{ mb: 2 }} />
                  <Typography variant="h6" color="white">
                    Suivez votre santé, accédez à vos documents.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Fade>

          {/* Call to action */}
          <Fade in={loaded} timeout={2200}>
            <Box sx={{ mt: 8, textAlign: 'center',marginRight: 5 }}>
              <Typography variant="h5" gutterBottom color="white" >
                Prêt à commencer ?
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/register')}
                sx={{ mt: 2, px: 5 }}
              >
                Créer un compte
              </Button>
            </Box>
          </Fade>

          {/* Footer */}
          <Fade in={loaded} timeout={2400}>
            <Box sx={{ mt: 8, textAlign: 'center', color: 'white', opacity: 0.7 ,marginRight: 5}}>
              <Typography variant="body2">
                © 2025 MaSanté. Tous droits réservés.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
}