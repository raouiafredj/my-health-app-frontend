// src/components/NotificationMenu.jsx
import { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ListItemButton // ✅ Importez ListItemButton
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import API_URL from '../config/api';

export default function NotificationMenu() {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const open = Boolean(anchorEl);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo?.token;

  // ✅ Compte les notifications non lues
  const unreadCount = notifications.filter((n) => !n.lu).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_URL}/api/patient/emails`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error('Erreur chargement emails:', error);
      }
    };

    if (userInfo?.role === 'patient') {
      fetchNotifications();
    }
  }, [token, userInfo?.role]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setOpenEmailDialog(true);
    handleClose();

    // ✅ Marquer comme lu côté frontend
    setNotifications((prev) =>
      prev.map((n) => (n._id === email._id ? { ...n, lu: true } : n))
    );
  };

  const closeEmailDialog = () => {
    setOpenEmailDialog(false);
    setSelectedEmail(null);
  };

  return (
    <>
      {/* Icône de notification */}
      {userInfo?.role === 'patient' && (
        <IconButton color="inherit" onClick={handleClick} sx={{ mr: 2 }}>
          <Badge badgeContent={unreadCount} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
      )}

      {/* Popover avec la liste des emails */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Typography variant="h6" sx={{ p: 2, minWidth: 300 }}>
          📬 Vos Messages
        </Typography>
        <Divider />
        <List sx={{ maxHeight: 400, overflow: 'auto', width: 300 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="Aucun message" />
            </ListItem>
          ) : (
            notifications.map((email) => (
              <ListItem key={email._id} disablePadding>
                <ListItemButton
                  onClick={() => handleEmailClick(email)}
                  sx={{
                    backgroundColor: email.lu ? 'transparent' : '#f0f8ff',
                    '&:hover': { backgroundColor: '#f0f0f0' },
                    py: 1.5
                  }}
                >
                  <ListItemText
                    primary={email.sujet}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="primary">
                          {email.expediteur}
                        </Typography>
                        <br />
                        {new Date(email.dateEnvoi).toLocaleDateString('fr-FR')} à{' '}
                        {new Date(email.dateEnvoi).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </Popover>

      {/* Modale de lecture */}
      <Dialog open={openEmailDialog} onClose={closeEmailDialog} maxWidth="md" fullWidth>
        {selectedEmail && (
          <>
            <DialogTitle>
              {selectedEmail.sujet}
              <Typography variant="body2" color="textSecondary">
                De : {selectedEmail.expediteur} •{' '}
                {new Date(selectedEmail.dateEnvoi).toLocaleDateString('fr-FR')} à{' '}
                {new Date(selectedEmail.dateEnvoi).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  p: 3,
                  bgcolor: '#f9f9f9',
                  borderRadius: 2,
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.8
                }}
              >
                {selectedEmail.message}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeEmailDialog} color="primary">
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}