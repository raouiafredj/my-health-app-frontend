// src/components/NotificationsAlert.jsx
import { useEffect, useState } from 'react';
import { Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import API_URL from '../config/api';
import { useAuth } from '../hooks/useAuth';

export default function NotificationsAlert() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(true);
//  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//  const token = userInfo?.token;
const { token, userInfo } = useAuth(); 
if (!userInfo) return null; 

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_URL}/api/patient/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setNotifications(data);
          }
        }
      } catch (error) {
        console.error('Erreur chargement notifications:', error);
      }
    };

    if (userInfo?.role === 'patient') {
      fetchNotifications();
    }
  }, [token, userInfo?.role]);

  const handleClose = async () => {
    setOpen(false);
    // ✅ Marquer comme lues
    await fetch(`${API_URL}/api/patient/notifications/lire`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  if (notifications.length === 0 || !open) return null;

  return (
    <Collapse in={open}>
      <Alert
        severity="info"
        action={
          <IconButton size="small" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        {notifications[0].message}
      </Alert>
    </Collapse>
  );
}