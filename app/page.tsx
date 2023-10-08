'use client';
import { Amplify, Auth } from 'aws-amplify';
import awsExports from '@/src/aws-exports';

import Image from 'next/image';
import styles from './page.module.css';
import { Authenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';
import { Box, Stack } from '@mui/material';

Amplify.configure({ ...awsExports, ssr: true });

const formFields = {
  signUp: {
    email: {
      order: 1,
    },
    phone_number: {
      order: 2,
    },
    given_name: {
      order: 3,
    },
    family_name: {
      order: 4,
    },
    password: {
      order: 5,
    },
    confirm_password: {
      order: 6,
    },
  },
};

export default function Home() {
  const services = {
    async handleSignUp(formData: any) {
      let { username, password, attributes } = formData;
      return Auth.signUp({
        username,
        password,
        attributes: {
          ...attributes,
          'custom:role': 'client',
        },
        autoSignIn: {
          enabled: true,
        },
      });
    },
  };

  return (
    <main className={styles.main}>
      {/* <Authenticator services={services} formFields={formFields}>
        {({ user, signOut }) => {
          return (
            <main>
              <h1>Hello {user?.username}</h1>
              <button onClick={signOut}>Sign out</button>
            </main>
          );
        }}
      </Authenticator> */}
      <Box
        id="landing"
        sx={{
          width: '100%',
          maxWidth: '1200px',
          height: '100vh',
          backgroundImage: "url('/landing-page-img.webp')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          padding: '3rem',
          display: 'flex',
          flexFlow: 'column-reverse',
        }}
      >
        <Stack direction={'row'}>
          <Stack direction={'column'} sx={{ width: '50%' }}>
            slogan
          </Stack>
          <Stack direction={'column'} sx={{ width: '50%' }}>
            phone_number, email, and address
          </Stack>
        </Stack>
      </Box>
    </main>
  );
}
