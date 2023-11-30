'use client';

import React from 'react';
import styles from './AuthenticatorModal.module.css';
import { Amplify, Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// import awsExports from '@/src/aws-exports';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch } from '../store';
import { closeModal } from '../store/authSlice';
// Amplify.configure({ ...awsExports, ssr: true });

const formFields = {
  signIn: {
    username: {
      placeholder: 'Enter Your Email Here',
      isRequired: true,
      label: 'Email:'
    },
  },
  signUp: {
    email: {
      order: 1,
    },
    phone_number: {
      order: 2,
      dialCodeList: ['+1'],
      pattern: '/^+[0-9]{10}$/',
    },
    given_name: {
      order: 3,
      pattern: '/^[a-zA-Z]+$/',
      max: 50,
    },
    family_name: {
      order: 4,
      pattern: '/^[a-zA-Z]+$/',
      max: 50,
    },
    password: {
      order: 5,
    },
    confirm_password: {
      order: 6,
    },
  },
};

export default function AuthenticatorModal() {
  const dispatch = useAppDispatch();

  const services = {
    async handleSignUp(formData: any) {
      let { username, password, attributes } = formData;
      let { phone_number, family_name, given_name, ...others } = attributes;
      return Auth.signUp({
        username: username.toLowerCase(),
        password,
        attributes: {
          phone_number: phone_number.slice(-10),
          family_name: family_name.toLowerCase(),
          given_name: given_name.toLowerCase(),
          ...others,
          'custom:role': 'client',
        },
        autoSignIn: {
          enabled: true,
        },
      });
    },
  };
  return (
    <div>
      <Authenticator
        loginMechanisms={['email']}
        className={styles['custom-zIndex']}
        variation="modal"
        formFields={formFields}
        services={services}
      ></Authenticator>
      <Button
        data-cy="auth-modal-close-btn"
        sx={{ position: 'fixed', top: 0, left: 0, zIndex: 1500 }}
        variant="contained"
        color="error"
        onClick={() => {
          dispatch(closeModal());
        }}
      >
        <CloseIcon />
      </Button>
    </div>
  );
}
