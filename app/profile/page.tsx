'use client';

import React from 'react';
import styles from './page.module.css';

import { Amplify, Auth } from 'aws-amplify';
import awsExports from '@/src/aws-exports';
import { Box } from '@mui/material';

Amplify.configure({ ...awsExports, ssr: true });

export default function ProfilePage() {
  return (
    <main className={styles.main}>
      <Box
        sx={{
          width: '100%',
          // height: '100vh',
          padding: '3rem',
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'center',
          mb: '3rem',
        }}
      ></Box>
    </main>
  );
}
