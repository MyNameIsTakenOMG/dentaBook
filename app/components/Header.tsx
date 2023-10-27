'use client';
import { Amplify, Auth, Hub } from 'aws-amplify';
import awsExports from '@/src/aws-exports';
import React, { Dispatch, useEffect, useState } from 'react';
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
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../store/index';
import {
  clearAuthInfo,
  loadAuthInfo,
  loadErrorInfo,
  openModal,
} from '../store/authSlice';
import {
  ThunkDispatch,
  CombinedState,
  AnyAction,
  ActionCreatorWithPayload,
} from '@reduxjs/toolkit';
import { AuthState } from '../store/authSlice';
import HeaderDrawer from './header-components/HeaderDrawer';
import { blue } from '@mui/material/colors';

Amplify.configure({ ...awsExports, ssr: true });

const typographyTheme = createTheme({
  typography: {
    fontFamily: ['Rubik', 'sans-serif'].join(','),
  },
});

export default function Header() {
  const dispatch: ThunkDispatch<
    CombinedState<{
      auth: AuthState;
    }>,
    undefined,
    AnyAction
  > &
    Dispatch<AnyAction> = useAppDispatch();
  const authInfo = useAppSelector((state) => state.auth.authInfo);

  // console.log('authInfo: ', authInfo);
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    // load auth info for the first time
    loadAuthInfoInitially(dispatch, loadAuthInfo);
    // listen to auth events
    const stop = listener(dispatch, loadAuthInfo);

    return () => {
      stop();
    };
  }, []);

  return (
    <>
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
            sx={{ mr: 2, display: { xs: 'inline-flex', sm: 'none' } }}
            onClick={() => {
              setOpenDrawer((prevState) => !prevState);
            }}
          >
            <MenuIcon />
          </IconButton>
          <ThemeProvider theme={typographyTheme}>
            <Typography
              variant={'h6'}
              component="div"
              sx={{
                flexGrow: 1,
                color: '#1a73e8',
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              Dr.Gao Family Dentistry
            </Typography>
          </ThemeProvider>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexFlow: 'row nowrap',
              columnGap: 3,
              flexGrow: 3,
            }}
          >
            <Link href="/#landing">
              <Typography
                variant="body1"
                component="div"
                sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
              >
                Home
              </Typography>
            </Link>
            <Link href="/#services">
              <Typography
                variant="body1"
                component="div"
                sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
              >
                Services
              </Typography>
            </Link>
            <Link href="/#about">
              <Typography
                variant="body1"
                component="div"
                sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
              >
                About
              </Typography>
            </Link>
            {authInfo !== null && (
              <Link href="/profile">
                <Typography
                  variant="body1"
                  component="div"
                  sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                >
                  Profile
                </Typography>
              </Link>
            )}
          </Box>
          <Stack direction={'row'} sx={{ columnGap: '0.5rem' }}>
            {authInfo !== null && (
              <Tooltip data-cy="header-tooltip-title" title={authInfo.email}>
                <Typography
                  variant="body2"
                  sx={{ alignSelf: 'center', color: blue['500'] }}
                >
                  Hi, {authInfo.email.slice(0, 6)}...
                </Typography>
              </Tooltip>
            )}
            <Button
              data-cy="header-login-btn"
              onClick={async () => {
                if (authInfo !== null) {
                  try {
                    await Auth.signOut();
                    dispatch(clearAuthInfo());
                  } catch (error: any) {
                    console.log('sign out error: ' + error.message);
                    dispatch(loadErrorInfo(error.message));
                  }
                } else dispatch(openModal());
              }}
              color="inherit"
              size="small"
              variant="outlined"
              disableElevation
              sx={{
                borderRadius: '50px',
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                p: { xs: '3px 9px', md: '5px 15px' },
              }}
            >
              {authInfo !== null ? 'Logout' : 'Login'}
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <HeaderDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
    </>
  );
}

const loadAuthInfoInitially = async (
  dispatch: ThunkDispatch<
    CombinedState<{
      auth: AuthState;
    }>,
    undefined,
    AnyAction
  > &
    Dispatch<AnyAction>,
  loadAuthInfo: ActionCreatorWithPayload<any, 'auth/loadAuthInfo'>
) => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    console.log('user already logged in: ', user);
    const { email_verified, phone_number_verified, ...others } =
      user?.attributes;
    dispatch(loadAuthInfo({ ...others }));
  } catch (err) {
    console.log('error: ', err);
    dispatch(loadAuthInfo(undefined));
  }
};

const listener = (
  dispatch: ThunkDispatch<
    CombinedState<{
      auth: AuthState;
    }>,
    undefined,
    AnyAction
  > &
    Dispatch<AnyAction>,
  loadAuthInfo: ActionCreatorWithPayload<any, 'auth/loadAuthInfo'>
) => {
  return Hub.listen('auth', (data) => {
    console.log('data: ', data);
    let { email_verified, phone_number_verified, ...others } =
      data.payload.data?.attributes;

    switch (data?.payload?.event) {
      case 'configured':
        console.log('the Auth module is configured');
        break;
      case 'signIn':
        console.log('user signed in');
        dispatch(loadAuthInfo({ ...others }));
        break;
      case 'signIn_failure':
        console.error('user sign in failed');
        break;
      case 'signUp':
        console.log('user signed up');
        break;
      case 'signUp_failure':
        console.error('user sign up failed');
        break;
      case 'confirmSignUp':
        console.log('user confirmation successful');
        dispatch(loadAuthInfo({ ...others }));
        break;
      case 'completeNewPassword_failure':
        console.error('user did not complete new password flow');
        break;
      case 'autoSignIn':
        console.log('auto sign in successful');
        break;
      case 'autoSignIn_failure':
        console.error('auto sign in failed');
        break;
      case 'forgotPassword':
        console.log('password recovery initiated');
        break;
      case 'forgotPassword_failure':
        console.error('password recovery failed');
        break;
      case 'forgotPasswordSubmit':
        console.log('password confirmation successful');
        break;
      case 'forgotPasswordSubmit_failure':
        console.error('password confirmation failed');
        break;
      case 'verify':
        console.log('TOTP token verification successful');
        break;
      case 'tokenRefresh':
        console.log('token refresh succeeded');
        break;
      case 'tokenRefresh_failure':
        console.error('token refresh failed');
        break;
      case 'cognitoHostedUI':
        console.log('Cognito Hosted UI sign in successful');
        break;
      case 'cognitoHostedUI_failure':
        console.error('Cognito Hosted UI sign in failed');
        break;
      case 'customOAuthState':
        console.log('custom state returned from CognitoHosted UI');
        break;
      case 'customState_failure':
        console.error('custom state failure');
        break;
      case 'parsingCallbackUrl':
        console.log('Cognito Hosted UI OAuth url parsing initiated');
        break;
      // case 'userDeleted':
      //   console.log('user deletion successful');
      //   break;
      // case 'updateUserAttributes':
      //   console.log('user attributes update successful');
      //   break;
      // case 'updateUserAttributes_failure':
      //   console.log('user attributes update failed');
      //   break;
      case 'signOut':
        console.log('user signed out');
        break;
      default:
        console.log('unknown event type');
        break;
    }
  });
};
