import { Box, Container, Grid, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useTheme, useMediaQuery } from '@mui/material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="h6" 
                component={RouterLink} 
                to="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 700,
                  mb: 2
                }}
              >
                EventBooking
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Your premier destination for event tickets and experiences. 
                Book with confidence for concerts, sports, theater and more.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Link href="#" color="inherit">
                  <FacebookIcon />
                </Link>
                <Link href="#" color="inherit">
                  <TwitterIcon />
                </Link>
                <Link href="#" color="inherit">
                  <InstagramIcon />
                </Link>
                <Link href="#" color="inherit">
                  <LinkedInIcon />
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                component={RouterLink} 
                to="/events" 
                color="inherit" 
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Events
              </Link>
              <Link 
                component={RouterLink} 
                to="/about" 
                color="inherit" 
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                About Us
              </Link>
              <Link 
                component={RouterLink} 
                to="/contact" 
                color="inherit" 
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Contact
              </Link>
              <Link 
                component={RouterLink} 
                to="/faq" 
                color="inherit" 
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                FAQ
              </Link>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                component={RouterLink} 
                to="/privacy" 
                color="inherit" 
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Privacy Policy
              </Link>
              <Link 
                component={RouterLink} 
                to="/terms" 
                color="inherit" 
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Terms of Service
              </Link>
              <Link 
                component={RouterLink} 
                to="/refund" 
                color="inherit" 
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Refund Policy
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="body2">
                <strong>Email:</strong> support@eventbooking.com
              </Typography>
              <Typography variant="body2">
                <strong>Phone:</strong> +1 (555) 123-4567
              </Typography>
              <Typography variant="body2">
                <strong>Address:</strong> 123 Event St, San Francisco, CA 94107
              </Typography>
              {!isMobile && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    "The best way to find yourself is to lose yourself in the service of others."
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
          mt: 4, 
          pt: 4,
          textAlign: 'center'
        }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} EventBooking. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;