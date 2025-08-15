// src/coFponents/NotificationMenu.jsx
import { useState, useEffect } from 'react';
import { IconButton, Badge, Popover, List, ListItem, ListItemText, Typography, Divider,ListItemButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import API_URL from '../config/api';

export default function NotificationMenu() {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo?.token;

  const unreadCount = notifications.filter(n => !n.lu).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_URL}/api/patient/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error('Erreur chargement notifications:', error);
      }
    };

    if (userInfo?.role === 'patient') {
      fetchNotifications();
    }
  }, [token, userInfo?.role]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async () => {
    setAnchorEl(null);
    // Marquer comme lues
    await fetch(`${API_URL}/api/patient/notifications/lire`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
  };

  return (
    <>
      {userInfo?.role === 'patient' && (
        <IconButton
          color="inherit"
          onClick={handleClick}
          sx={{ mr: 2 }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      )}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Typography variant="h6" sx={{ p: 2, minWidth: 300 }}>
          🔔 Notifications
        </Typography>
        <Divider />
        <List sx={{ maxHeight: 400, overflow: 'auto', width: 300 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="Aucune notification" />
            </ListItem>
          ) : (
            notifications.map((n) => (
              <ListItem
                key={n._id}
                sx={{
                  backgroundColor: n.lu ? 'transparent' : '#f5f5f5',
                  '&:hover': { backgroundColor: '#f0f0f0' }
                }}
              >
                <ListItemText
                  primary={n.message}
                  secondary={format(new Date(n.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                />
              </ListItem>
            ))
          )}
        </List>
      </Popover>
    </>
  );
}