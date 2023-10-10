'use client';
import { Amplify, Auth } from 'aws-amplify';
// import awsExports from '@/src/aws-exports';
import React from 'react';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import MenuIcon from '@mui/icons-material/Menu';
import { blue } from '@mui/material/colors';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../store';
import { clearAuthInfo, loadErrorInfo, openModal } from '../store/authSlice';

// Amplify.configure({ ...awsExports, ssr: true });

const typographyTheme = createTheme({
  typography: {
    fontFamily: ['Rubik', 'sans-serif'].join(','),
  },
});

export default function Header() {
  const dispatch = useAppDispatch();
  const authInfo = useAppSelector((state) => state.auth.authInfo);

  return (
    <AppBar
      position="fixed"
      color="transparent"
      sx={{
        // maxWidth: '1200px',
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.9)',
        boxShadow: 'unset',
        backdropFilter: 'blur(8px)',
        // opacity: 0.9,
        // left: { xs: 0, lg: 'calc((100% - 1200px) / 2)' },
      }}
    >
      <Toolbar
        sx={{
          px: { xs: '16px', md: '24px', lg: '48px' },
          width: '100%',
          maxWidth: '1200px',
          marginLeft: { xs: 0, lg: 'calc((100% - 1200px) / 2)' },
        }}
      >
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <ThemeProvider theme={typographyTheme}>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: '#1a73e8' }}
          >
            Dr.Gao Family Dentistry
          </Typography>
        </ThemeProvider>
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'row nowrap',
            columnGap: 6,
            flexGrow: 1,
          }}
        >
          <Link href="#landing">
            <Typography variant="body1" component="div">
              Home
            </Typography>
          </Link>
          <Link href="#services">
            <Typography variant="body1" component="div">
              Services
            </Typography>
          </Link>
          <Link href="#about">
            <Typography variant="body1" component="div">
              About
            </Typography>
          </Link>
          {/* <Typography variant="body1" component="div" >
            Reviews
          </Typography> */}
        </Box>
        {authInfo ? (
          <Stack direction={'row'} sx={{ columnGap: '0.5rem' }}>
            <Tooltip title={authInfo.email}>
              <Typography variant="body2">
                Hi, {authInfo.email.slice(6)}...
              </Typography>
            </Tooltip>
            <Button
              onClick={async () => {
                try {
                  await Auth.signOut();
                  dispatch(clearAuthInfo());
                } catch (error: any) {
                  console.log('sign out error: ' + error.message);
                  dispatch(loadErrorInfo(error.message));
                }
              }}
              color="inherit"
              size="medium"
              variant="outlined"
              disableElevation
              sx={{ borderRadius: '50px' }}
            >
              Logout
            </Button>
          </Stack>
        ) : (
          <Button
            onClick={() => {
              dispatch(openModal());
            }}
            color="inherit"
            size="medium"
            variant="outlined"
            disableElevation
            sx={{ borderRadius: '50px' }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
