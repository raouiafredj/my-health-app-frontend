// src/components/DashboardCard.jsx
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';

export default function DashboardCard({ title, value, icon, bgColor, textColor = '#fff' }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        bgcolor: bgColor || theme.palette.primary.main,
        color: textColor,
        borderRadius: 2,
        boxShadow: 3,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
        
      }}
    >
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" color="inherit" fontWeight="500">
              {title}
            </Typography>
            <Typography variant="h4" color="inherit" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              fontSize: 40,
              display: 'flex',
              alignItems: 'center',
              color: 'rgba(255,255,255,0.9)'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}