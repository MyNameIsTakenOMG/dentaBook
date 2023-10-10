import React from 'react';
import styles from './page.module.css';
import { Amplify, Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from '@/src/aws-exports';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch } from './store';
import { closeModal } from './store/authSlice';
Amplify.configure(awsExports);

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

export default function AuthenticatorModal() {
  const dispatch = useAppDispatch();

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
    <div>
      <Authenticator
        className={styles['custom-zIndex']}
        variation="modal"
        formFields={formFields}
        services={services}
      ></Authenticator>
      <Button
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
