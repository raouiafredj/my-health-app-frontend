// src/pages/CalendrierComplet.jsx
import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Sidebar from '../components/Sidebar';
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,
  Avatar,
  IconButton,
  CircularProgress
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import EventIcon from '@mui/icons-material/Event';
import DeleteIcon from '@mui/icons-material/Delete';
import API_URL from '../config/api';

import { useAuth } from '../hooks/useAuth';

// ✅ Initialiser le localizer
const localizer = momentLocalizer(moment);

export default function CalendrierComplet() {
  const [events, setEvents] = useState([]);
  const [calendrierEvents, setCalendrierEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    type: 'visite',
    date: '',
    description: '',
    priorite: 'moyenne'
  });

//  const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
const { token, userInfo } = useAuth(); 
 if (!userInfo) return null;
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/evenements`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);

      const data = await res.json();

      // ✅ Formater pour la liste Material UI
      setEvents(data);

      // ✅ Formater pour react-big-calendar
      const formatted = data.map(event => ({
        title: `${event.titre} (${event.type})`,
        start: new Date(event.date),
        end: new Date(event.date),
        type: event.type,
        detail: event.description,
        id: event._id
      }));
      setCalendrierEvents(formatted);
    } catch (err) {
      console.error('Erreur chargement événements:', err);
      setError('Impossible de charger le calendrier. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/evenements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const newEvent = await res.json();
        setEvents([newEvent, ...events]);
        setCalendrierEvents(prev => [
          {
            title: `${newEvent.titre} (${newEvent.type})`,
            start: new Date(newEvent.date),
            end: new Date(newEvent.date),
            type: newEvent.type,
            id: newEvent._id
          },
          ...prev
        ]);
        setFormData({
          titre: '',
          type: 'visite',
          date: '',
          description: '',
          priorite: 'moyenne'
        });
        setOpenDialog(false);
      } else {
        alert('Erreur lors de l’ajout');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet événement ?')) return;
    try {
      await fetch(`${API_URL}/api/evenements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(events.filter(e => e._id !== id));
      setCalendrierEvents(calendrierEvents.filter(e => e.id !== id));
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'alerte': return <WarningIcon color="error" />;
      case 'rappel': return <NotificationsIcon color="primary" />;
      default: return <EventIcon color="primary" />;
    }
  };

  const getColor = (priorite) => {
    return priorite === 'haute' ? 'error' : priorite === 'moyenne' ? 'warning' : 'default';
  };

  const eventStyleGetter = (event) => {
    let backgroundColor;
    switch (event.type) {
      case 'visite': backgroundColor = '#1976d2'; break;
      case 'rappel': backgroundColor = '#ed6c02'; break;
      case 'alerte': backgroundColor = '#d32f2f'; break;
      case 'ordonnance': backgroundColor = '#2e7d32'; break;
      case 'biometrie': backgroundColor = '#7b1fa2'; break;
      default: backgroundColor = '#1976d2';
    }
    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        color: 'white'
      }
    };
  };

  if (loading) {
    return (
      <Sidebar>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
          <CircularProgress />
          <Typography variant="h6">Chargement du calendrier...</Typography>
        </Container>
      </Sidebar>
    );
  }

  if (error) {
    return (
      <Sidebar>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
            📅 Calendrier Complet
          </Typography>

          {/* ✅ Bouton Ajouter */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<EventIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ mb: 4 }}
          >
            Ajouter un événement
          </Button>

          {/* ✅ Calendrier Visuel */}
          <Box sx={{ height: '500px', mb: 6 }}>
            <Calendar
              localizer={localizer}
              events={calendrierEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              views={['month', 'week', 'day']}
              step={30}
              timeslots={2}
              messages={{
                next: 'Suivant',
                previous: 'Précédent',
                today: 'Aujourd’hui',
                month: 'Mois',
                week: 'Semaine',
                day: 'Jour',
                agenda: 'Agenda',
                noEventsInRange: 'Aucun événement à afficher'
              }}
              eventPropGetter={eventStyleGetter}
              showMultiDayTimes
            />
          </Box>

          {/* Légende */}
          <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {[
              { label: 'Visite', color: '#1976d2' },
              { label: 'Rappel', color: '#ed6c02' },
              { label: 'Alerte', color: '#d32f2f' },
              { label: 'Ordonnance', color: '#2e7d32' },
              { label: 'Biométrie', color: '#7b1fa2' }
            ].map((item) => (
              <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: item.color }} />
                <Typography variant="body2" color="textSecondary">{item.label}</Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* ✅ Liste des Événements */}
          <Typography variant="h5" gutterBottom>Notifications & Alertes</Typography>

          {events.length === 0 ? (
            <Alert severity="info">Aucun événement planifié.</Alert>
          ) : (
            <List>
              {events.map((e) => (
                <div key={e._id}>
                  <ListItem>
                    <Avatar sx={{ bgcolor: getColor(e.priorite), mr: 2 }}>
                      {getIcon(e.type)}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Typography variant="h6" component="span">{e.titre}</Typography>
                          {e.priorite === 'haute' && <Badge color="error" badgeContent="!" />}
                        </Box>
                      }
                      secondary={
                        <>
                          <div>
                            <strong>Date :</strong> {new Date(e.date).toLocaleDateString('fr-FR')} à {new Date(e.date).toLocaleTimeString('fr-FR')}
                          </div>
                          {e.description && <div><strong>Description :</strong> {e.description}</div>}
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
  <IconButton edge="end" onClick={() => handleDelete(e._id)}>
    <DeleteIcon color="error" />
  </IconButton>
</ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
          )}
        </Paper>

        {/* ✅ Dialog Ajouter */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Ajouter un événement</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                name="titre"
                label="Titre"
                value={formData.titre}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select name="type" value={formData.type} onChange={handleChange} label="Type">
                  <MenuItem value="visite">Visite</MenuItem>
                  <MenuItem value="rappel">Rappel</MenuItem>
                  <MenuItem value="alerte">Alerte</MenuItem>
                  <MenuItem value="ordonnance">Ordonnance</MenuItem>
                  <MenuItem value="biometrie">Biométrie</MenuItem>
                </Select>
              </FormControl>
              <TextField
                name="date"
                label="Date et heure"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="description"
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Priorité</InputLabel>
                <Select name="priorite" value={formData.priorite} onChange={handleChange} label="Priorité">
                  <MenuItem value="faible">Faible</MenuItem>
                  <MenuItem value="moyenne">Moyenne</MenuItem>
                  <MenuItem value="haute">Haute</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
              <Button type="submit" variant="contained" color="primary">
                Ajouter
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Sidebar>
  );
}