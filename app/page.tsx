'use client';
import { Amplify, Auth } from 'aws-amplify';
import awsExports from '@/src/aws-exports';

import Image from 'next/image';
import styles from './page.module.css';
import { Authenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { blue, grey } from '@mui/material/colors';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FaxIcon from '@mui/icons-material/Fax';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import AuthenticatorModal from './components/AuthenticatorModal';
import { useAppDispatch, useAppSelector } from './store';
import { openModal as openAuthModal } from './store/authSlice';
import { openModal as openBookModal } from './store/bookSlice';
import BookModal from './components/BookModal';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

Amplify.configure({ ...awsExports, ssr: true });

const typographyTheme = createTheme({
  typography: {
    fontFamily: ['Rubik', 'sans-serif'].join(','),
  },
});

const services = [
  {
    img: '/root-canal.webp',
    alt: 'Root Canal',
    name: 'Root Canal',
    description:
      'Replacing the damaged or infected part of a tooth with a filling.A root canal may need to be performed in stages over a few appointments.After root canal treatment is completed, the biting surface is covered with filling material or a crown. This also protects the tooth from breaking after root canal treatment.',
  },
  {
    img: '/dental-implant.webp',
    alt: 'Dental implants',
    name: 'Dental implants',
    description:
      'Dental implants can be used to replace missing teeth. An implant is an artificial screw-shaped device made of titanium. It is surgically fixed into the jaw and an artificial tooth can be fitted on top of it. Several dental appointments are required for treatment planning, design and fitting of implants.',
  },
  {
    img: '/cosmetic.webp',
    alt: 'Cosmetic Dentistry',
    name: 'Cosmetic Dentistry',
    description:
      'Cosmetic dentistry focuses on improving the appearance and aesthetics of your smile. Common cosmetic dental procedures include teeth whitening, dental bonding and veneers. If your teeth are discoloured, worn, broken, misaligned, or have gaps between them, cosmetic dental procedures might help improve their colour and symmetry.',
  },
];

export default function Home() {
  const isAuthModalOpen = useAppSelector((state) => state.auth.isModalOpen);
  const authInfo = useAppSelector((state) => state.auth.authInfo);
  const dispatch = useAppDispatch();

  return (
    <main className={styles.main}>
      {/* authenticator modal */}
      {isAuthModalOpen === true ? <AuthenticatorModal /> : null}

      {/* book_an_appointment modal  */}
      <BookModal />

      {/* landing section  */}
      <Box
        id="landing"
        sx={{
          width: '100%',
          // maxWidth: '1200px',
          height: '100vh',
          backgroundImage: "url('/landing-page-img.webp')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          padding: '3rem',
          display: 'flex',
          flexFlow: 'column-reverse',
          alignItems: 'center',
          mb: '3rem',
        }}
      >
        <Stack
          direction={'row'}
          sx={{
            flexFlow: { xs: 'column', sm: 'row' },
            justifyContent: { xs: 'end', sm: 'unset' },
            height: { xs: '90vh', sm: '70vh' },
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          <Stack
            direction={'column'}
            sx={{
              width: { xs: '100%', sm: '50%' },
              p: { xs: '0.5rem 1rem', sm: '1rem 1.5rem' },
            }}
          >
            <Typography variant="body2" sx={{ color: blue['500'] }}>
              SMILE. EVERYDAY.
            </Typography>
            <ThemeProvider theme={typographyTheme}>
              <Typography variant="h3">Your Teeth Health, We Care</Typography>
            </ThemeProvider>
            <Typography
              variant="body1"
              sx={{
                display: { sm: 'block' },
                marginBottom: { xs: '1rem', sm: '2rem' },
                color: grey['600'],
              }}
            >
              Teeth health is very important for our lives. Here, at Dr.Gao's
              Dental, your dental health will be taken good care of.
            </Typography>
            <Stack direction={'row'}>
              <Box sx={{ width: '50%' }}>
                <Button
                  onClick={() => {
                    dispatch(openBookModal());
                  }}
                  variant="contained"
                  disableElevation
                  size="small"
                  sx={{
                    borderRadius: '50px',
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    p: { xs: '3px 9px', md: '5px 15px' },
                  }}
                >
                  {authInfo ? 'Book Now' : 'Book as Guest'}
                </Button>
              </Box>
              <Box
                sx={{ width: '50%', display: 'flex', flexFlow: 'row nowrap' }}
              >
                {authInfo ? (
                  <ThemeProvider theme={typographyTheme}>
                    <Typography
                      data-cy="home-landing-welcome"
                      sx={{ alignSelf: 'center' }}
                      variant="body2"
                    >
                      Welcome, {authInfo.given_name}!
                    </Typography>
                  </ThemeProvider>
                ) : (
                  <Button
                    data-cy="home-landing-login-btn"
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: '50px',
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      p: { xs: '3px 9px', md: '5px 15px' },
                    }}
                    disableElevation
                    onClick={() => {
                      dispatch(openAuthModal());
                    }}
                  >
                    Login
                  </Button>
                )}
              </Box>
            </Stack>
          </Stack>
          <Stack
            justifyContent={'center'}
            direction={'column'}
            sx={{
              width: { xs: '100%', sm: '50%' },
              p: { xs: '0.5rem 1rem', sm: '1rem 1.5rem' },
            }}
          >
            <Paper
              elevation={5}
              sx={{
                borderRadius: '20px',
                backgroundColor: blue['400'],
                color: 'white',
                p: { xs: '0.5rem', sm: '1rem' },
                display: 'flex',
                flexFlow: 'column nowrap',
                rowGap: '0.5rem',
                fontSize: '0.75rem',
              }}
            >
              <Stack direction={'row'} columnGap={'0.5rem'}>
                <PhoneInTalkIcon />
                <Typography>Phone: 905-731-8858</Typography>
              </Stack>
              <Stack direction={'row'} columnGap={'0.5rem'}>
                <FaxIcon />
                <Typography>Fax: 905-731-8855</Typography>
              </Stack>
              <Stack direction={'row'} columnGap={'0.5rem'}>
                <EmailIcon />
                <Typography>Email: dentalGao@gmail.com</Typography>
              </Stack>
              <Stack direction={'row'} columnGap={'0.5rem'}>
                <LocationOnIcon />
                <Typography>
                  Address: 8131 Yonge Street, Unit 202 Thornhill, ON L3T 2C6
                </Typography>
              </Stack>
            </Paper>
          </Stack>
        </Stack>
      </Box>

      {/* services section  */}
      <Box
        id="services"
        sx={{
          width: '100%',
          // height: '100vh',
          padding: '3rem',
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'center',
          mb: '3rem',
        }}
      >
        <ThemeProvider theme={typographyTheme}>
          <Typography
            variant="h6"
            sx={{ maxWidth: '400px', textAlign: 'center', mb: '4rem' }}
          >
            The Main Features Of Our Services To Serve Our{' '}
            <span style={{ color: blue['A200'] }}>Patients</span>.
          </Typography>
        </ThemeProvider>
        {/* <Box
          sx={{
            display: 'flex',
            flexFlow: 'row wrap',
            gap: '1rem',
            width: '100%',
            maxWidth: '1200px',
            justifyContent: { xs: 'center', sm: 'start' },
          }}
        > */}
        <Grid2 container spacing={2} sx={{ maxWidth: '1200px' }}>
          {services.map((service, index) => {
            return (
              <Grid2 key={index} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    // width: { xs: '100%', sm: '45%', lg: '30%' },
                    maxWidth: 360,
                    display: 'flex',
                    flexFlow: 'column nowrap',
                  }}
                  elevation={5}
                >
                  <CardMedia
                    component="img"
                    alt={service.alt}
                    height="160"
                    image={service.img}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {service.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant="contained" disableElevation>
                      Book Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid2>
            );
          })}
        </Grid2>
        {/* </Box> */}
      </Box>

      {/* about section  */}
      <Box
        id="about"
        sx={{
          width: '100%',
          // height: '100vh',
          backgroundColor: '#f3fbff',
          padding: '3rem',
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'center',
          mb: '3rem',
        }}
      >
        <ThemeProvider theme={typographyTheme}>
          <Typography
            variant="h6"
            sx={{ maxWidth: '400px', textAlign: 'center', mb: '4rem' }}
          >
            About <span style={{ color: blue['500'] }}>Me</span>
          </Typography>
        </ThemeProvider>
        <Box
          sx={{
            display: 'flex',
            flexFlow: { xs: 'column', md: 'row' },
            width: '100%',
            maxWidth: '1200px',
            justifyContent: { xs: 'center', md: 'space-between' },
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              display: 'flex',
              justifyContent: { xs: 'center' },
              alignItems: { md: 'start' },
              mb: '2rem',
            }}
          >
            <Card elevation={3} sx={{ width: '70%', maxWidth: '360px' }}>
              <CardMedia
                component="img"
                alt="dentist"
                sx={{ aspectRatio: (3 / 4).toString() }}
                image="/dentist1.webp"
              />
            </Card>
          </Box>
          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'start',
            }}
          >
            <Paper
              elevation={3}
              sx={{
                width: '70%',
                maxWidth: '360px',
                minHeight: '480px',
                p: '1rem',
              }}
            >
              <Typography>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequuntur perferendis iusto sint quaerat sunt aspernatur
                eveniet sapiente necessitatibus laborum quae.
              </Typography>
              <br />
              <Typography>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequuntur perferendis iusto sint quaerat sunt aspernatur
                eveniet sapiente necessitatibus laborum quae.
              </Typography>
              <br />
              <Typography>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequuntur perferendis iusto sint quaerat sunt aspernatur
                eveniet sapiente necessitatibus laborum quae.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* clinic info and map section  */}
      <Box
        id="clinic-and-map"
        sx={{
          width: '100%',
          // height: '100vh',
          padding: '3rem',
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'center',
          mb: '3rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexFlow: { xs: 'column', md: 'row' },
            width: '100%',
            maxWidth: '1200px',
            p: '1rem',
            gap: '1rem',
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              display: 'flex',
              flexFlow: 'column nowrap',
              rowGap: '1rem',
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: '2rem', width: '80%', alignSelf: 'center' }}
            >
              Feel free to contact us!
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexFlow: { xs: 'column', sm: 'row' },
                justifyContent: { xs: 'center', sm: 'center' },
                gap: '1rem',
              }}
            >
              <Box
                sx={{
                  width: { xs: '100%', sm: '40%' },
                  display: 'flex',
                  flexFlow: 'column',
                  rowGap: '1rem',
                }}
              >
                <Stack direction={'column'}>
                  <Typography sx={{ fontWeight: 'bold' }}>Address:</Typography>
                  <Typography>
                    8131 Yonge Street, Unit 202 Thornhill, ON L3T 2C6
                  </Typography>
                </Stack>
                <Stack direction={'column'}>
                  <Typography sx={{ fontWeight: 'bold' }}>Phone:</Typography>
                  <Typography>905-731-8858</Typography>
                </Stack>
                <Stack direction={'column'}>
                  <Typography sx={{ fontWeight: 'bold' }}>Fax:</Typography>
                  <Typography>905-731-8855</Typography>
                </Stack>
                <Stack direction={'column'}>
                  <Typography sx={{ fontWeight: 'bold' }}>Email:</Typography>
                  <Typography>dentalGao@gmail.com</Typography>
                </Stack>
              </Box>
              <Box
                sx={{
                  width: { xs: '100%', sm: '40%' },
                  display: 'flex',
                  flexFlow: 'column',
                }}
              >
                <Typography sx={{ fontWeight: 'bold', mb: '2rem' }}>
                  Working Hours
                </Typography>
                <Stack direction={'row'} sx={{ columnGap: '0.5rem' }}>
                  <Stack direction={'column'}>
                    <Typography>Mon: </Typography>
                    <Typography>Tue: </Typography>
                    <Typography>Wed: </Typography>
                    <Typography>Thu: </Typography>
                    <Typography>Fri: </Typography>
                    <Typography>Sat: </Typography>
                    <Typography>Sun: </Typography>
                  </Stack>
                  <Stack direction={'column'}>
                    <Typography>9:00am-6:00pm</Typography>
                    <Typography>9:00am-6:00pm</Typography>
                    <Typography>9:00am-6:00pm</Typography>
                    <Typography>9:00am-6:00pm</Typography>
                    <Typography>9:00am-6:00pm</Typography>
                    <Typography>9:00am-6:00pm</Typography>
                    <Typography>9:00am-6:00pm</Typography>
                  </Stack>
                </Stack>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', width: '80%', alignSelf: 'center' }}>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  borderRadius: '50px',
                }}
              >
                Book an appointment
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              overflow: 'auto',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <iframe
              width="450"
              height="450"
              style={{ border: 0 }}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_EMBED_MAP_API_KEY}&q=EjU4MTMxIFlvbmdlIFN0IHVuaXQgMjAyLCBUaG9ybmhpbGwsIE9OIEwzVCAyQzYsIENhbmFkYSIkGiIKFgoUChIJE82ed30sK4gRL66QeAndBJASCHVuaXQgMjAy
8131 Yonge St unit 202, Thornhill, ON L3T 2C6, Canada`}
              allowFullScreen
            ></iframe>
          </Box>
        </Box>
      </Box>
    </main>
  );
}
