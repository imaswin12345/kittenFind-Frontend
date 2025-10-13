import React from 'react';
import { Box, Container, Typography, Link, Divider, Stack, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, YouTube } from '@mui/icons-material';
import { Pets } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        mt: 'auto',
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          {/* Logo & Description */}
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'white',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h5" color="white" fontWeight={700}>
                  <Pets sx={{ fontSize: 32, color: 'primary.main' }} />
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                KittyFind
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 300 }}>
              Helping reunite lost cats with their loving families. Report found cats and connect with owners in your community.
            </Typography>
            {/* Social Links */}
            <Stack direction="row" spacing={1}>
              <IconButton
                component={Link}
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                aria-label="Facebook"
              >
                <Facebook />
              </IconButton>
              <IconButton
                component={Link}
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                aria-label="Twitter"
              >
                <Twitter />
              </IconButton>
              <IconButton
                component={Link}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                aria-label="Instagram"
              >
                <Instagram />
              </IconButton>
              <IconButton
                component={Link}
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                aria-label="YouTube"
              >
                <YouTube />
              </IconButton>
            </Stack>
          </Box>

          {/* Navigation Links */}
          <Stack spacing={2} sx={{ minWidth: 150 }}>
            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
              Links
            </Typography>
            <Link href="/" color="text.secondary" underline="hover" variant="body2">
              Home
            </Link>
            <Link href="/post" color="text.secondary" underline="hover" variant="body2">
              Post Cat
            </Link>
            <Link href="/dashboard" color="text.secondary" underline="hover" variant="body2">
              Dashboard
            </Link>
          </Stack>

          {/* Company Info */}
          <Stack spacing={2} sx={{ minWidth: 150 }}>
            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
              Company
            </Typography>
            <Link href="/about" color="text.secondary" underline="hover" variant="body2">
              About Us
            </Link>
            <Link href="/contact" color="text.secondary" underline="hover" variant="body2">
              Contact
            </Link>
            <Link href="/privacy" color="text.secondary" underline="hover" variant="body2">
              Privacy Policy
            </Link>
          </Stack>

          {/* Support */}
          <Stack spacing={2} sx={{ minWidth: 150 }}>
            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
              Support
            </Typography>
            <Link href="/faq" color="text.secondary" underline="hover" variant="body2">
              FAQ
            </Link>
            <Link href="/help" color="text.secondary" underline="hover" variant="body2">
              Help Center
            </Link>
            <Link href="mailto:support@kittyfind.com" color="text.secondary" underline="hover" variant="body2">
              support@kittyfind.com
            </Link>
          </Stack>
        </Stack>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', md: 'space-between' },
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} KittyFind. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Made with ❤️ for cats
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;