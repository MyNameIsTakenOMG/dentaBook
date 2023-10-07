'use client';
import { Amplify, Auth } from 'aws-amplify';
import awsExports from '../src/aws-exports';

import Image from 'next/image';
import styles from './page.module.css';
import { Authenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';

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
      this is home page
      <p>test if amplify cicd cypress setup already</p>
      <Authenticator services={services} formFields={formFields}>
        {({ user, signOut }) => {
          return (
            <main>
              <h1>Hello {user?.username}</h1>
              <button onClick={signOut}>Sign out</button>
            </main>
          );
        }}
      </Authenticator>
    </main>
  );
}
