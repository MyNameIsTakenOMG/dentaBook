'use client';
import { Amplify, Auth } from 'aws-amplify';
// import awsExports from '@/src/aws-exports';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { blue } from '@mui/material/colors';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { openModal } from '@/app/store/authSlice';
// Amplify.configure({ ...awsExports, ssr: true });

const drawerWidth = 240;
const navItems = ['Home', 'Services', 'About'];

export default function HeaderDrawer({
  openDrawer,
  setOpenDrawer,
}: {
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const authInfo = useAppSelector((state) => state.auth.authInfo);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const drawerContent = (
    <Box sx={{ textAlign: 'center', color: blue['500'] }}>
      <Stack direction={'column'} sx={{ my: 2 }}>
        <Typography variant="h6">Dr.Gao</Typography>
        <Typography variant="h6">Family Dentistry</Typography>
      </Stack>
      <Divider />
      <List>
        {navItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              sx={{ textAlign: 'center' }}
              onClick={() => {
                if (index === 0) {
                  router.push('/#landing');
                  setOpenDrawer((prevState) => !prevState);
                } else if (index === 1) {
                  router.push('/#services');
                  setOpenDrawer((prevState) => !prevState);
                } else if (index === 2) {
                  router.push('/#about');
                  setOpenDrawer((prevState) => !prevState);
                }
              }}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {authInfo !== null && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                router.push('/profile');
                setOpenDrawer((prevState) => !prevState);
              }}
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary={'Profile'} />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              if (authInfo !== null) {
                Auth.signOut();
                router.push('/#landing');
                setOpenDrawer((prevState) => !prevState);
              } else {
                dispatch(openModal());
                setOpenDrawer((prevState) => !prevState);
              }
            }}
            sx={{ textAlign: 'center' }}
          >
            <ListItemText primary={authInfo !== null ? 'Logout' : 'Login'} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={openDrawer}
        onClose={() => {
          setOpenDrawer((prevState) => !prevState);
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
          color: blue['500'],
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
