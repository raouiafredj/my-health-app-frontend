// src/components/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Toolbar,
  Button,
  ListItemButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Healing as HealingIcon,
  Description as DescriptionIcon,
  Share as ShareIcon,
  MonitorHeart as MonitorHeartIcon,
  LibraryBooks as LibraryBooksIcon,
  CalendarToday as CalendarTodayIcon,
  Logout as LogoutIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import NotificationMenu from './NotificationMenu';

const drawerWidth = 240;

export default function Sidebar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Récupération sécurisée de userInfo
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  // ✅ Si pas connecté, affichez juste le contenu (ex: login, register)
  if (!userInfo) {
    return <>{children}</>;
  }

  const isMedecin = userInfo?.role === 'medecin';
  const dashboardPath = isMedecin ? '/dashboard-medecin' : '/dashboard-patient';

  // ✅ Redirection automatique
  React.useEffect(() => {
    if (
      location.pathname === '/' ||
      location.pathname === '/dashboard-medecin' ||
      location.pathname === '/dashboard-patient'
    ) {
      navigate(dashboardPath, { replace: true });
    }
  }, [location.pathname, navigate, dashboardPath]);

  const menuItems = isMedecin
    ? [
        { text: 'Mes Visites', icon: <HealingIcon />, path: '/visites' },
        { text: 'Ordonnances', icon: <DescriptionIcon />, path: '/ordonnances' },
        { text: 'Valider Partages', icon: <ShareIcon />, path: '/validation-partages' },
        { text: 'Historique Médical', icon: <LibraryBooksIcon />, path: '/historique-medecin' },
        { text: 'Vaccins', icon: <HealingIcon />, path: '/vaccins-medecin' }
      ]
    : [
        { text: 'Mes Visites', icon: <HealingIcon />, path: '/mes-visites' },
        { text: 'Mes Ordonnances', icon: <DescriptionIcon />, path: '/mes-ordonnances' },
        { text: 'Biométrie', icon: <MonitorHeartIcon />, path: '/biometrie' },
        { text: 'Partager un médicament', icon: <ShareIcon />, path: '/proposer-partage' },
        { text: 'Historique Médical', icon: <LibraryBooksIcon />, path: '/historique' },
        { text: 'Calendrier', icon: <CalendarTodayIcon />, path: '/calendrier' },
        { text: 'Vaccins', icon: <HealingIcon />, path: '/vaccins' }
      ];

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/', { replace: true });
    window.location.reload();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ color: '#1976d2', fontWeight: 'bold', flexGrow: 1 }}
          >
            {isMedecin
              ? `Dr. ${userInfo.prenom || 'Médecin'} ${userInfo.nom || ''}`
              : `${userInfo.prenom || 'Patient'} ${userInfo.nom || ''}`}
          </Typography>
          {userInfo?.role === 'patient' && <NotificationMenu />}
        </Toolbar>

        <Divider />

        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate(dashboardPath)}
              selected={location.pathname === '/dashboard-medecin' || location.pathname === '/dashboard-patient'}
              sx={{ '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }, py: 1.2, px: 2 }}
            >
              <ListItemIcon>
                <DashboardIcon sx={{ color: '#1976d2' }} />
              </ListItemIcon>
              <ListItemText primary="Tableau de bord" />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ my: 1 }} />

          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{ '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }, py: 1.2, px: 2 }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mt: 'auto' }} />

        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            color="error"
            variant="outlined"
            sx={{
              justifyContent: 'flex-start',
              fontWeight: 'bold',
              textTransform: 'none'
            }}
          >
            Déconnexion
          </Button>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: '#f5f8fa', minHeight: '100vh', p: 3 }}
      >
        {children}
      </Box>
    </Box>
  );
}